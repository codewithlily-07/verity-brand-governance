import httpx
import json
import io
import sys
import uuid

BASE_URL = "http://127.0.0.1:8000"
session = httpx.Client(timeout=15.0)

results = []

def record(test_name, method, endpoint, status_code, expected_status, is_500=False, notes=""):
    success = (status_code in expected_status) and not is_500
    results.append({
        "test": test_name,
        "method": method,
        "endpoint": endpoint,
        "status": status_code,
        "expected": expected_status,
        "pass": success,
        "notes": notes
    })
    prefix = "PASS" if success else "FAIL"
    print(f"[{prefix}] {test_name} ({method} {endpoint}) -> Status {status_code} (Expected {expected_status}) {notes}")

def run_tests():
    print("=== EXERCISING ALL VERITY API ENDPOINTS ===")
    
    # 1. Health & Readiness
    r = session.get(f"{BASE_URL}/api/health")
    record("Health check", "GET", "/api/health", r.status_code, [200], r.status_code == 500)

    r = session.get(f"{BASE_URL}/api/ready")
    record("Readiness probe", "GET", "/api/ready", r.status_code, [200], r.status_code == 500)

    r = session.get(f"{BASE_URL}/api/ai/status")
    record("AI status", "GET", "/api/ai/status", r.status_code, [200], r.status_code == 500)

    # 2. Session creation (Guest session)
    r = session.post(f"{BASE_URL}/api/session")
    record("Create guest session", "POST", "/api/session", r.status_code, [200], r.status_code == 500)
    cookies = dict(r.cookies)
    print(f"  Session cookies: {cookies}")

    # 3. Brand CRUD
    r = session.get(f"{BASE_URL}/api/brand")
    record("Get brand profile", "GET", "/api/brand", r.status_code, [200], r.status_code == 500)
    brand_data = r.json() if r.status_code == 200 else {}
    brand_id = brand_data.get("id")

    # Update brand profile - Valid
    r = session.put(f"{BASE_URL}/api/brand", json={
        "name": "Verity Learning (Updated Test)",
        "tagline": "Truth in Learning",
        "voice_attributes": ["academic", "precise"],
        "audience": "educators and learners",
        "neutrals_allowed": True,
        "palette_tolerance": 25.0
    })
    record("Update brand profile valid", "PUT", "/api/brand", r.status_code, [200], r.status_code == 500)

    # Update brand profile - Invalid (malformed payload)
    r = session.put(f"{BASE_URL}/api/brand", json={"name": ""})
    record("Update brand profile invalid", "PUT", "/api/brand", r.status_code, [200, 400, 422], r.status_code == 500)

    # Add Rule - Valid
    r = session.post(f"{BASE_URL}/api/brand/rules", json={
        "code": f"R-TEST-{uuid.uuid4().hex[:4]}",
        "category": "Terminology",
        "title": "Test Custom Rule",
        "description": "Never use word XYZ",
        "rule_type": "phrase",
        "avoid_term": "XYZ",
        "prefer_term": "ABC",
        "severity": "medium"
    })
    record("Add rule valid", "POST", "/api/brand/rules", r.status_code, [200, 201], r.status_code == 500)

    # Add Rule - Invalid (missing required fields)
    r = session.post(f"{BASE_URL}/api/brand/rules", json={"severity": "medium"})
    record("Add rule invalid", "POST", "/api/brand/rules", r.status_code, [400, 422], r.status_code == 500)

    # Add Fact - Valid
    r = session.post(f"{BASE_URL}/api/brand/facts", json={
        "code": f"F-TEST-{uuid.uuid4().hex[:4]}",
        "name": "Official Founding Date",
        "statement": "Verity was founded in 2024 to verify brand integrity.",
        "source": "Corporate Governance Charter 2024",
        "category": "Corporate Facts"
    })
    record("Add fact valid", "POST", "/api/brand/facts", r.status_code, [200, 201], r.status_code == 500)

    # Add Fact - Invalid
    r = session.post(f"{BASE_URL}/api/brand/facts", json={})
    record("Add fact invalid", "POST", "/api/brand/facts", r.status_code, [400, 422], r.status_code == 500)

    # Add Term - Valid
    r = session.post(f"{BASE_URL}/api/brand/terms", json={
        "avoid": "cheap",
        "prefer": "cost-effective",
        "context": "Pricing communications"
    })
    record("Add term valid", "POST", "/api/brand/terms", r.status_code, [200, 201], r.status_code == 500)

    # Add Term - Invalid
    r = session.post(f"{BASE_URL}/api/brand/terms", json={"avoid": ""})
    record("Add term invalid", "POST", "/api/brand/terms", r.status_code, [400, 422], r.status_code == 500)

    # Upload guideline source - Valid text
    txt_file = io.BytesIO(b"Brand Guidelines Section 4: Academic integrity and verified evidence standard.")
    r = session.post(f"{BASE_URL}/api/brand/sources", files={"file": ("guideline.txt", txt_file, "text/plain")})
    record("Upload guideline txt valid", "POST", "/api/brand/sources", r.status_code, [200, 201], r.status_code == 500)

    # Upload guideline source - Invalid file type (e.g. .exe)
    exe_file = io.BytesIO(b"binary garbage")
    r = session.post(f"{BASE_URL}/api/brand/sources", files={"file": ("malicious.exe", exe_file, "application/octet-stream")})
    record("Upload guideline invalid ext", "POST", "/api/brand/sources", r.status_code, [400, 422], r.status_code == 500)

    # 4. Submissions & Versions
    # Create submission - Valid
    submission_payload = {
        "title": "Q4 Social Campaign Draft",
        "content_type": "social",
        "campaign": "Fall Launch",
        "content": "Our platform guarantees 100% results and is the best learning platform in India!",
        "author_name": "Alex Chen"
    }
    r = session.post(f"{BASE_URL}/api/submissions", json=submission_payload)
    record("Create submission valid", "POST", "/api/submissions", r.status_code, [200, 201], r.status_code == 500)
    sub_data = r.json() if r.status_code in [200, 201] else {}
    sub_id = sub_data.get("id") or sub_data.get("submission_id")

    # Create submission - Invalid (empty content)
    r = session.post(f"{BASE_URL}/api/submissions", json={"title": "Empty", "content": ""})
    record("Create submission invalid empty", "POST", "/api/submissions", r.status_code, [400, 422], r.status_code == 500)

    # List submissions
    r = session.get(f"{BASE_URL}/api/submissions")
    record("List submissions", "GET", "/api/submissions", r.status_code, [200], r.status_code == 500)

    # Get submission by ID - Valid
    if sub_id:
        r = session.get(f"{BASE_URL}/api/submissions/{sub_id}")
        record("Get submission valid ID", "GET", f"/api/submissions/{sub_id}", r.status_code, [200], r.status_code == 500)
        sub_details = r.json() if r.status_code == 200 else {}
        
        # Get findings from latest version
        versions = sub_details.get("versions", [])
        version_id = versions[-1].get("id") if versions else None
        runs = versions[-1].get("analysis_runs", []) if versions else []
        findings = runs[-1].get("findings", []) if runs else []
        finding_id = findings[0].get("id") if findings else None
        print(f"  Submission ID: {sub_id}, Version ID: {version_id}, Findings count: {len(findings)}, First finding ID: {finding_id}")

        # Patch finding - Valid
        if finding_id:
            r = session.patch(f"{BASE_URL}/api/findings/{finding_id}", json={
                "status": "accepted",
                "user_edited_replacement": "Our platform supports online learning."
            })
            record("Patch finding valid", "PATCH", f"/api/findings/{finding_id}", r.status_code, [200], r.status_code == 500)

            # Patch finding - Invalid status
            r = session.patch(f"{BASE_URL}/api/findings/{finding_id}", json={
                "status": "invalid_status_enum"
            })
            record("Patch finding invalid status", "PATCH", f"/api/findings/{finding_id}", r.status_code, [400, 422], r.status_code == 500)

        # Create revision (Version 2) - Valid
        r = session.post(f"{BASE_URL}/api/submissions/{sub_id}/versions", json={
            "content": "Our platform supports online learning and provides comprehensive test prep resources.",
            "alt_text": "Classroom learning banner"
        })
        record("Create version 2 valid", "POST", f"/api/submissions/{sub_id}/versions", r.status_code, [200, 201], r.status_code == 500)

        # Create revision - Invalid (empty text)
        r = session.post(f"{BASE_URL}/api/submissions/{sub_id}/versions", json={"content": ""})
        record("Create version invalid empty", "POST", f"/api/submissions/{sub_id}/versions", r.status_code, [400, 422], r.status_code == 500)

        # Review decision (Approval) - Valid
        r = session.post(f"{BASE_URL}/api/submissions/{sub_id}/review", json={
            "decision": "approve",
            "reviewer_name": "Morgan Vance",
            "reviewer_role": "reviewer",
            "reason": "All policy violations resolved in v2."
        })
        record("Review decision valid approve", "POST", f"/api/submissions/{sub_id}/review", r.status_code, [200], r.status_code == 500)

        # Review decision - Invalid decision enum
        r = session.post(f"{BASE_URL}/api/submissions/{sub_id}/review", json={
            "decision": "not_a_real_decision",
            "reviewer_name": "Test"
        })
        record("Review decision invalid enum", "POST", f"/api/submissions/{sub_id}/review", r.status_code, [400, 409, 422], r.status_code == 500)

        # Generate PDF report - Valid
        r = session.get(f"{BASE_URL}/api/submissions/{sub_id}/report.pdf")
        record("Generate PDF report valid", "GET", f"/api/submissions/{sub_id}/report.pdf", r.status_code, [200], r.status_code == 500, notes=f"PDF bytes: {len(r.content)}")

    # Get submission by ID - Invalid (nonexistent UUID)
    fake_id = str(uuid.uuid4())
    r = session.get(f"{BASE_URL}/api/submissions/{fake_id}")
    record("Get submission nonexistent ID", "GET", f"/api/submissions/{fake_id}", r.status_code, [404], r.status_code == 500)

    # 5. Upload document submission
    doc_bytes = io.BytesIO(b"Quarterly financial update: revenue grew by 15% year over year.")
    r = session.post(f"{BASE_URL}/api/submissions/upload", 
        data={"title": "Uploaded Financial Doc", "content_type": "document"},
        files={"file": ("report.txt", doc_bytes, "text/plain")}
    )
    record("Upload submission document txt", "POST", "/api/submissions/upload", r.status_code, [200, 201], r.status_code == 500)

    # Upload document submission - Unsupported extension
    bad_bytes = io.BytesIO(b"<html>bad</html>")
    r = session.post(f"{BASE_URL}/api/submissions/upload",
        data={"title": "Bad Doc", "content_type": "document"},
        files={"file": ("page.html", bad_bytes, "text/html")}
    )
    record("Upload submission unsupported ext", "POST", "/api/submissions/upload", r.status_code, [400, 422], r.status_code == 500)

    # 6. Insights endpoints
    r = session.get(f"{BASE_URL}/api/insights/overview")
    record("Insights overview", "GET", "/api/insights/overview", r.status_code, [200], r.status_code == 500)

    r = session.get(f"{BASE_URL}/api/insights/rules")
    record("Insights rules", "GET", "/api/insights/rules", r.status_code, [200], r.status_code == 500)

    # 7. Feedback & Notifications
    r = session.post(f"{BASE_URL}/api/feedback", json={
        "rating": 5,
        "comment": "The side-by-side diff workspace and evidence citations are outstanding.",
        "category": "Usability"
    })
    record("Submit feedback valid", "POST", "/api/feedback", r.status_code, [200, 201], r.status_code == 500)

    r = session.post(f"{BASE_URL}/api/feedback", json={"rating": 5, "comment": ""})
    record("Submit feedback invalid empty", "POST", "/api/feedback", r.status_code, [400, 422], r.status_code == 500)

    r = session.get(f"{BASE_URL}/api/notifications")
    record("List notifications", "GET", "/api/notifications", r.status_code, [200], r.status_code == 500)

    # Summary
    failed = [res for res in results if not res["pass"]]
    print(f"\nTotal endpoints exercised: {len(results)}")
    print(f"Passed: {len(results) - len(failed)}")
    print(f"Failed / 500 errors: {len(failed)}")
    for f in failed:
        print(f"  FAILED: {f['test']} - Status {f['status']} (Expected {f['expected']}) {f['notes']}")

if __name__ == "__main__":
    run_tests()
