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
    assert app_data["version_id"] == v2_id
    assert "content_hash" in app_data

def test_tightened_review_approval_version_guards():
    """
    Tests all 4 requirements for tightened review approvals:
    1. Approve latest with no version_id (convenience fallback)
    2. Approve with explicit version_id
    3. Reject stale version with HTTP 409 when newer version exists
    4. Reject approval with HTTP 409 after a newer version is submitted concurrently
    5. Verify exact version_id and content_hash echoed in response
    """
    clean_text = "Verity Learning supports online learning with live and recorded classes."

    # Setup submission with version 1
    res_sub = client.post("/api/submissions", json={
        "title": "Version Guard Audit Test",
        "content_type": "social",
        "content": clean_text,
        "author_name": "Marcus",
        "author_role": "creator"
    })
    assert res_sub.status_code == 200
    sub_data = res_sub.json()
    sub_id = sub_data["submission_id"]
    v1_id = sub_data["version_id"]
    v1_hash = sub_data["content_hash"]

    # Test 1: Approve with explicit version_id
    res_v1_app = client.post(f"/api/submissions/{sub_id}/review", json={
        "version_id": v1_id,
        "decision": "approve",
        "reviewer_name": "Morgan Vance",
        "reviewer_role": "reviewer",
        "reason": "Version 1 explicit sign-off."
    })
    assert res_v1_app.status_code == 200
    resp1 = res_v1_app.json()
    assert resp1["version_id"] == v1_id
    assert resp1["content_hash"] == v1_hash

    # Create Version 2 (author edits copy)
    v2_text = "Verity Learning provides verified education across web and mobile platforms."
    res_v2 = client.post(f"/api/submissions/{sub_id}/versions", json={
        "content": v2_text,
        "author_name": "Marcus"
    })
    assert res_v2.status_code == 200
    v2_data = res_v2.json()
    v2_id = v2_data["version_id"]
    v2_hash = v2_data["content_hash"]

    # Test 2 & 4: Stale version rejection (v1 was superseded by v2)
    res_stale = client.post(f"/api/submissions/{sub_id}/review", json={
        "version_id": v1_id,  # Reviewer attempting to approve stale v1
        "decision": "approve",
        "reviewer_name": "Morgan Vance",
        "reviewer_role": "reviewer",
        "reason": "Attempting approval on stale version 1"
    })
    assert res_stale.status_code == 409
    assert "Stale version review rejected" in res_stale.json()["detail"]

    # Test 3: Approve latest with NO version_id (defaults to latest v2)
    res_no_v = client.post(f"/api/submissions/{sub_id}/review", json={
        "decision": "approve",
        "reviewer_name": "Morgan Vance",
        "reviewer_role": "reviewer",
        "reason": "Approving latest version via API default."
    })
    assert res_no_v.status_code == 200
    resp_no_v = res_no_v.json()
    assert resp_no_v["version_id"] == v2_id
    assert resp_no_v["content_hash"] == v2_hash
    assert resp_no_v["version_number"] == 2

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

def test_upload_file_magic_bytes_and_size_validation():
    """
    Tests Bug 2 real type checks:
    - Renamed .pdf without %PDF signature is rejected (400)
    - Renamed .docx without PK ZIP signature is rejected (400)
    - Plain text with binary null bytes is rejected (400)
    - Empty file is rejected (400)
    - Valid plain text is accepted (200)
    """
    # 1. Renamed fake PDF
    fake_pdf = b"This is plain text pretending to be a PDF file."
    res_fake_pdf = client.post(
        "/api/brand/sources",
        files={"file": ("malicious.pdf", fake_pdf, "application/pdf")}
    )
    assert res_fake_pdf.status_code == 400
    assert "Missing %PDF signature" in res_fake_pdf.json()["detail"]

    # 2. Renamed fake DOCX
    fake_docx = b"This is not a zip archive container."
    res_fake_docx = client.post(
        "/api/brand/sources",
        files={"file": ("malicious.docx", fake_docx, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    )
    assert res_fake_docx.status_code == 400
    assert "Missing PK ZIP archive signature" in res_fake_docx.json()["detail"]

    # 3. Binary executable disguised as TXT
    binary_txt = b"MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff\x00\x00"
    res_bin_txt = client.post(
        "/api/brand/sources",
        files={"file": ("malware.txt", binary_txt, "text/plain")}
    )
    assert res_bin_txt.status_code == 400
    assert "binary executable data" in res_bin_txt.json()["detail"]

    # 4. Empty file
    res_empty = client.post(
        "/api/brand/sources",
        files={"file": ("empty.txt", b"", "text/plain")}
    )
    assert res_empty.status_code == 400
    assert "empty" in res_empty.json()["detail"]

    # 5. Valid plain text file
    valid_txt = b"Approved Guideline: Verity Learning provides live and self-paced courses."
    res_valid = client.post(
        "/api/brand/sources",
        files={"file": ("guideline.txt", valid_txt, "text/plain")}
    )
    assert res_valid.status_code == 200
    assert res_valid.json()["status"] == "success"
