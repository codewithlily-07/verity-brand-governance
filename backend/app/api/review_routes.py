from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from backend.app.core.database import get_db
from backend.app.models.verity_models import (
    Submission, SubmissionVersion, ReviewDecision, Comment, AuditEvent, Workspace
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

    target_version_id = payload.version_id
    if target_version_id:
        version = db.query(SubmissionVersion).filter(
            SubmissionVersion.id == target_version_id,
            SubmissionVersion.submission_id == sub.id
        ).first()
    else:
        version = sub.versions[-1] if sub.versions else None

    if not version:
        raise HTTPException(status_code=404, detail="Target submission version not found.")

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

    # Audit event
    db.add(AuditEvent(
        workspace_id=sub.workspace_id,
        submission_id=sub.id,
        event_type=f"review_{decision_type}",
        details_json={
            "version": version.version_number,
            "hash": version.content_hash,
            "reviewer": payload.reviewer_name,
            "override_used": payload.override_used
        },
        actor_name=payload.reviewer_name,
        actor_role=payload.reviewer_role,
        version_number=version.version_number
    ))

    db.commit()

    return {
        "status": "decision_recorded",
        "decision_id": dec.id,
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
    db.commit()

    return {
        "id": comment.id,
        "submission_id": sub.id,
        "user_name": comment.user_name,
        "user_role": comment.user_role,
        "comment_text": comment.comment_text,
        "created_at": comment.created_at
    }
