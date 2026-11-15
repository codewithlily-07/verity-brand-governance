import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.database import get_db
from backend.app.models.verity_models import (
    User, Organisation, Membership, Workspace, BrandProfile, AuditEvent
)
from backend.app.services.seed_data import seed_demo_workspace

router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = os.getenv("JWT_SECRET", "verity-enterprise-saas-jwt-secret-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Pydantic Schemas
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    organisation_name: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None

class SwitchRoleRequest(BaseModel):
    role: str


def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user_optional(request: Request, db: Session = Depends(get_db)) -> Optional[User]:
    auth_header = request.headers.get("Authorization")
    token = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    elif request.cookies.get("verity_token"):
        token = request.cookies.get("verity_token")

    if not token:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            return None
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
        return user
    except Exception:
        return None


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    user = get_current_user_optional(request, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return user


@router.post("/register")
def register_user(payload: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    # 1. Validation
    if len(payload.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    # 2. Create Organisation & Workspace
    org = Organisation(
        name=payload.organisation_name.strip() or "My Organisation",
        is_demo=False
    )
    db.add(org)
    db.flush()

    ws = Workspace(
        organisation_id=org.id,
        name=f"{org.name} Workspace",
        is_demo=False,
        settings_json={"role": "owner", "require_different_reviewer": True}
    )
    db.add(ws)
    db.flush()

    # 3. Create User with hashed password
    hashed = hash_password(payload.password)
    user = User(
        name=payload.name.strip(),
        email=payload.email.lower(),
        password_hash=hashed,
        role="owner",
        workspace_id=ws.id,
        is_active=True
    )
    db.add(user)
    db.flush()

    # 4. Create Membership
    membership = Membership(
        organisation_id=org.id,
        user_id=user.id,
        role="owner"
    )
    db.add(membership)

    # 5. Initialize starter brand profile
    profile = BrandProfile(
        workspace_id=ws.id,
        name=org.name,
        tagline="Enterprise Brand Governance",
        voice_attributes=["professional", "authoritative", "trustworthy"],
        audience="Enterprise customers and stakeholders"
    )
    db.add(profile)

    # 6. Audit event
    audit = AuditEvent(
        workspace_id=ws.id,
        event_type="user_registered",
        actor_name=user.name,
        actor_role="owner",
        details_json={"email": user.email, "org_name": org.name}
    )
    db.add(audit)
    db.commit()

    # 7. Generate JWT & set cookies
    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "workspace_id": ws.id,
        "org_id": org.id
    })

    response.set_cookie(key="verity_token", value=token, httponly=False, max_age=86400, samesite="lax")
    response.set_cookie(key="verity_workspace_id", value=ws.id, httponly=False, max_age=86400, samesite="lax")

    return {
        "status": "registered",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        },
        "organisation": {
            "id": org.id,
            "name": org.name
        },
        "workspace_id": ws.id
    }


@router.post("/login")
def login_user(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is suspended or inactive.")

    # Find primary membership / workspace
    membership = db.query(Membership).filter(Membership.user_id == user.id).first()
    org_id = membership.organisation_id if membership else None
    
    ws = None
    if user.workspace_id:
        ws = db.query(Workspace).filter(Workspace.id == user.workspace_id).first()
    if not ws and org_id:
        ws = db.query(Workspace).filter(Workspace.organisation_id == org_id).first()

    ws_id = ws.id if ws else user.workspace_id

    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "workspace_id": ws_id,
        "org_id": org_id
    })

    if ws_id:
        response.set_cookie(key="verity_workspace_id", value=ws_id, httponly=False, max_age=86400, samesite="lax")
    response.set_cookie(key="verity_token", value=token, httponly=False, max_age=86400, samesite="lax")

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        },
        "workspace_id": ws_id,
        "organisation_id": org_id
    }


@router.get("/me")
def get_me(user: Optional[User] = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    if not user:
        return None
    membership = db.query(Membership).filter(Membership.user_id == user.id).first()
    org_name = None
    if membership:
        org = db.query(Organisation).filter(Organisation.id == membership.organisation_id).first()
        if org:
            org_name = org.name

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "workspace_id": user.workspace_id,
        "organisation_name": org_name or "Personal Organisation",
        "created_at": user.created_at
    }


@router.post("/logout")
def logout_user(response: Response):
    response.delete_cookie("verity_token")
    return {"status": "logged_out"}


@router.post("/switch-role")
def switch_role(payload: SwitchRoleRequest, response: Response, db: Session = Depends(get_db)):
    role = payload.role.lower()
    if role not in ("creator", "manager", "admin", "reviewer"):
        raise HTTPException(status_code=400, detail="Invalid role specified.")
    email = f"{role}@verity.internal"
    user = db.query(User).filter(User.email == email).first()
    if not user:
        names = {
            "creator": "Alex Chen (Creator)",
            "manager": "Samira Patel (Manager)",
            "admin": "Jordan Taylor (Admin)",
            "reviewer": "Elena Vance (Reviewer)"
        }
        ws = db.query(Workspace).first()
        user = User(
            email=email,
            name=names.get(role, f"{role.title()} User"),
            role=role,
            password_hash=hash_password("Password123!"),
            workspace_id=ws.id if ws else None,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "workspace_id": user.workspace_id
    })
    response.set_cookie(
        key="verity_token",
        value=token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_HOURS * 3600,
        samesite="lax"
    )
    return {
        "status": "success",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "workspace_id": user.workspace_id
        }
    }


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user:
        # Prevent user enumeration
        return {"status": "success", "message": "If an account exists, a reset token has been issued."}

    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expires = datetime.now(timezone.utc) + timedelta(hours=1)
    db.commit()

    return {
        "status": "success",
        "message": "Password reset token generated successfully.",
        "reset_token": token
    }


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long.")

    user = db.query(User).filter(
        User.reset_token == payload.token,
        User.reset_token_expires > datetime.now(timezone.utc)
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    user.password_hash = hash_password(payload.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()

    return {"status": "password_reset_success", "message": "Password has been reset successfully. You may now log in."}


@router.put("/profile")
def update_profile(
    payload: UpdateProfileRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.name:
        user.name = payload.name.strip()
    if payload.role and payload.role in ("creator", "reviewer", "admin", "owner"):
        user.role = payload.role
    db.commit()

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }

