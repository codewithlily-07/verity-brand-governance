import uuid
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_enterprise_complete_lifecycle():
    # 1. Registration & Organisation Creation
    unique_email = f"lead_{uuid.uuid4().hex[:8]}@cognexa.enterprise"
    reg_res = client.post("/api/auth/register", json={
        "name": "Sarah Connor",
        "email": unique_email,
        "organisation_name": "Cyberdyne Brand Systems",
        "password": "EnterprisePassword2026!"
    })
    assert reg_res.status_code == 200, reg_res.text
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["organisation"]["name"] == "Cyberdyne Brand Systems"
    token = reg_data["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # 2. Login
    login_res = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "EnterprisePassword2026!"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # 3. Protected route: /api/auth/me
    me_res = client.get("/api/auth/me", headers=auth_headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == unique_email
    assert me_res.json()["organisation_name"] == "Cyberdyne Brand Systems"

    # 4. Brand Rule creation
    rule_res = client.post("/api/brand/rules", headers=auth_headers, json={
        "code": "CYBER-01",
        "category": "Messaging",
        "title": "Prohibit unverified neural claims",
        "description": "Do not state that neural processors are 100% self-aware without engineering proof.",
        "rule_type": "phrase",
        "pattern": "100% self-aware",
        "severity": "high"
    })
    assert rule_res.status_code == 200

    # 5. Content Submission with Rule Violation
    sub_res = client.post("/api/submissions", headers=auth_headers, json={
        "title": "Q4 Cyberdyne Press Release",
        "content_type": "press_release",
        "content": "Our neural net processors are 100% self-aware and deliver unmatched compute power."
    })
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    sub_id = sub_data["id"]
    v1_id = sub_data["version_id"]

    # 6. Analysis Verification & Layer Badges
    detail_res = client.get(f"/api/submissions/{sub_id}", headers=auth_headers)
    assert detail_res.status_code == 200
    detail = detail_res.json()
    findings = detail["versions"][0]["analysis_run"]["findings"]
    assert len(findings) >= 1
    assert any(f["rule_id"] == "CYBER-01" for f in findings)

    # 7. Intent-Preserving Revision (Version 2)
    clean_text = "Our neural net processors deliver reliable high-performance compute power."
    v2_res = client.post(f"/api/submissions/{sub_id}/versions", headers=auth_headers, json={
        "content": clean_text
    })
    assert v2_res.status_code == 200
    v2_data = v2_res.json()
    assert v2_data["version_number"] == 2
    v2_id = v2_data["id"]

    # 8. Human Review Approval Gate
    approve_res = client.post(f"/api/submissions/{sub_id}/review", headers=auth_headers, json={
        "version_id": v2_id,
        "decision": "approve",
        "reviewer_name": "Sarah Connor",
        "reviewer_role": "reviewer",
        "reason": "Draft updated to remove unverified self-aware claims."
    })
    assert approve_res.status_code == 200
    assert approve_res.json()["submission_status"] == "Approved"

    # 9. PDF Review Report Generation
    pdf_res = client.get(f"/api/submissions/{sub_id}/report.pdf", headers=auth_headers)
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 1000

    # 10. Audit Trail Verification
    audit_res = client.get("/api/audit", headers=auth_headers)
    assert audit_res.status_code == 200
    events = audit_res.json()
    assert any("review" in e["event_type"] for e in events)

    # 11. Notifications Verification
    notif_res = client.get("/api/notifications", headers=auth_headers)
    assert notif_res.status_code == 200

    # 12. In-app Feedback Submission & CSV Export
    fb_res = client.post("/api/feedback", headers=auth_headers, json={
        "user_name": "Enterprise Audit Officer",
        "rating": 5,
        "category": "Compliance",
        "comment": "The end-to-end evidence ledger and tamper-evident approvals meet our regulatory standards."
    })
    assert fb_res.status_code == 200

    csv_res = client.get("/api/feedback/export.csv")
    assert csv_res.status_code == 200
    assert "Enterprise Audit Officer" in csv_res.text
