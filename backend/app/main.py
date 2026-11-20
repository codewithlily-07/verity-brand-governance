import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.app.core.config import settings
from backend.app.core.database import engine, Base
from backend.app.api.session_routes import router as session_router
from backend.app.api.brand_routes import router as brand_router
from backend.app.api.submission_routes import router as submission_router
from backend.app.api.finding_routes import router as finding_router
from backend.app.api.review_routes import router as review_router
from backend.app.api.insights_routes import router as insights_router
from backend.app.api.notification_feedback_routes import router as extra_router
from backend.app.api.auth_routes import router as auth_router
from backend.app.api.evaluation_routes import router as evaluation_router

from sqlalchemy import inspect, text

# Create DB tables
Base.metadata.create_all(bind=engine)

def ensure_schema_compatibility(eng):
    """Ensure dynamic backward compatibility for added columns on SQLite / PostgreSQL."""
    try:
        inspector = inspect(eng)
        with eng.connect() as conn:
            if inspector.has_table("brand_sources"):
                cols = {c["name"] for c in inspector.get_columns("brand_sources")}
                if "file_bytes" not in cols:
                    conn.execute(text("ALTER TABLE brand_sources ADD COLUMN file_bytes BLOB"))
                    conn.commit()
            if inspector.has_table("visual_assets"):
                cols = {c["name"] for c in inspector.get_columns("visual_assets")}
                if "data_blob" not in cols:
                    conn.execute(text("ALTER TABLE visual_assets ADD COLUMN data_blob BLOB"))
                    conn.commit()
                if "data_url" not in cols:
                    conn.execute(text("ALTER TABLE visual_assets ADD COLUMN data_url TEXT"))
                    conn.commit()
    except Exception as e:
        print(f"[Schema Compat Warning] {e}")

ensure_schema_compatibility(engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="VERITY: Intelligent Pre-Publication Brand Governance Platform. Consistent. Compliant. Trustworthy.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(session_router, prefix="/api")
app.include_router(brand_router, prefix="/api")
app.include_router(submission_router, prefix="/api")
app.include_router(finding_router, prefix="/api")
app.include_router(review_router, prefix="/api")
app.include_router(insights_router, prefix="/api")
app.include_router(extra_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(evaluation_router, prefix="/api")

# Serve Frontend static assets if built
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
