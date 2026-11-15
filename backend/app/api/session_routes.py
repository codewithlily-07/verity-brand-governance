from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from backend.app.core.config import settings
from backend.app.core.database import get_db
from backend.app.models.verity_models import Workspace, AuditEvent
from backend.app.services.seed_data import seed_demo_workspace
import uuid

router = APIRouter(tags=["Session"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "VERITY",
        "version": "1.0.0",
        "timestamp": "2026-11-13T13:37:14Z"
    }

@router.get("/ai/status")
def get_ai_status():
    api_key_configured = bool(getattr(settings, "GEMINI_API_KEY", None) or getattr(settings, "OPENAI_API_KEY", None))
    return {
        "status": "ready" if api_key_configured else "fallback_mode",
        "provider": "Google Gemini API (gemini-1.5-flash)",
        "fallback_provider": "Deterministic Heuristic Engine",
        "temperature": 0.0,
        "structured_outputs": True,
        "api_key_configured": api_key_configured,
        "offline_layer1_rules": "Enabled (100% Deterministic)",
        "offline_layer2_retrieval": "Enabled (Local BM25 & Grounding Search)",
        "offline_layer3_ai": "Active with Structured JSON Schema" if api_key_configured else "Advisory Standby / Safe Fallback"
    }

@router.post("/session")
def create_session(request: Request, response: Response, db: Session = Depends(get_db)):
    """
    Creates or retrieves guest workspace for isolated judge review.
    Cookies bind workspace id so judges never overwrite each other.
    """
    workspace_id = request.cookies.get("verity_workspace_id")
    ws = None
    if workspace_id:
        ws = db.query(Workspace).filter(Workspace.id == workspace_id).first()

    if not ws:
        workspace_id = str(uuid.uuid4())
        ws = Workspace(
            id=workspace_id,
            name="Demo Workspace (Judge Session)",
            is_demo=True,
            settings_json={"require_different_reviewer": False, "role": "creator"}
        )
        db.add(ws)
        db.commit()

        # Seed brand data and demonstration submissions
        seed_demo_workspace(db, workspace_id)

    response.set_cookie(
        key="verity_workspace_id",
        value=workspace_id,
        httponly=False,
        max_age=86400,
        samesite="lax"
    )

    return {
        "workspace_id": workspace_id,
        "name": ws.name,
        "is_demo": ws.is_demo,
        "settings": ws.settings_json or {}
    }

@router.post("/demo/reset")
def reset_demo(request: Request, response: Response, db: Session = Depends(get_db)):
    """
    Resets the workspace back to fresh demonstration state.
    """
    workspace_id = request.cookies.get("verity_workspace_id")
    if workspace_id:
        existing = db.query(Workspace).filter(Workspace.id == workspace_id).first()
        if existing:
            db.delete(existing)
            db.commit()

    # Re-create fresh
    new_ws_id = str(uuid.uuid4())
    ws = Workspace(
        id=new_ws_id,
        name="Demo Workspace (Fresh)",
        is_demo=True,
        settings_json={"require_different_reviewer": False, "role": "creator"}
    )
    db.add(ws)
    db.commit()

    seed_demo_workspace(db, new_ws_id)

    response.set_cookie(
        key="verity_workspace_id",
        value=new_ws_id,
        httponly=False,
        max_age=86400,
        samesite="lax"
    )

    return {
        "status": "reset_successful",
        "workspace_id": new_ws_id,
        "message": "Demo workspace successfully reseeded with Verity Learning."
    }
