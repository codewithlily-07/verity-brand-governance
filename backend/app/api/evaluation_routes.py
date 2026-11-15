import time
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from backend.app.core.database import get_db
from backend.app.api.brand_routes import get_or_create_profile
from backend.app.api.submission_routes import extract_brand_dict
from backend.app.engine.verity_engine import VerityAnalysisEngine

router = APIRouter(prefix="/evaluation", tags=["Evaluation & Quality Benchmark"])

LABELLED_TEST_SET = [
    {
        "id": "draft-01-social",
        "name": "Social Media Launch Post",
        "channel": "social",
        "content": "Verity learning is the best in India! Our platform guarantees 100% results for every student.",
        "planted_issues": [
            {
                "id": "issue-01",
                "label": "Brand name capitalization ('Verity learning' -> 'Verity Learning')",
                "target_quote": "verity learning",
                "category": "Terminology",
                "expected_rule": "R1"
            },
            {
                "id": "issue-02",
                "label": "Prohibited absolute guarantee ('guarantees 100% results')",
                "target_quote": "guarantees 100% results",
                "category": "Claims",
                "expected_rule": "R2"
            },
            {
                "id": "issue-03",
                "label": "Unsupported superlative ('best in India')",
                "target_quote": "best in india",
                "category": "Claims",
                "expected_rule": "R3"
            },
            {
                "id": "issue-11",
                "label": "Impersonal terminology ('student' instead of 'learner')",
                "target_quote": "student",
                "category": "Terminology",
                "expected_rule": "Brand Glossary Standard"
            }
        ]
    },
    {
        "id": "draft-02-press",
        "name": "Press Release (Pricing & Schedule)",
        "channel": "press_release",
        "content": "Verity Learning announces that subscriptions remain at Rs. 499 for the 2024 academic cycle with 24/7 unlimited personal tutoring.",
        "planted_issues": [
            {
                "id": "issue-04",
                "label": "Outdated temporal reference ('2024 academic cycle')",
                "target_quote": "2024",
                "category": "Facts",
                "expected_rule": "Factual Verification"
            },
            {
                "id": "issue-05",
                "label": "Unapproved price point claim ('Rs. 499')",
                "target_quote": "rs. 499",
                "category": "Facts",
                "expected_rule": "Factual Verification"
            },
            {
                "id": "issue-06",
                "label": "Unverified SLA claim ('24/7 unlimited personal tutoring')",
                "target_quote": "24/7",
                "category": "Claims",
                "expected_rule": "R3"
            }
        ]
    },
    {
        "id": "draft-03-web",
        "name": "Website Copy (Platform Overview)",
        "channel": "web_copy",
        "content": "Our revolutionary world-class platform lets users easily master courses without trying.",
        "planted_issues": [
            {
                "id": "issue-07",
                "label": "Hyperbolic marketing buzzword ('revolutionary')",
                "target_quote": "revolutionary",
                "category": "Tone",
                "expected_rule": "Voice & Tone"
            },
            {
                "id": "issue-08",
                "label": "Unsubstantiated puffery ('world-class')",
                "target_quote": "world-class",
                "category": "Tone",
                "expected_rule": "R3"
            },
            {
                "id": "issue-09",
                "label": "Impersonal terminology ('users' instead of 'learners')",
                "target_quote": "users",
                "category": "Terminology",
                "expected_rule": "Glossary Standard"
            },
            {
                "id": "issue-10",
                "label": "Misleading low-effort claim ('without trying')",
                "target_quote": "without trying",
                "category": "Messaging",
                "expected_rule": "Tone & Voice"
            }
        ]
    },
    {
        "id": "draft-04-clean",
        "name": "Clean Benchmark Draft",
        "channel": "web_copy",
        "content": "Verity Learning offers accredited online programs with live webinars and recorded lectures scheduled Monday through Friday.",
        "planted_issues": []
    }
]

@router.get("/benchmark")
def get_benchmark_spec():
    """Returns the static labelled test set specification."""
    return {
        "title": "WCC Forge 48 Labelled Evaluation Benchmark",
        "note": "Only measured results are reported. AI findings are advisory; an authorised human reviewer owns final approval.",
        "test_cases": LABELLED_TEST_SET
    }

@router.post("/run")
def run_live_evaluation(request: Request, db: Session = Depends(get_db)):
    """
    Executes the live VerityAnalysisEngine across the labelled test set.
    Measures precision, recall, evidence accuracy, and reports real numbers.
    """
    profile = get_or_create_profile(db, request)
    brand_dict = extract_brand_dict(profile)
    engine = VerityAnalysisEngine(brand_dict)

    results = []
    total_planted = 0
    total_detected_planted = 0
    total_findings_generated = 0
    clean_draft_false_positives = 0
    correct_evidence_citations = 0

    start_eval_time = time.time()

    for tc in LABELLED_TEST_SET:
        t_start = time.time()
        engine_output = engine.run_analysis(
            content=tc["content"],
            content_type=tc["channel"]
        )
        duration_ms = int((time.time() - t_start) * 1000)
        findings = engine_output.get("findings", [])
        total_findings_generated += len(findings)

        planted_eval = []
        for planted in tc["planted_issues"]:
            total_planted += 1
            tq = planted["target_quote"].lower()
            # Check if any finding caught this quote or related span
            matched = False
            matched_finding = None
            for f in findings:
                f_quote = (f.get("quote") or "").lower()
                f_title = (f.get("title") or "").lower()
                f_expl = (f.get("explanation") or "").lower()
                if tq in f_quote or tq in f_title or tq in f_expl or planted["target_quote"].lower() in f_quote:
                    matched = True
                    matched_finding = f
                    break
            
            if matched:
                total_detected_planted += 1
                # Check evidence accuracy: does it cite an approved source or explicitly state no source found?
                ev = matched_finding.get("evidence") or {}
                has_passage = bool(ev.get("matched_passage") or ev.get("source") or ev.get("text"))
                has_missing_tag = (matched_finding.get("verdict") == "needs_human_review") or ("no approved" in str(ev).lower()) or ("no approved" in matched_finding.get("explanation", "").lower())
                if has_passage or has_missing_tag:
                    correct_evidence_citations += 1

            ev_cited = None
            if matched and matched_finding:
                ev_obj = matched_finding.get("evidence") or {}
                ev_cited = ev_obj.get("source") or ev_obj.get("matched_passage") or "No approved source found"

            planted_eval.append({
                "issue_id": planted["id"],
                "label": planted["label"],
                "detected": matched,
                "matched_finding_title": matched_finding.get("title") if matched_finding else None,
                "evidence_cited": ev_cited
            })

        # False positive check for clean draft
        if len(tc["planted_issues"]) == 0:
            clean_draft_false_positives = len(findings)

        results.append({
            "test_case_id": tc["id"],
            "name": tc["name"],
            "channel": tc["channel"],
            "content": tc["content"],
            "planted_issues_count": len(tc["planted_issues"]),
            "findings_count": len(findings),
            "planted_evaluation": planted_eval,
            "duration_ms": duration_ms
        })

    eval_duration_total_ms = int((time.time() - start_eval_time) * 1000)

    # Compute metrics
    tp = total_detected_planted
    fn = total_planted - tp
    # False positives on clean draft
    fp = clean_draft_false_positives

    precision = round((tp / (tp + fp)) * 100, 1) if (tp + fp) > 0 else 100.0
    recall = round((tp / total_planted) * 100, 1) if total_planted > 0 else 100.0
    evidence_accuracy = round((correct_evidence_citations / tp) * 100, 1) if tp > 0 else 100.0

    return {
        "status": "success",
        "title": "Live Engine Evaluation Results",
        "note": "Only measured results are reported.",
        "metrics": {
            "planted_issues_total": total_planted,
            "planted_issues_detected": tp,
            "planted_issues_missed": fn,
            "false_positives_on_clean_draft": fp,
            "precision_percent": precision,
            "recall_percent": recall,
            "evidence_accuracy_percent": evidence_accuracy,
            "review_time": "Not yet measured",
            "eval_duration_ms": eval_duration_total_ms
        },
        "test_case_results": results
    }
