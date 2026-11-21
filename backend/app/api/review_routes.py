from typing import Dict, Any, List, Optional
import csv
import io
import json
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from backend.app.core.database import get_db
from backend.app.models.verity_models import (
    Submission, SubmissionVersion, ReviewDecision, Comment, AuditEvent, Workspace, Notification
)
from backend.app.schemas.verity_schemas import (
    ReviewDecisionRequest, ReviewDecisionResponse, CommentCreate, CommentResponse
)
from backend.app.api.auth_routes import get_current_user_optional

router = APIRouter(prefix="/submissions", tags=["Workflow & Review"])

ALLOWED_TRANSITIONS = {
    "Draft": ["Submitted", "In Review"],
    "Submitted": ["In Review", "Draft"],
    "In Review": ["Changes Requested", "Approved", "Rejected"],
    "Changes Requested": ["Resubmitted", "In Review", "Draft"],
    "Resubmitted": ["In Review", "Changes Requested", "Approved", "Rejected"],
    "Approved": ["Draft", "Resubmitted"], # Re-opening version or creating new draft
    "Rejected": ["Draft", "Resubmitted"]
}

@router.post("/{submission_id}/review", response_model=Dict[str, Any] if False else Any)
def submit_review_decision(
    submission_id: str,
    payload: ReviewDecisionRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    latest_version = sub.versions[-1] if sub.versions else None
    if not latest_version:
        raise HTTPException(status_code=404, detail="No versions found for this submission.")

    target_version_id = payload.version_id
    if target_version_id:
        version = db.query(SubmissionVersion).filter(
            SubmissionVersion.id == target_version_id,
            SubmissionVersion.submission_id == sub.id
        ).first()
        if not version:
            raise HTTPException(status_code=404, detail=f"Target submission version '{target_version_id}' not found.")

        # Stale version guard: Reject if submitted version is not the latest version
        if version.id != latest_version.id or version.version_number < latest_version.version_number:
            raise HTTPException(
                status_code=409,
                detail=(
                    f"Stale version review rejected: Attempted to review version {version.version_number} "
                    f"('{version.id}'), but a newer version exists (version {latest_version.version_number}, '{latest_version.id}'). "
                    f"Review approvals apply strictly to the exact current version."
                )
            )
    else:
        # Default to latest version for API convenience
        version = latest_version

    decision_type = payload.decision.lower() # approve | reject | request_changes

    # Role permission check on server first: Only reviewer, admin, or owner can decide
    user = get_current_user_optional(request, db)
    effective_role = user.role if user else (payload.reviewer_role or "creator")
    if effective_role not in ["reviewer", "admin", "owner"]:
        raise HTTPException(
            status_code=403,
            detail=f"Permission denied: You are acting as '{effective_role.title()}'. Switch to Authorised reviewer to sign off or reject."
        )

    # Map decision to state
    target_status = "Approved" if decision_type == "approve" else ("Rejected" if decision_type == "reject" else "Changes Requested")

    # Validate state transition
    current_status = sub.status
    allowed = ALLOWED_TRANSITIONS.get(current_status, ["Changes Requested", "Approved", "Rejected"])
    # Allow reviewing from Draft, Submitted, In Review, or Resubmitted
    if current_status in ["Draft", "Submitted"]:
        allowed = ["In Review", "Changes Requested", "Approved", "Rejected"]
    if target_status not in allowed and current_status not in ["In Review", "Resubmitted", "Submitted", "Draft"]:
        raise HTTPException(
            status_code=409,
            detail=f"Illegal state transition from '{current_status}' to '{target_status}'. Allowed: {allowed}"
        )

    # Check reason requirement: Decision note is required for all decisions
    if not payload.reason or not payload.reason.strip():
        raise HTTPException(
            status_code=400,
            detail=f"A clear decision note is required when submitting '{decision_type}'."
        )

    # Check unresolved high-severity findings for approve
    if decision_type == "approve":
        latest_run = version.analysis_runs[-1] if version.analysis_runs else None
        if latest_run:
            unresolved_high = [
                f for f in latest_run.findings
                if f.severity == "high" and f.status in ["open"]
            ]
            if unresolved_high and not payload.override_used:
                raise HTTPException(
                    status_code=400,
                    detail=f"Approval blocked: {len(unresolved_high)} high-severity finding(s) remain unresolved. Reviewer override with recorded reason is required to proceed."
                )
            if unresolved_high and payload.override_used and not (payload.override_reason and payload.override_reason.strip()):
                raise HTTPException(
                    status_code=400,
                    detail="Reviewer override reason is mandatory when approving with unresolved high-severity findings."
                )

        # Claim Evidence Ledger Guard: Check open conflicting or unsupported claims
        open_conflicting_claims = [
            c for c in (version.claims or [])
            if c.verdict in ["conflicting", "unsupported"] and c.status == "open"
        ]
        if open_conflicting_claims and not payload.override_used:
            raise HTTPException(
                status_code=400,
                detail=f"Approval blocked: {len(open_conflicting_claims)} conflicting or unsupported claim(s) in Evidence Ledger remain unresolved. Reviewer override with recorded reason is required to proceed."
            )

    # Create ReviewDecision bound to version and content_hash
    dec = ReviewDecision(
        submission_id=sub.id,
        submission_version_id=version.id,
        content_hash=version.content_hash,
        decision=decision_type,
        reviewer_name=payload.reviewer_name,
        reviewer_role=payload.reviewer_role,
        reason=payload.reason,
        override_used=payload.override_used,
        override_reason=payload.override_reason
    )
    db.add(dec)

    sub.status = target_status
    sub.updated_at = datetime.now(timezone.utc)

    # Audit event echoing exact version_id and content_hash
    db.add(AuditEvent(
        workspace_id=sub.workspace_id,
        submission_id=sub.id,
        event_type=f"review_{decision_type}",
        details_json={
            "version_id": version.id,
            "submission_version_id": version.id,
            "version_number": version.version_number,
            "version": version.version_number,
            "content_hash": version.content_hash,
            "hash": version.content_hash,
            "reviewer": payload.reviewer_name,
            "override_used": payload.override_used
        },
        actor_name=payload.reviewer_name,
        actor_role=payload.reviewer_role,
        version_number=version.version_number
    ))

    # Add notification for review decision
    db.add(Notification(
        workspace_id=sub.workspace_id,
        title=f"Review Decision: {target_status} on '{sub.title[:30]}'",
        message=f"{payload.reviewer_name} marked draft as {target_status}: {payload.reason[:60]}",
        link=f"/submissions/{sub.id}",
        read=False
    ))

    db.commit()

    return {
        "status": "decision_recorded",
        "decision_id": dec.id,
        "submission_id": sub.id,
        "version_id": version.id,
        "submission_version_id": version.id,
        "submission_status": sub.status,
        "new_submission_status": sub.status,
        "version_number": version.version_number,
        "content_hash": version.content_hash,
        "timestamp": dec.created_at
    }

@router.post("/{submission_id}/comments")
def add_comment(
    submission_id: str,
    payload: CommentCreate,
    db: Session = Depends(get_db)
):
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    comment = Comment(
        submission_id=sub.id,
        submission_version_id=payload.submission_version_id,
        user_name=payload.user_name,
        user_role=payload.user_role,
        comment_text=payload.comment_text
    )
    db.add(comment)

    # Add notification for comment
    db.add(Notification(
        workspace_id=sub.workspace_id,
        title=f"New Comment on '{sub.title[:30]}'",
        message=f"{payload.user_name} ({payload.user_role}): {payload.comment_text[:60]}",
        link=f"/submissions/{sub.id}",
        read=False
    ))

    db.commit()

    return {
        "id": comment.id,
        "submission_id": sub.id,
        "user_name": comment.user_name,
        "user_role": comment.user_role,
        "comment_text": comment.comment_text,
        "created_at": comment.created_at
    }

@router.get("/{submission_id}/audit.csv")
def export_submission_audit_csv(submission_id: str, db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    events = db.query(AuditEvent).filter(
        AuditEvent.submission_id == submission_id
    ).order_by(AuditEvent.timestamp.asc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Event ID", "Timestamp (UTC)", "Event Type", "Actor Name", "Actor Role",
        "Version Number", "Content Hash", "Details"
    ])
    for e in events:
        details = e.details_json or {}
        hash_val = details.get("content_hash") or details.get("hash") or ""
        writer.writerow([
            e.id,
            e.timestamp.isoformat() if e.timestamp else "",
            e.event_type,
            e.actor_name,
            e.actor_role,
            e.version_number or details.get("version_number") or "",
            hash_val,
            json.dumps(details)
        ])
        
    csv_bytes = output.getvalue().encode("utf-8")
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=audit-submission-{submission_id[:8]}.csv"
        }
    )

audit_router = APIRouter(prefix="/audit", tags=["Audit Ledger"])

@audit_router.get("/export.csv")
@audit_router.get("/export")
def export_workspace_audit_csv(db: Session = Depends(get_db)):
    events = db.query(AuditEvent).order_by(AuditEvent.timestamp.desc()).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Event ID", "Timestamp (UTC)", "Workspace ID", "Submission ID",
        "Event Type", "Actor Name", "Actor Role", "Version Number",
        "Content Hash", "Details"
    ])
    for e in events:
        details = e.details_json or {}
        hash_val = details.get("content_hash") or details.get("hash") or ""
        writer.writerow([
            e.id,
            e.timestamp.isoformat() if e.timestamp else "",
            e.workspace_id,
            e.submission_id or "",
            e.event_type,
            e.actor_name,
            e.actor_role,
            e.version_number or details.get("version_number") or "",
            hash_val,
            json.dumps(details)
        ])
        
    csv_bytes = output.getvalue().encode("utf-8")
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=verity-workspace-audit-ledger.csv"
        }
    )

