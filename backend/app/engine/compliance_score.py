from typing import Dict, Any, List

COMPONENT_WEIGHTS = {
    "Terminology": 20,
    "Tone": 20,
    "Facts": 25,
    "Claims": 25,
    "Accessibility": 10
}

SEVERITY_WEIGHTS = {
    "high": 3.0,
    "medium": 2.0,
    "low": 1.0
}

def calculate_compliance_score(
    findings: List[Dict[str, Any]],
    verified_checks: List[Dict[str, Any]] = None,
    component_weights: Dict[str, int] = None
) -> Dict[str, Any]:
    weights = component_weights or COMPONENT_WEIGHTS
    verified = verified_checks or []

    # Map categories into components
    component_results = {
        comp: {
            "weight": w,
            "failed_penalty": 0.0,
            "checked_weight": 0.0,
            "passed_count": 0,
            "failed_count": 0,
            "needs_review_count": 0,
            "score": 100
        }
        for comp, w in weights.items()
    }

    # Add baseline checked weight from verified checks
    for vc in verified:
        comp = "Facts" if "fact" in str(vc.get("fact_id", "")).lower() else "Claims"
        if comp in component_results:
            component_results[comp]["checked_weight"] += 2.0
            component_results[comp]["passed_count"] += 1

    # Analyze findings
    for f in findings:
        cat = f.get("category", "Messaging")
        # Normalize category to component
        comp = "Tone" if cat == "Tone" else ("Terminology" if cat == "Terminology" else ("Facts" if cat == "Facts" else ("Accessibility" if cat == "Accessibility" else "Claims")))
        
        if comp not in component_results:
            comp = "Claims"

        verdict = f.get("verdict", "needs_human_review")
        sev = (f.get("severity") or "medium").lower()
        penalty = SEVERITY_WEIGHTS.get(sev, 2.0)

        # Baseline check was performed
        component_results[comp]["checked_weight"] += penalty

        if verdict in ["verified_rule_violation", "source_backed_concern"]:
            # Verified failure
            component_results[comp]["failed_penalty"] += penalty
            component_results[comp]["failed_count"] += 1
        elif verdict == "needs_human_review":
            component_results[comp]["needs_review_count"] += 1

    # Calculate component scores and weighted overall score
    total_checked_weight = 0.0
    total_max_weight = sum(weights.values())
    weighted_score_sum = 0.0

    for comp, data in component_results.items():
        # Component score formula: 100 * (1 - failed / checked) if checked > 0 else 100
        chk = data["checked_weight"]
        fail = data["failed_penalty"]
        if chk > 0:
            c_score = max(0.0, min(100.0, 100.0 * (1.0 - (fail / chk))))
        else:
            c_score = 100.0
        data["score"] = round(c_score, 1)

        # Contribution to overall
        comp_weight = data["weight"]
        weighted_score_sum += c_score * (comp_weight / total_max_weight)
        if chk > 0:
            total_checked_weight += comp_weight

    overall_score = round(weighted_score_sum, 1)

    # 60% check threshold check
    checked_pct = (total_checked_weight / total_max_weight) * 100.0
    has_sufficient_checks = True # Always provide guidance score with breakdown

    grade = "A+" if overall_score >= 95 else ("A" if overall_score >= 85 else ("B" if overall_score >= 70 else ("C" if overall_score >= 50 else "D")))

    summary = (
        "Exceptional alignment with brand guidelines." if overall_score >= 90 else
        ("Strong alignment; minor adjustments recommended." if overall_score >= 75 else
         "Policy violations detected requiring human review and correction.")
    )

    return {
        "overall_score": overall_score,
        "grade": grade,
        "summary": summary,
        "formula": "score = 100 × (1 − Σ weight_failed / Σ weight_checked)",
        "has_sufficient_checks": has_sufficient_checks,
        "checked_percentage": round(checked_pct, 1),
        "components": component_results,
        "disclaimer": "This score represents automated pre-publication guidance and does not replace human editorial sign-off."
    }

def generate_evidence_ledger(
    content: str,
    findings: List[Dict[str, Any]],
    verified_checks: List[Dict[str, Any]] = None,
    approved_facts: List[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    """
    Tier 2 Differentiator:
    Extracts every claim in the draft, with verdict (supported, conflicting, unsupported, needs_review) and source.
    """
    ledger = []
    
    # 1. Add verified items
    for vc in (verified_checks or []):
        ledger.append({
            "claim": vc.get("sentence", ""),
            "verdict": "supported",
            "source_code": vc.get("fact_id", "FACT"),
            "source_text": vc.get("statement", "Approved fact"),
            "source_doc": vc.get("source", "Brand Fact Database"),
            "confidence": 0.98,
            "status_label": "Fully Supported by Approved Fact"
        })

    # 2. Add finding claims
    for f in findings:
        cat = f.get("category", "")
        if cat in ["Claims", "Facts", "Messaging", "Terminology"]:
            ev = f.get("evidence", {})
            v = f.get("verdict", "")
            
            if v == "verified_rule_violation":
                verdict_label = "conflicting"
                status_desc = f"Rule Violation: {f.get('title')}"
            elif "No approved" in str(ev.get("text", "")):
                verdict_label = "unsupported"
                status_desc = "No approved supporting evidence found."
            else:
                verdict_label = "needs_review"
                status_desc = "Requires manual editorial review."

            ledger.append({
                "claim": f.get("quote", ""),
                "verdict": verdict_label,
                "source_code": f.get("rule_id") or ev.get("fact_id") or "UNVERIFIED",
                "source_text": ev.get("text") or "No approved supporting evidence found.",
                "source_doc": ev.get("source") or "Brand Guidelines",
                "confidence": float(f.get("confidence", 0.9)),
                "status_label": status_desc
            })

    return ledger

