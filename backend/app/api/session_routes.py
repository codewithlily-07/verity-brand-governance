from fastapi import APIRouter, Depends, Response, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timezone
import json
import os
from backend.app.core.config import settings
from backend.app.core.database import get_db, engine
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
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/ready")
def readiness_check(response: Response, db: Session = Depends(get_db)):
    """
    Readiness probe verifying database connectivity, table schema availability,
    and migration readiness. Returns 200 when ready to serve traffic, 503 on database failure.
    """
    # 1. Database execution check
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "not_ready",
            "service": "VERITY",
            "database": "unreachable",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    # 2. Migration and schema readiness check
    migration_status = "current"
    try:
        from alembic.migration import MigrationContext
        from alembic.script import ScriptDirectory
        from alembic.config import Config

        alembic_ini_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../alembic.ini"))
        if os.path.exists(alembic_ini_path):
            alembic_cfg = Config(alembic_ini_path)
            script = ScriptDirectory.from_config(alembic_cfg)
            with engine.connect() as conn:
                context = MigrationContext.configure(conn)
                current_rev = context.get_current_revision()
                heads = script.get_heads()
                head_rev = heads[0] if heads else None
                if head_rev and current_rev != head_rev:
                    migration_status = f"pending (current: {current_rev}, head: {head_rev})"
                elif current_rev:
                    migration_status = f"synced ({current_rev})"
                else:
                    migration_status = "schema_active"
    except Exception as me:
        migration_status = f"active (direct schema sync: {str(me)[:40]})"

    return {
        "status": "ready",
        "service": "VERITY",
        "database": db_status,
        "database_type": engine.dialect.name,
        "migrations": migration_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
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
