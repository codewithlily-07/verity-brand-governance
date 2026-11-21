import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_audit_csv_export():
    # 1. Create a submission first
    payload = {
        "title": "CSV Audit Test Submission",
        "content_type": "social",
        "campaign": "Audit Test",
        "author_name": "Test Creator",
        "content": "Our online platform provides comprehensive learning resources."
    }
    create_res = client.post("/api/submissions", json=payload)
    assert create_res.status_code == 200, create_res.text
    sub_id = create_res.json()["submission_id"]

    # 2. Test single submission audit CSV export
    sub_csv_res = client.get(f"/api/submissions/{sub_id}/audit.csv")
    assert sub_csv_res.status_code == 200
    assert "text/csv" in sub_csv_res.headers.get("content-type", "")
    assert "Content-Disposition" in sub_csv_res.headers
    text = sub_csv_res.text
    assert "Event ID" in text
    assert "Timestamp (UTC)" in text
    assert "Event Type" in text

    # 3. Test workspace-wide audit CSV export
    ws_csv_res = client.get("/api/audit/export.csv")
    assert ws_csv_res.status_code == 200
    assert "text/csv" in ws_csv_res.headers.get("content-type", "")
    assert "Content-Disposition" in ws_csv_res.headers
    ws_text = ws_csv_res.text
    assert "Event ID" in ws_text
    assert "Workspace ID" in ws_text
    assert "Event Type" in ws_text

def test_nonexistent_submission_audit_csv():
    res = client.get("/api/submissions/nonexistent-id-000000000000/audit.csv")
    assert res.status_code == 404
