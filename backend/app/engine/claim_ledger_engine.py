import re
from typing import List, Dict, Any, Optional

CLAIM_PATTERNS = [
    # Numbers, percentages, prices, quantities
    (r"\b\d+([,.]\d+)?(%|\$|€|£)?\b", "numerical"),
    (r"\b24/7\b", "capability"),
    # Absolute guarantees
    (r"\b(guarantee|guaranteed|guarantees|100%|always|never|risk-free|zero risk)\b", "absolute"),
    # Superlatives & comparatives
    (r"\b(best|fastest|greatest|leading|top-ranked|#1|number one|better than|superior to|unmatched)\b", "superlative"),
    # Capability assertions
    (r"\b(we offer|supports|provides|is available|features|includes|enables)\b", "capability"),
    # Temporal claims
    (r"\b(since \d{4}|in \d{4}|daily|monthly|annually|within \d+ (days|hours|weeks))\b", "temporal"),
]

OPINION_CTA_PATTERNS = [
    r"^(join (us|today)|click here|sign up|enroll now|get started|learn more|subscribe now)[\s!.]*$",
    r"^(we believe|in our opinion|we hope|welcome to|hello learners)[\s!.]*$"
]

def is_opinion_or_cta(sentence: str) -> bool:
    s = sentence.strip().lower()
    return any(re.search(p, s) for p in OPINION_CTA_PATTERNS)

def extract_claims_from_text(text: str) -> List[Dict[str, Any]]:
    """
    Splits text into sentences, identifies factual claims with character offsets,
    and categorizes claim types.
    """
    if not text:
        return []

    claims = []
    # Sentence boundary regex with offsets
    sentence_matches = list(re.finditer(r"[^.!?\n]+[.!?]?", text))
    if not sentence_matches:
        sentence_matches = [re.search(r".+", text)]

    for match in sentence_matches:
        if not match:
            continue
        sentence = match.group(0).strip()
        start = match.start()
        end = match.end()

        if len(sentence) < 4 or is_opinion_or_cta(sentence):
            continue

        matched_type = None
        for pattern, c_type in CLAIM_PATTERNS:
            if re.search(pattern, sentence, re.IGNORECASE):
                matched_type = c_type
                break

        if matched_type:
            claims.append({
                "text": sentence,
                "start": start,
                "end": end,
                "claim_type": matched_type
            })

    return claims

def ground_claim_against_knowledge_hub(
    claim_text: str,
    approved_facts: List[Dict[str, Any]],
    passages: List[Dict[str, Any]],
    rules: List[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Grounds an extracted claim against approved facts and passages:
    Returns {verdict, evidence_id, evidence_excerpt, confidence, rationale}.
    Verdicts: Supported | Conflicting | Unsupported | Needs review
    """
    c_lower = claim_text.lower()

    # 1. Check for absolute guarantees or unapproved superlatives (Conflicting/Policy Violation)
    has_guarantee = bool(re.search(r"\b(guarantee|guaranteed|guarantees|100% results|risk-free)\b", c_lower))
    has_superlative = bool(re.search(r"\b(best|leading|#1|number one|better than)\b", c_lower))

    if has_guarantee:
        return {
            "verdict": "conflicting",
            "evidence_id": "R1",
            "evidence_excerpt": "Absolute performance guarantees and 100% success assertions are strictly prohibited by Brand Policy R1.",
            "confidence": 0.99,
            "rationale": "Claim asserts an absolute result guarantee which directly conflicts with registered brand compliance rules."
        }

    if has_superlative:
        return {
            "verdict": "conflicting",
            "evidence_id": "R2",
            "evidence_excerpt": "Unsubstantiated market superlative claims (#1, best) violate Advertising Policy R2.",
            "confidence": 0.98,
            "rationale": "Claim asserts superlative market standing without third-party auditor substantiation."
        }

    # 2. Match against Approved Facts (F-01, F-02, etc.)
    for fact in approved_facts:
        f_stmt = (fact.get("statement") or "").lower()
        f_name = (fact.get("name") or "").lower()

        # Subject overlap
        words_claim = set(re.findall(r"\w+", c_lower))
        words_fact = set(re.findall(r"\w+", f_stmt))
        common = words_claim.intersection(words_fact)

        # Ignore stopwords
        stopwords = {"the", "and", "is", "in", "to", "of", "a", "our", "we", "for", "with", "on", "are"}
        meaningful_common = common - stopwords

        if len(meaningful_common) >= 3 or ("live" in c_lower and "recorded" in c_lower and "classes" in f_stmt):
            # Check numbers
            claim_nums = re.findall(r"\b\d+\b", c_lower)
            fact_nums = re.findall(r"\b\d+\b", f_stmt)

            if claim_nums and fact_nums and claim_nums != fact_nums:
                return {
                    "verdict": "conflicting",
                    "evidence_id": fact.get("id") or fact.get("code"),
                    "evidence_excerpt": fact.get("statement"),
                    "confidence": 0.95,
                    "rationale": f"Claim numerical metrics ({claim_nums}) conflict with approved fact baseline ({fact_nums})."
                }

            return {
                "verdict": "supported",
                "evidence_id": fact.get("id") or fact.get("code"),
                "evidence_excerpt": fact.get("statement"),
                "confidence": 1.0,
                "rationale": f"Empirical claim is fully supported by approved fact {fact.get('code', 'F-01')}."
            }

    # 3. Match against Guideline Passages
    for passage in passages:
        p_text = (passage.get("text") or "").lower()
        words_claim = set(re.findall(r"\w+", c_lower)) - {"the", "and", "is", "in", "to", "of", "a", "our"}
        words_p = set(re.findall(r"\w+", p_text)) - {"the", "and", "is", "in", "to", "of", "a", "our"}
        if len(words_claim.intersection(words_p)) >= 4:
            return {
                "verdict": "supported",
                "evidence_id": passage.get("id"),
                "evidence_excerpt": passage.get("text")[:200],
                "confidence": 0.90,
                "rationale": "Claim terminology and assertions are grounded in approved guideline passages."
            }

    # 4. Fallback: No approved supporting evidence found
    return {
        "verdict": "unsupported",
        "evidence_id": None,
        "evidence_excerpt": "No approved supporting evidence found.",
        "confidence": 0.90,
        "rationale": "No approved corporate source, guideline passage, or certified fact verifies this statement."
    }
