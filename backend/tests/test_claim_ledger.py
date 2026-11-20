import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.engine.claim_ledger_engine import (
    extract_claims_from_text, ground_claim_against_knowledge_hub, is_opinion_or_cta
)

client = TestClient(app)

def test_claim_extraction_and_opinion_filtering():
    # 1. Statements with numbers and superlatives
    text = (
        "Our platform guarantees 100% results. "
        "Verity Learning is the best online learning platform in India. "
        "Classes are available 24/7. "
        "Click here to register now! "
        "Join today."
    )
    claims = extract_claims_from_text(text)
    claim_texts = [c["text"] for c in claims]

    assert any("guarantees 100%" in t for t in claim_texts)
    assert any("best online learning platform" in t for t in claim_texts)
    assert any("24/7" in t for t in claim_texts)
    # Opinions and CTAs skipped
    assert not any("Click here to register" in t for t in claim_texts)
    assert not any("Join today" in t for t in claim_texts)

def test_grounding_verdicts():
    approved_facts = [
        {
            "id": "F-01",
            "code": "F-01",
            "statement": "Verity Learning supports online learning with live and recorded classes.",
            "source": "Fact Sheet v2"
        },
        {
            "id": "F-02",
            "code": "F-02",
            "statement": "Over 50,000 learners have completed courses on the platform.",
            "source": "Fact Sheet v2"
        }
    ]
    passages = []

    # 1. Supported claim
    sup = ground_claim_against_knowledge_hub(
        "Verity Learning supports online learning with live and recorded classes.",
        approved_facts, passages
    )
    assert sup["verdict"] == "supported"
    assert "F-01" in str(sup["evidence_id"])

    # 2. Conflicting guarantee
    conf_guar = ground_claim_against_knowledge_hub(
        "Our platform guarantees 100% placement outcomes.",
        approved_facts, passages
    )
    assert conf_guar["verdict"] == "conflicting"
    assert "R1" in conf_guar["evidence_id"]

    # 3. Conflicting superlative
    conf_sup = ground_claim_against_knowledge_hub(
        "We are the best learning institute in the world.",
        approved_facts, passages
    )
    assert conf_sup["verdict"] == "conflicting"

    # 4. Conflicting numbers vs approved fact
    conf_num = ground_claim_against_knowledge_hub(
        "Over 500,000 learners have completed courses on the platform.",
        approved_facts, passages
    )
    assert conf_num["verdict"] == "conflicting"

    # 5. Unsupported claim
    unsup = ground_claim_against_knowledge_hub(
        "We are launching an international campus in Zurich next month.",
        approved_facts, passages
    )
    assert unsup["verdict"] == "unsupported"
    assert unsup["evidence_excerpt"] == "No approved supporting evidence found."

def test_claim_ledger_api_endpoints():
    # 1. Create a submission
    res_sub = client.post("/api/submissions", json={
        "title": "Claim Ledger Flow Test",
        "content_type": "social",
        "content": "Our platform guarantees 100% results. Verity Learning supports online learning with live classes.",
        "author_name": "Test Author",
        "author_role": "creator"
    })
    assert res_sub.status_code == 200
    sub_id = res_sub.json()["submission_id"]

    # 2. Query Version 1 Ledger
    res_ledger = client.get(f"/api/submissions/{sub_id}/versions/1/ledger")
    assert res_ledger.status_code == 200
    ledger = res_ledger.json()
    assert len(ledger) >= 1
    claim_id = ledger[0]["id"]
    assert ledger[0]["status"] == "open"

    # 3. PATCH Claim status
    res_patch = client.patch(f"/api/claims/{claim_id}", json={
        "status": "dismissed",
        "dismiss_reason": "Verified by legal team exception."
    })
    assert res_patch.status_code == 200
    assert res_patch.json()["new_status"] == "dismissed"

    # 4. Rebuild Ledger
    res_rebuild = client.post(f"/api/submissions/{sub_id}/versions/1/ledger/rebuild")
    assert res_rebuild.status_code == 200
    assert res_rebuild.json()["status"] == "rebuilt"
