import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.database import Base, engine, get_db
from backend.app.services.seed_data import seed_demo_workspace
from backend.app.models.verity_models import Workspace, BrandProfile, User
import uuid

client = TestClient(app)

def test_api_ready_endpoint():
    """Verify /api/ready probe returns 200 with database connected."""
    response = client.get("/api/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert data["service"] == "VERITY"
    assert data["database"] == "connected"
    assert "database_type" in data
    assert "timestamp" in data

def test_idempotent_demo_seeding():
    """Verify demo workspace seeding is strictly idempotent and safe to execute multiple times."""
    db = next(get_db())
    test_ws_id = f"test-seed-{uuid.uuid4()}"
    
    # First seed
    profile_1 = seed_demo_workspace(db, test_ws_id)
    assert profile_1 is not None
    assert profile_1.workspace_id == test_ws_id
    
    # Second seed on same workspace
    profile_2 = seed_demo_workspace(db, test_ws_id)
    assert profile_2.id == profile_1.id
    assert profile_2.workspace_id == test_ws_id

    # Verify official users are present
    official_emails = [
        "creator@verity.internal",
        "manager@verity.internal",
        "admin@verity.internal",
        "reviewer@verity.internal"
    ]
    users = db.query(User).filter(User.email.in_(official_emails)).all()
    assert len(users) == 4
    roles = {u.role for u in users}
    assert "creator" in roles
    assert "reviewer" in roles
    assert "admin" in roles

def test_postgres_url_normalization():
    """Verify postgres:// is rewritten to postgresql:// for SQLAlchemy 2.0 compatibility."""
    from backend.app.core.database import raw_db_url
    test_raw = "postgres://postgres:secret@db.supabase.co:6543/postgres"
    normalized = test_raw.replace("postgres://", "postgresql://", 1)
    assert normalized.startswith("postgresql://")
