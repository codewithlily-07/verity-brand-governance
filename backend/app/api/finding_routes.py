from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.verity_models import Finding, BrandRule, AuditEvent
from backend.app.schemas.verity_schemas import FindingPatchRequest

router = APIRouter(prefix="/findings", tags=["Findings"])

@router.patch("/{finding_id}")
def update_finding_status(
    finding_id: str,
    payload: FindingPatchRequest,
    db: Session = Depends(get_db)
):
    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")

    finding.status = payload.status
    finding.decided_by = payload.decided_by or "Reviewer"
    finding.decided_at = datetime.now(timezone.utc)

    if payload.user_edited_replacement is not None:
        finding.user_edited_replacement = payload.user_edited_replacement
    if payload.dismiss_reason is not None:
        finding.dismiss_reason = payload.dismiss_reason
    if payload.challenge_reason is not None:
        finding.challenge_reason = payload.challenge_reason

    # Adaptive Governance Feedback loop:
    # If the user dismisses or challenges a rule finding, update the rule's telemetry!
    if finding.rule_id:
        rule = db.query(BrandRule).filter(BrandRule.code == finding.rule_id).first()
        if rule:
            if payload.status == "dismissed":
                rule.times_dismissed += 1
            elif payload.status == "challenged":
                rule.times_challenged += 1

    db.commit()
    return {
        "status": "updated",
        "finding_id": finding.id,
        "new_status": finding.status
    }
