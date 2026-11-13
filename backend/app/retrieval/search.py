from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.app.models.verity_models import SourcePassage, ApprovedFact
import re

def retrieve_relevant_passages(
    db: Session,
    brand_profile_id: str,
    query: str,
    limit: int = 5
) -> List[Dict[str, Any]]:
    """
    Hybrid retrieval:
    - Postgres tsvector if postgresql
    - Tokenized full-text match across passages
    """
    clean_query_words = set(re.findall(r"\w+", query.lower()))
    if not clean_query_words:
        return []
    
    passages = db.query(SourcePassage).filter(
        SourcePassage.brand_profile_id == brand_profile_id
    ).all()
    
    scored = []
    for p in passages:
        p_words = set(re.findall(r"\w+", p.passage_text.lower()))
        overlap = len(clean_query_words & p_words)
        if overlap > 0:
            score = overlap / (len(clean_query_words) + 1.0)
            scored.append((score, p))
            
    scored.sort(key=lambda x: x[0], reverse=True)
    
    results = []
    for score, p in scored[:limit]:
        results.append({
            "id": p.id,
            "text": p.passage_text,
            "heading": p.heading,
            "page": p.page_number,
            "score": round(score, 3)
        })
    return results

def retrieve_relevant_facts(
    db: Session,
    brand_profile_id: str,
    query: str,
    limit: int = 5
) -> List[Dict[str, Any]]:
    clean_query_words = set(re.findall(r"\w+", query.lower()))
    if not clean_query_words:
        return []
        
    facts = db.query(ApprovedFact).filter(
        ApprovedFact.brand_profile_id == brand_profile_id,
        ApprovedFact.status == "approved"
    ).all()
    
    scored = []
    for f in facts:
        f_words = set(re.findall(r"\w+", f.statement.lower()))
        overlap = len(clean_query_words & f_words)
        if overlap > 0:
            score = overlap / (len(clean_query_words) + 1.0)
            scored.append((score, f))
            
    scored.sort(key=lambda x: x[0], reverse=True)
    
    results = []
    for score, f in scored[:limit]:
        results.append({
            "id": f.id,
            "code": f.code,
            "statement": f.statement,
            "source": f.source,
            "score": round(score, 3)
        })
    return results
