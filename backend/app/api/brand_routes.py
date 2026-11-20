from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from backend.app.core.database import get_db
from backend.app.models.verity_models import (
    Workspace, BrandProfile, BrandRule, ApprovedFact, Terminology,
    VisualAsset, BrandSource, SourcePassage
)
from backend.app.services.seed_data import seed_demo_workspace
from backend.app.parsers.document_parsers import parse_uploaded_file
from backend.app.schemas.verity_schemas import (
    BrandProfileResponse, RuleSchema, FactSchema, TermSchema, VisualAssetSchema
)
import re

router = APIRouter(prefix="/brand", tags=["Brand Knowledge Hub"])

def get_or_create_profile(db: Session, request: Request) -> BrandProfile:
    workspace_id = request.cookies.get("verity_workspace_id")
    if not workspace_id:
        auth_header = request.headers.get("Authorization")
        token = None
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        elif request.cookies.get("verity_token"):
            token = request.cookies.get("verity_token")
        if token:
            try:
                import jwt
                from backend.app.api.auth_routes import SECRET_KEY, ALGORITHM
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                workspace_id = payload.get("workspace_id")
            except Exception:
                pass

    profile = None
    if workspace_id:
        profile = db.query(BrandProfile).filter(BrandProfile.workspace_id == workspace_id).first()
    
    if not profile:
        # Fallback to any profile or seed one
        ws = db.query(Workspace).first()
        if not ws:
            ws = Workspace(name="Default Workspace", is_demo=True)
            db.add(ws)
            db.commit()
        profile = seed_demo_workspace(db, ws.id)
    return profile

@router.get("", response_model=BrandProfileResponse)
def get_brand(request: Request, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, request)
    sources_data = []
    for s in (profile.sources or []):
        sources_data.append({
            "id": s.id,
            "filename": s.filename,
            "file_type": s.file_type or "pdf",
            "page_count": s.page_count or 1,
            "owner": "Brand Governance / Legal",
            "version": "v2.4" if "v2.4" in (s.filename or "") else "v1.0",
            "status": "Current",
            "passages_count": len(s.passages) if s.passages else 0
        })
    return {
        "id": profile.id,
        "workspace_id": profile.workspace_id,
        "name": profile.name,
        "tagline": profile.tagline,
        "voice_attributes": profile.voice_attributes or [],
        "audience": profile.audience,
        "palette_json": profile.palette_json or [],
        "rules": profile.rules or [],
        "facts": profile.facts or [],
        "terms": profile.terms or [],
        "visual_assets": profile.visual_assets or [],
        "sources": sources_data
    }

@router.put("")
def update_brand(payload: Dict[str, Any], request: Request, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, request)
    if "name" in payload:
        profile.name = payload["name"]
    if "tagline" in payload:
        profile.tagline = payload["tagline"]
    if "audience" in payload:
        profile.audience = payload["audience"]
    if "voice_attributes" in payload:
        profile.voice_attributes = payload["voice_attributes"]
    if "palette_json" in payload:
        profile.palette_json = payload["palette_json"]
    db.commit()
    return {"status": "updated", "id": profile.id}

# --- Rules CRUD ---
@router.post("/rules")
def add_rule(payload: RuleSchema, request: Request, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, request)
    rule = BrandRule(
        brand_profile_id=profile.id,
        code=payload.code,
        category=payload.category,
        title=payload.title,
        description=payload.description,
        rule_type=payload.rule_type,
        pattern=payload.pattern,
        prefer_term=payload.prefer_term,
        avoid_term=payload.avoid_term,
        severity=payload.severity,
        is_active=payload.is_active,
        source_ref=payload.source_ref or "Brand Guidelines",
        source_excerpt=payload.source_excerpt or ""
    )
    db.add(rule)
    db.commit()
    return {"status": "created", "rule_id": rule.id}

@router.delete("/rules/{rule_id}")
def delete_rule(rule_id: str, db: Session = Depends(get_db)):
    rule = db.query(BrandRule).filter(BrandRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    db.delete(rule)
    db.commit()
    return {"status": "deleted"}

# --- Facts CRUD ---
@router.post("/facts")
def add_fact(payload: FactSchema, request: Request, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, request)
    fact = ApprovedFact(
        brand_profile_id=profile.id,
        code=payload.code,
        name=payload.name,
        statement=payload.statement,
        source=payload.source,
        category=payload.category
    )
    db.add(fact)
    db.commit()
    return {"status": "created", "fact_id": fact.id}

@router.delete("/facts/{fact_id}")
def delete_fact(fact_id: str, db: Session = Depends(get_db)):
    fact = db.query(ApprovedFact).filter(ApprovedFact.id == fact_id).first()
    if not fact:
        raise HTTPException(status_code=404, detail="Fact not found")
    db.delete(fact)
    db.commit()
    return {"status": "deleted"}

# --- Terminology CRUD ---
@router.post("/terms")
def add_term(payload: TermSchema, request: Request, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, request)
    term = Terminology(
        brand_profile_id=profile.id,
        avoid=payload.avoid,
        prefer=payload.prefer,
        context=payload.context,
        note=payload.note
    )
    db.add(term)
    db.commit()
    return {"status": "created", "term_id": term.id}

@router.delete("/terms/{term_id}")
def delete_term(term_id: str, db: Session = Depends(get_db)):
    term = db.query(Terminology).filter(Terminology.id == term_id).first()
    if not term:
        raise HTTPException(status_code=404, detail="Term not found")
    db.delete(term)
    db.commit()
    return {"status": "deleted"}

# --- Document Upload & Indexing ---
@router.post("/sources")
async def upload_guideline_source(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(db, request)
    contents = await file.read()
    
    # 10MB limit check
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds 10MB limit")
        
    parsed = parse_uploaded_file(file.filename, contents)
    
    source = BrandSource(
        brand_profile_id=profile.id,
        filename=file.filename,
        file_type=parsed["file_type"],
        raw_text=parsed["text"],
        page_count=parsed.get("page_count", 1),
        file_bytes=contents
    )
    db.add(source)
    db.flush()

    # Chunk into passages (~120 - 200 words)
    words = re.split(r"\s+", parsed["text"])
    chunk_size = 150
    passages_created = 0
    
    for i in range(0, len(words), chunk_size):
        chunk_words = words[i:i + chunk_size]
        chunk_text = " ".join(chunk_words).strip()
        if len(chunk_text) > 20:
            passage = SourcePassage(
                source_id=source.id,
                brand_profile_id=profile.id,
                passage_text=chunk_text,
                page_number=max(1, (i // 300) + 1),
                heading=f"Passage §{(i // chunk_size) + 1}",
                word_count=len(chunk_words)
            )
            db.add(passage)
            passages_created += 1

    db.commit()
    return {
        "status": "success",
        "source_id": source.id,
        "filename": file.filename,
        "page_count": source.page_count,
        "passages_created": passages_created,
        "preview_text": parsed["text"][:300] + ("..." if len(parsed["text"]) > 300 else "")
    }
