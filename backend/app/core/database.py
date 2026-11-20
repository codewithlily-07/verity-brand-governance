from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.app.core.config import settings
import logging

logger = logging.getLogger("verity.database")

# Normalize DATABASE_URL for SQLAlchemy 2.0
raw_db_url = (settings.DATABASE_URL or "sqlite:///./verity.db").strip()
if raw_db_url.startswith("postgres://"):
    db_url = raw_db_url.replace("postgres://", "postgresql://", 1)
else:
    db_url = raw_db_url

connect_args = {}
engine_kwargs = {
    "echo": False,
    "pool_pre_ping": True,  # Proactively test connections before checkout to survive pooler reconnects
}

if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False
    engine_kwargs["connect_args"] = connect_args
else:
    # PostgreSQL / Supabase configuration
    # Enforce SSL for remote hosts (e.g. Supabase, Render) unless explicitly configured
    if "sslmode" not in db_url and "localhost" not in db_url and "127.0.0.1" not in db_url:
        connect_args["sslmode"] = "require"
    
    engine_kwargs["connect_args"] = connect_args
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20
    engine_kwargs["pool_recycle"] = 300  # Recycle idle connections every 5 minutes to prevent PgBouncer timeouts

engine = create_engine(db_url, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

