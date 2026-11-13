from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List
from backend.app.core.database import get_db
from backend.app.models.verity_models import (
    Submission, SubmissionVersion, Finding, BrandRule, ReviewDecision, AuditEvent, BrandProfile
)
from backend.app.api.brand_routes import get_or_create_profile
from backend.app.core.config import settings
from backend.app.llm.adapter import llm_adapter

router = APIRouter(tags=["Governance Insights & Audit"])

@router.get("/insights")
def get_governance_insights(request: Request, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, request)
    workspace_id = profile.workspace_id

    # 1. Total submissions in workspace
    submissions = db.query(Submission).filter(Submission.workspace_id == workspace_id).all()
    total_submissions = len(submissions)
    approved_count = sum(1 for s in submissions if s.status == "Approved")
    changes_requested_count = sum(1 for s in submissions if s.status == "Changes Requested")
    rejected_count = sum(1 for s in submissions if s.status == "Rejected")
    in_review_count = sum(1 for s in submissions if s.status in ["In Review", "Submitted", "Resubmitted"])

    # 2. Findings analysis
    findings = db.query(Finding).all()
    high_severity_count = sum(1 for f in findings if f.severity == "high")
    resolved_count = sum(1 for f in findings if f.status in ["accepted", "edited", "dismissed"])

    # Categories breakdown
    cat_counts = {}
    for f in findings:
        c = f.category or "General"
        cat_counts[c] = cat_counts.get(c, 0) + 1
    common_categories = [
        {"category": k, "count": v}
        for k, v in sorted(cat_counts.items(), key=lambda x: x[1], reverse=True)
    ]

    # Rules analysis & "Rules that may be unclear" (high dismiss or challenge count)
    rules = db.query(BrandRule).filter(BrandRule.brand_profile_id == profile.id).all()
    most_violated_rules = []
    rules_possibly_unclear = []

    for r in rules:
        total_actions = r.times_flagged
        dismiss_challenge = r.times_dismissed + r.times_challenged
        rate = (dismiss_challenge / max(total_actions, 1)) * 100
        
        most_violated_rules.append({
            "code": r.code,
            "title": r.title,
            "category": r.category,
            "times_flagged": r.times_flagged,
            "severity": r.severity
        })

        if dismiss_challenge >= 2 or rate >= 25.0:
            rules_possibly_unclear.append({
                "code": r.code,
                "title": r.title,
                "category": r.category,
                "times_flagged": r.times_flagged,
                "times_dismissed": r.times_dismissed,
                "times_challenged": r.times_challenged,
                "dismiss_rate_pct": round(rate, 1),
                "suggestion": "Creators frequently challenge or dismiss this rule. Consider reviewing policy phrasing for clarity or adding concrete approved examples in the Brand Knowledge Hub."
            })

    most_violated_rules.sort(key=lambda x: x["times_flagged"], reverse=True)
    rules_possibly_unclear.sort(key=lambda x: x["times_challenged"] + x["times_dismissed"], reverse=True)

    # Decisions timing
    decisions = db.query(ReviewDecision).all()
    avg_minutes = 24.5  # default realistic baseline if fast demo

    return {
        "is_demo_data": True,
        "label": "Demonstration data",
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
        "resolution_rate": round((resolved_count / max(len(findings), 1)) * 100, 1),
        "pre_review_fix_rate": 78.4
    }

@router.get("/audit")
def get_audit_trail(request: Request, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, request)
    events = db.query(AuditEvent).filter(
        AuditEvent.workspace_id == profile.workspace_id
    ).order_by(AuditEvent.timestamp.desc()).limit(50).all()

    return [
        {
            "id": e.id,
            "event_type": e.event_type,
            "submission_id": e.submission_id,
            "details": e.details_json,
            "actor_name": e.actor_name,
            "actor_role": e.actor_role,
            "version_number": e.version_number,
            "timestamp": e.timestamp
        }
        for e in events
    ]

@router.get("/ai/status")
def get_ai_status():
    has_key = llm_adapter.is_configured()
    return {
        "provider": settings.LLM_PROVIDER,
        "model": settings.LLM_MODEL,
        "has_api_key": has_key,
        "status": "active" if has_key else "fallback_active",
        "message": "AI contextual layer connected and validating output." if has_key else "AI layer unavailable. Rule-based and retrieval checks ran."
    }
