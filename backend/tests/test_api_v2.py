from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_v2_differentiators():
    # 1. Create a submission
    res_sub = client.post("/api/submissions", json={
        "title": "V2 Tier 2 Test Submission",
        "content_type": "social",
        "content": "Our platform guarantees 100% results and is the best learning platform in India!",
        "author_name": "Marcus",
        "author_role": "creator"
    })
    assert res_sub.status_code == 200
    sub_id = res_sub.json()["submission_id"]

    # 2. Test Brand Compliance Score endpoint
    res_score = client.get(f"/api/submissions/{sub_id}/score")
    assert res_score.status_code == 200
    score_data = res_score.json()
    assert "overall_score" in score_data
    assert "formula" in score_data
    assert "components" in score_data

    # 3. Test Evidence Ledger endpoint
    res_ledger = client.get(f"/api/submissions/{sub_id}/ledger")
    assert res_ledger.status_code == 200
    ledger_data = res_ledger.json()
    assert isinstance(ledger_data, list)
    assert len(ledger_data) >= 1
    assert any("unsupported" in item["verdict"] or "conflicting" in item["verdict"] for item in ledger_data)

    # 4. Test PDF Review Report generation
    res_pdf = client.get(f"/api/submissions/{sub_id}/report.pdf")
    assert res_pdf.status_code == 200
    assert res_pdf.headers["content-type"] == "application/pdf"
    assert res_pdf.content.startswith(b"%PDF")

    # 5. Test Notifications
    res_notes = client.get("/api/notifications")
    assert res_notes.status_code == 200
    assert isinstance(res_notes.json(), list)

    # 6. Test Feedback widget submission & CSV export (User testing evidence)
    res_fb = client.post("/api/feedback", json={
        "user_name": "Judge Reviewer",
        "rating": 5,
        "comment": "The evidence-linked detection and side-by-side diff workspace make verification effortless.",
        "category": "Usability"
    })
    assert res_fb.status_code == 200
    assert res_fb.json()["status"] == "recorded"

    res_csv = client.get("/api/feedback/export.csv")
    assert res_csv.status_code == 200
    assert "text/csv" in res_csv.headers["content-type"]
    assert "Judge Reviewer" in res_csv.text

