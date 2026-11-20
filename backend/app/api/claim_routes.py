from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime, timezone

from backend.app.core.database import get_db
from backend.app.models.verity_models import (
    Submission, SubmissionVersion, Claim, BrandProfile, AuditEvent
)
from backend.app.engine.claim_ledger_engine import (
    extract_claims_from_text, ground_claim_against_knowledge_hub
)
from backend.app.api.submission_routes import extract_brand_dict

router = APIRouter(tags=["Claim Evidence Ledger"])

class ClaimPatchRequest(BaseModel):
    status: str # accepted | edited | dismissed | challenged | open
    user_edited_replacement: Optional[str] = None
    dismiss_reason: Optional[str] = None
    challenge_reason: Optional[str] = None

@router.get("/submissions/{submission_id}/versions/{version_num}/ledger")
def get_version_claims_ledger(
    submission_id: str,
    version_num: int,
    db: Session = Depends(get_db)
):
    """
    Returns the Claim Evidence Ledger for a specific submission version.
    If claims haven't been extracted yet, extracts and grounds them automatically.
    """
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    version = db.query(SubmissionVersion).filter(
        SubmissionVersion.submission_id == sub.id,
        SubmissionVersion.version_number == version_num
    ).first()
    if not version:
        raise HTTPException(status_code=404, detail=f"Version {version_num} not found")

    # If no claims saved in DB for this version, populate them
    if not version.claims:
        profile = db.query(BrandProfile).filter(BrandProfile.id == sub.brand_profile_id).first()
        brand_dict = extract_brand_dict(profile) if profile else {"facts": [], "passages": [], "rules": []}

        extracted = extract_claims_from_text(version.content)
        for c in extracted:
            grounding = ground_claim_against_knowledge_hub(
                c["text"],
                approved_facts=brand_dict.get("facts", []),
                passages=brand_dict.get("passages", []),
                rules=brand_dict.get("rules", [])
            )
            claim_obj = Claim(
                submission_version_id=version.id,
                text=c["text"],
                start=c["start"],
                end=c["end"],
                claim_type=c["claim_type"],
                verdict=grounding["verdict"],
                evidence_id=str(grounding.get("evidence_id") or "") or None,
                evidence_excerpt=grounding.get("evidence_excerpt"),
                confidence=grounding.get("confidence", 1.0),
                rationale=grounding.get("rationale"),
                status="open"
            )
            db.add(claim_obj)
        db.commit()
        db.refresh(version)

    return [
        {
            "id": c.id,
            "submission_version_id": c.submission_version_id,
            "text": c.text,
            "claim": c.text,
            "start": c.start,
            "end": c.end,
            "claim_type": c.claim_type,
            "verdict": c.verdict,
            "evidence_id": c.evidence_id,
            "evidence_excerpt": c.evidence_excerpt,
            "source_text": c.evidence_excerpt,
            "source_doc": c.evidence_id or "Brand Knowledge Hub",
            "confidence": c.confidence,
            "rationale": c.rationale,
            "status": c.status,
            "user_edited_replacement": c.user_edited_replacement,
            "dismiss_reason": c.dismiss_reason,
            "challenge_reason": c.challenge_reason,
            "created_at": c.created_at
        }
        for c in version.claims
    ]

@router.post("/submissions/{submission_id}/versions/{version_num}/ledger/rebuild")
def rebuild_version_claims_ledger(
    submission_id: str,
    version_num: int,
    db: Session = Depends(get_db)
):
    """
    Forces a fresh re-extraction and grounding of claims for a version.
    """
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    version = db.query(SubmissionVersion).filter(
        SubmissionVersion.submission_id == sub.id,
        SubmissionVersion.version_number == version_num
    ).first()
    if not version:
        raise HTTPException(status_code=404, detail=f"Version {version_num} not found")

    # Delete existing claims for version
    db.query(Claim).filter(Claim.submission_version_id == version.id).delete()

    profile = db.query(BrandProfile).filter(BrandProfile.id == sub.brand_profile_id).first()
    brand_dict = extract_brand_dict(profile) if profile else {"facts": [], "passages": [], "rules": []}

    extracted = extract_claims_from_text(version.content)
    created_claims = []
    for c in extracted:
        grounding = ground_claim_against_knowledge_hub(
            c["text"],
            approved_facts=brand_dict.get("facts", []),
            passages=brand_dict.get("passages", []),
            rules=brand_dict.get("rules", [])
        )
        claim_obj = Claim(
            submission_version_id=version.id,
            text=c["text"],
            start=c["start"],
            end=c["end"],
            claim_type=c["claim_type"],
            verdict=grounding["verdict"],
            evidence_id=str(grounding.get("evidence_id") or "") or None,
            evidence_excerpt=grounding.get("evidence_excerpt"),
            confidence=grounding.get("confidence", 1.0),
            rationale=grounding.get("rationale"),
            status="open"
        )
        db.add(claim_obj)
        created_claims.append(claim_obj)

    db.commit()

    return {
        "status": "rebuilt",
        "claims_count": len(created_claims),
        "version_number": version_num
    }

@router.patch("/claims/{claim_id}")
def update_claim_status(
    claim_id: str,
    payload: ClaimPatchRequest,
    db: Session = Depends(get_db)
):
    """
    Updates claim workflow status: accepted, edited, dismissed, challenged.
    """
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    claim.status = payload.status
    if payload.user_edited_replacement is not None:
        claim.user_edited_replacement = payload.user_edited_replacement
    if payload.dismiss_reason is not None:
        claim.dismiss_reason = payload.dismiss_reason
    if payload.challenge_reason is not None:
        claim.challenge_reason = payload.challenge_reason
    claim.updated_at = datetime.now(timezone.utc)

    db.commit()
    return {
        "status": "updated",
        "claim_id": claim.id,
        "new_status": claim.status
    }
