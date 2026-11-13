import httpx
import json
import sys

BASE = "http://127.0.0.1:8000"

def test_full_judge_journey():
    client = httpx.Client(base_url=BASE, timeout=10.0)

    print("Step 1: Establishing guest workspace session...")
    r_sess = client.post("/api/session")
    assert r_sess.status_code == 200
    sess = r_sess.json()
    ws_id = sess["workspace_id"]
    print(f"  -> Guest workspace created: {ws_id}")

    print("Step 2: Checking Brand Knowledge Hub...")
    r_brand = client.get("/api/brand")
    assert r_brand.status_code == 200
    brand = r_brand.json()
    assert brand["name"] == "Verity Learning"
    print(f"  -> Brand loaded: {brand['name']} with {len(brand['rules'])} rules and {len(brand['facts'])} facts.")

    print("Step 3: Submitting Sample A for pre-publication review...")
    sample_a_text = "Our platform guarantees 100% results and is the best learning platform in India!"
    r_sub = client.post("/api/submissions", json={
        "title": "Judge Journey: Q3 Campaign",
        "content_type": "social",
        "content": sample_a_text,
        "author_name": "Priya Sharma",
        "author_role": "creator"
    })
    assert r_sub.status_code == 200
    sub_data = r_sub.json()
    sub_id = sub_data["submission_id"]
    v1_id = sub_data["version_id"]
    print(f"  -> Submission created: {sub_id} (Version 1: {v1_id})")

    print("Step 4: Inspecting Analysis Results & Grounding Evidence...")
    r_detail = client.get(f"/api/submissions/{sub_id}")
    assert r_detail.status_code == 200
    detail = r_detail.json()
    v1_findings = detail["versions"][0]["analysis_run"]["findings"]
    print(f"  -> Findings detected: {len(v1_findings)}")
    for f in v1_findings:
        print(f"     * [{f['severity'].upper()}] {f['rule_id']}: {f['title']}")
        print(f"       Evidence: {f['evidence'].get('text')}")

    # Verify R2 and R3
    r2_f = next(f for f in v1_findings if f["rule_id"] == "R2")
    r3_f = next(f for f in v1_findings if f["rule_id"] == "R3")
    assert r2_f["severity"] == "high"
    assert r3_f["evidence"]["text"] == "No approved supporting evidence found."
    print("  -> Verified: Evidence-backed detection confirmed.")

    print("Step 5: Testing intent-preserving correction diff...")
    r_diff = client.post("/api/submissions/diff", json={
        "original": sample_a_text,
        "revised": "Our platform supports online learning with live and recorded classes."
    })
    assert r_diff.status_code == 200
    diff_data = r_diff.json()
    print(f"  -> Word diff generated ({len(diff_data['diff'])} tokens)")

    print("Step 6: Creating Version 2 (Intent-Preserving Correction)...")
    v2_text = "Verity Learning supports online learning with live and recorded classes."
    r_v2 = client.post(f"/api/submissions/{sub_id}/versions", json={
        "content": v2_text,
        "author_name": "Priya Sharma"
    })
    assert r_v2.status_code == 200
    v2_data = r_v2.json()
    v2_id = v2_data["version_id"]
    print(f"  -> Version 2 created: {v2_id} (Version number: {v2_data['version_number']})")

    print("Step 7: Verifying Version 2 has zero violations...")
    r_detail_v2 = client.get(f"/api/submissions/{sub_id}")
    assert r_detail_v2.status_code == 200
    v2_findings = r_detail_v2.json()["versions"][1]["analysis_run"]["findings"]
    print(f"  -> Version 2 findings: {len(v2_findings)} (Clean)")
    assert len(v2_findings) == 0

    print("Step 8: Reviewer Sign-off (Human Approval Gate)...")
    r_approve = client.post(f"/api/submissions/{sub_id}/review", json={
        "version_id": v2_id,
        "decision": "approve",
        "reviewer_name": "Elena Vance",
        "reviewer_role": "reviewer",
        "reason": "All claims are supported by approved facts F-01 & F-02. Verified for publication."
    })
    assert r_approve.status_code == 200
    app_data = r_approve.json()
    print(f"  -> Approved! Submission status: {app_data['new_submission_status']}")
    print(f"     Locked to Content Hash: {app_data['content_hash']}")

    print("Step 9: Verifying Governance Telemetry & Adaptive Insights...")
    r_insights = client.get("/api/insights")
    assert r_insights.status_code == 200
    insights = r_insights.json()
    print(f"  -> Insights: {insights['total_submissions']} total submissions, {insights['approved_count']} approved.")
    print(f"  -> Rules possibly unclear: {len(insights['rules_possibly_unclear'])} flagged for review.")

    print("\n=======================================================")
    print("SUCCESS: Full Judge Workflow Completed End-to-End!")
    print("All 3 improvements, rules, retrieval, diffs, and approval verified.")
    print("=======================================================")

if __name__ == "__main__":
    test_full_judge_journey()

