import csv
import io
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.verity_models import (
    Notification, Feedback, Submission, SubmissionVersion, BrandProfile
)
from backend.app.api.brand_routes import get_or_create_profile
from backend.app.api.submission_routes import get_submission_detail
from backend.app.engine.compliance_score import calculate_compliance_score, generate_evidence_ledger
from backend.app.reports.pdf_generator import generate_submission_pdf

router = APIRouter(tags=["Reports, Score & Notifications"])

# ----------------- BRAND COMPLIANCE SCORE -----------------
@router.get("/submissions/{submission_id}/score")
def get_submission_score(submission_id: str, db: Session = Depends(get_db)):
    detail = get_submission_detail(submission_id, db)
    versions = detail.get("versions", [])
    if not versions:
        raise HTTPException(status_code=404, detail="No versions available")
    latest_run = versions[-1].get("analysis_run") or {}
    findings = latest_run.get("findings", [])
    
    score_res = calculate_compliance_score(findings, [])
    return score_res

# ----------------- EVIDENCE LEDGER -----------------
@router.get("/submissions/{submission_id}/ledger")
def get_submission_ledger(submission_id: str, db: Session = Depends(get_db)):
    detail = get_submission_detail(submission_id, db)
    versions = detail.get("versions", [])
    if not versions:
        raise HTTPException(status_code=404, detail="No versions available")
    active_version = versions[-1]
    latest_run = active_version.get("analysis_run") or {}
    findings = latest_run.get("findings", [])
    content = active_version.get("content", "")

    ledger = generate_evidence_ledger(content, findings, [])
    return ledger

# ----------------- PDF REPORT EXPORT -----------------
@router.get("/submissions/{submission_id}/report.pdf")
def export_pdf_report(submission_id: str, db: Session = Depends(get_db)):
    detail = get_submission_detail(submission_id, db)
    versions = detail.get("versions", [])
    latest_run = versions[-1].get("analysis_run") if versions else {}
    findings = latest_run.get("findings", []) if latest_run else []

    score_data = calculate_compliance_score(findings, [])
    pdf_bytes = generate_submission_pdf(detail, score_data)

    safe_title = "".join(c for c in detail.get("title", "report") if c.isalnum() or c in (' ', '_', '-')).strip()
    safe_title = safe_title.replace(' ', '_')[:30]

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=VERITY_Report_{safe_title}.pdf"}
    )

# ----------------- NOTIFICATIONS -----------------
@router.get("/notifications")
def list_notifications(request: Request, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, request)
    notes = db.query(Notification).filter(
        Notification.workspace_id == profile.workspace_id
    ).order_by(Notification.created_at.desc()).limit(20).all()

    # If empty, create initial notification
    if not notes:
        welcome_note = Notification(
            workspace_id=profile.workspace_id,
            title="Welcome to VERITY Brand Governance",
            message="Your demonstration workspace has been initialized with the Verity Learning brand catalog.",
            read=False
        )
        db.add(welcome_note)
        db.commit()
        notes = [welcome_note]

    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "link": n.link,
            "read": n.read,
            "created_at": n.created_at
        }
        for n in notes
    ]

@router.patch("/notifications/{notification_id}/read")
def mark_notification_read(notification_id: str, db: Session = Depends(get_db)):
    n = db.query(Notification).filter(Notification.id == notification_id).first()
    if n:
        n.read = True
        db.commit()
    return {"status": "marked_read"}

@router.post("/notifications/clear")
def clear_all_notifications(request: Request, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, request)
    db.query(Notification).filter(Notification.workspace_id == profile.workspace_id).update({"read": True})
    db.commit()
    return {"status": "cleared"}

# ----------------- IN-APP FEEDBACK (USER TESTING EVIDENCE) -----------------
@router.post("/feedback")
def submit_feedback(payload: Dict[str, Any], request: Request, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, request)
    fb = Feedback(
        workspace_id=profile.workspace_id,
        user_name=payload.get("user_name", "Judge Reviewer"),
        rating=int(payload.get("rating", 5)),
        comment=payload.get("comment", "").strip() or "Structured user testing feedback",
        category=payload.get("category", "Usability")
    )
    db.add(fb)
    db.commit()
    return {"status": "recorded", "id": fb.id}

@router.get("/feedback/export.csv")
def export_feedback_csv(db: Session = Depends(get_db)):
    items = db.query(Feedback).order_by(Feedback.created_at.desc()).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Timestamp", "User", "Rating (1-5)", "Category", "Comment"])
    for fb in items:
        writer.writerow([fb.id, fb.created_at, fb.user_name, fb.rating, fb.category, fb.comment])
    output.seek(0)

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=verity_user_testing_feedback.csv"}
    )
