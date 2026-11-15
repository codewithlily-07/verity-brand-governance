from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List, Optional
from backend.app.core.database import get_db
from backend.app.models.verity_models import (
    Submission, SubmissionVersion, Finding, BrandRule, ReviewDecision, AuditEvent, BrandProfile
)
from backend.app.api.brand_routes import get_or_create_profile
from backend.app.core.config import settings

router = APIRouter(tags=["Governance Insights & Audit"])

@router.get("/insights")
def get_governance_insights(request: Request, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, request)
    workspace_id = profile.workspace_id

    # 1. Real Submissions in workspace
    submissions = db.query(Submission).filter(Submission.workspace_id == workspace_id).all()
    total_submissions = len(submissions)
    approved_count = sum(1 for s in submissions if s.status == "Approved")
    changes_requested_count = sum(1 for s in submissions if s.status == "Changes Requested")
    rejected_count = sum(1 for s in submissions if s.status == "Rejected")
    in_review_count = sum(1 for s in submissions if s.status in ["In Review", "Submitted", "Resubmitted"])

    # 2. Real Findings analysis across workspace submissions
    sub_ids = [s.id for s in submissions]
    versions = db.query(SubmissionVersion).filter(SubmissionVersion.submission_id.in_(sub_ids)).all() if sub_ids else []
    version_ids = [v.id for v in versions]
    
    findings = []
    if version_ids:
        from backend.app.models.verity_models import AnalysisRun
        runs = db.query(AnalysisRun).filter(AnalysisRun.submission_version_id.in_(version_ids)).all()
        run_ids = [r.id for r in runs]
        if run_ids:
            findings = db.query(Finding).filter(Finding.analysis_run_id.in_(run_ids)).all()

    high_severity_count = sum(1 for f in findings if f.severity == "high")
    resolved_count = sum(1 for f in findings if f.status in ["accepted", "edited", "dismissed"])

    # Categories breakdown from real findings
    cat_counts = {}
    finding_rule_counts = {}
    for f in findings:
        c = f.category or "General"
        cat_counts[c] = cat_counts.get(c, 0) + 1
        if getattr(f, "rule_id", None):
            finding_rule_counts[f.rule_id] = finding_rule_counts.get(f.rule_id, 0) + 1

    common_categories = [
        {"category": k, "count": v}
        for k, v in sorted(cat_counts.items(), key=lambda x: x[1], reverse=True)
    ]

    # Real rules analysis
    rules = db.query(BrandRule).filter(BrandRule.brand_profile_id == profile.id).all()
    most_violated_rules = []
    rules_possibly_unclear = []

    for r in rules:
        real_flags = finding_rule_counts.get(r.code, r.times_flagged or 0)
        total_actions = real_flags
        dismiss_challenge = (r.times_dismissed or 0) + (r.times_challenged or 0)
        rate = (dismiss_challenge / max(total_actions, 1)) * 100

        most_violated_rules.append({
            "code": r.code,
            "title": r.title,
            "category": r.category,
            "times_flagged": real_flags,
            "severity": r.severity
        })

        if dismiss_challenge >= 2 or (rate >= 25.0 and real_flags > 0):
            rules_possibly_unclear.append({
                "code": r.code,
                "title": r.title,
                "category": r.category,
                "times_flagged": real_flags,
                "times_dismissed": r.times_dismissed,
                "times_challenged": r.times_challenged,
                "dismiss_rate_pct": round(rate, 1),
                "suggestion": "Creators frequently challenge or dismiss this rule. Consider reviewing policy phrasing for clarity or adding concrete approved examples in the Brand Knowledge Hub."
            })

    most_violated_rules.sort(key=lambda x: x["times_flagged"], reverse=True)
    rules_possibly_unclear.sort(key=lambda x: x["times_challenged"] + x["times_dismissed"], reverse=True)

    # Real decisions timing
    decisions = db.query(ReviewDecision).filter(ReviewDecision.submission_id.in_(sub_ids)).all() if sub_ids else []
    decision_durations = []
    for dec in decisions:
        sub = next((s for s in submissions if s.id == dec.submission_id), None)
        if sub and dec.created_at and sub.created_at:
            dur = (dec.created_at - sub.created_at).total_seconds() / 60.0
            if dur >= 0:
                decision_durations.append(dur)

    avg_minutes = round(sum(decision_durations) / len(decision_durations), 1) if decision_durations else None
    resolution_rate = round((resolved_count / len(findings)) * 100, 1) if findings else None
    pre_review_fix_rate = round((resolved_count / len(findings)) * 100, 1) if findings else None

    # Derive real Risk Heatmap from submissions and findings
    content_types = ["social", "ad", "email", "website", "press_release", "document"]
    risk_categories = ["Claims", "Facts", "Tone", "Terminology", "Messaging", "Accessibility"]
    heatmap = {cat: {ct: 0 for ct in content_types} for cat in risk_categories}

    for s in submissions:
        ct = (s.content_type or "social").lower()
        if ct not in content_types:
            content_types.append(ct)
            for cat in risk_categories:
                heatmap[cat][ct] = 0
        for v in (s.versions or []):
            for run in (v.analysis_runs or []):
                for f in (run.findings or []):
                    cat = f.category or "Claims"
                    if cat not in heatmap:
                        heatmap[cat] = {c: 0 for c in content_types}
                    heatmap[cat][ct] = heatmap[cat].get(ct, 0) + 1

    has_enough_data = total_submissions > 0 and len(findings) > 0

    return {
        "is_demo_data": False,
        "has_enough_data": has_enough_data,
        "label": "Measured workspace data",
        "total_submissions": total_submissions,
        "approved_count": approved_count,
        "changes_requested_count": changes_requested_count,
        "rejected_count": rejected_count,
        "in_review_count": in_review_count,
        "high_severity_count": high_severity_count,
        "total_findings_resolved": resolved_count,
        "average_decision_time_minutes": avg_minutes,
        "common_categories": common_categories,
        "most_violated_rules": most_violated_rules[:6],
        "rules_possibly_unclear": rules_possibly_unclear,
        "resolution_rate": resolution_rate,
        "pre_review_fix_rate": pre_review_fix_rate,
        "content_types": content_types,
        "risk_categories": risk_categories,
        "risk_heatmap": heatmap
    }

@router.get("/audit")
def get_audit_trail(request: Request, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, request)
    events = (
        db.query(AuditEvent)
        .filter(AuditEvent.workspace_id == profile.workspace_id)
        .order_by(AuditEvent.timestamp.desc())
        .limit(100)
        .all()
    )

    return [
        {
            "id": ev.id,
            "submission_id": ev.submission_id,
            "event_type": ev.event_type,
            "details": ev.details_json,
            "actor_name": ev.actor_name,
            "actor_role": ev.actor_role,
            "version_number": ev.version_number,
            "timestamp": ev.timestamp.isoformat() if ev.timestamp else None
        }
        for ev in events
    ]
