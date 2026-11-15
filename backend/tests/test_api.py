import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["service"] == "VERITY"

def test_api_session_and_brand():
    res = client.post("/api/session")
    assert res.status_code == 200
    data = res.json()
    assert "workspace_id" in data

    # Test brand profile seeded
    res_b = client.get("/api/brand")
    assert res_b.status_code == 200
    b_data = res_b.json()
    assert "Verity Learning" in b_data["name"]
    assert len(b_data["rules"]) >= 7
    assert len(b_data["facts"]) >= 3

def test_api_submission_flow_and_review():
    # 1. Create a submission with Sample A
    sample_a_text = "Our platform guarantees 100% results and is the best learning platform in India!"
    res_sub = client.post("/api/submissions", json={
        "title": "Ad Copy Campaign",
        "content_type": "social",
        "content": sample_a_text,
        "author_name": "Priya",
        "author_role": "creator"
    })
    assert res_sub.status_code == 200
    sub_data = res_sub.json()
    sub_id = sub_data["submission_id"]
    v_id = sub_data["version_id"]

    # 2. Get detail
    res_detail = client.get(f"/api/submissions/{sub_id}")
    assert res_detail.status_code == 200
    detail = res_detail.json()
    assert len(detail["versions"]) == 1
    findings = detail["versions"][0]["analysis_run"]["findings"]
    assert len(findings) >= 2

    # Transition to "In Review"
    client.patch(f"/api/submissions/{sub_id}/status", json={"status": "In Review"})

    # High severity findings are open, so direct approval without override should fail with 400!
    res_fail_app = client.post(f"/api/submissions/{sub_id}/review", json={
        "version_id": v_id,
        "decision": "approve",
        "reviewer_name": "Elena",
        "reviewer_role": "reviewer",
        "reason": "Attempting approval without resolving high severity findings",
        "override_used": False
    })
    assert res_fail_app.status_code == 400
    assert "Approval blocked" in res_fail_app.json()["detail"]

    # 3. Create version 2 with clean corrected text
    v2_text = "Verity Learning supports online learning with live and recorded classes."
    res_v2 = client.post(f"/api/submissions/{sub_id}/versions", json={
        "content": v2_text,
        "author_name": "Priya"
    })
    assert res_v2.status_code == 200
    v2_data = res_v2.json()
    v2_id = v2_data["version_id"]

    # 4. Now approve version 2 (which has 0 high severity violations)
    res_approve = client.post(f"/api/submissions/{sub_id}/review", json={
        "version_id": v2_id,
        "decision": "approve",
        "reviewer_name": "Elena",
        "reviewer_role": "reviewer",
        "reason": "Corrected text complies with all brand guidelines and verified facts."
    })
    assert res_approve.status_code == 200
    app_data = res_approve.json()
    assert app_data["new_submission_status"] == "Approved"

def test_api_insights():
    res = client.get("/api/insights")
    assert res.status_code == 200
    data = res.json()
    assert "rules_possibly_unclear" in data
    assert len(data["common_categories"]) >= 1

def test_api_ai_status():
    res = client.get("/api/ai/status")
    assert res.status_code == 200
    data = res.json()
    assert "provider" in data
    assert "status" in data
