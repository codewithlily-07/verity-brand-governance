from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "VERITY"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database: SQLite default for zero-friction local/eval execution, PostgreSQL + pgvector supported
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./verity.db")
    
    # LLM Settings (Gracefully degrades if not provided)
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-1.5-flash")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    
    # Embeddings
    EMBEDDING_PROVIDER: str = os.getenv("EMBEDDING_PROVIDER", "")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "")
    
    # Upload limits
    MAX_UPLOAD_MB: int = int(os.getenv("MAX_UPLOAD_MB", "10"))
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # Governance & Workspace
    DEMO_MODE: bool = True
    WORKSPACE_TTL_HOURS: int = 24
    RATE_LIMIT_PER_MIN: int = 60

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
