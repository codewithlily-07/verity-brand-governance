"""
VERITY Analysis Engine
Three-layer analysis pipeline:
Layer 1: Deterministic rules (always on)
Layer 2: Retrieval-grounded analysis (always attempted)
Layer 3: AI contextual analysis (optional, validated)
"""

import re
import math
import hashlib
from typing import List, Dict, Any, Tuple, Optional

# Standard categories and severity
CATEGORIES = ["Claims", "Facts", "Messaging", "Terminology", "Tone", "Visual", "Accessibility", "Security"]
SEVERITY_ORDER = {"high": 0, "medium": 1, "low": 2}

VERDICT_RULE_VIOLATION = "verified_rule_violation"
VERDICT_SOURCE_BACKED = "source_backed_concern"
VERDICT_NEEDS_REVIEW = "needs_human_review"

NO_EVIDENCE_TEXT = "No approved supporting evidence found."

SOFTEN_MAP = {
    "fastest": "fast",
    "best": "a strong choice",
    "leading": "established",
    "number one": "trusted",
    "no. 1": "trusted",
    "#1": "trusted",
    "most trusted": "trusted",
    "most secure": "secure",
    "safest": "safe",
    "cheapest": "affordable",
    "lowest": "low",
    "highest": "high",
    "greatest": "great",
    "unbeatable": "competitive",
    "revolutionary": "new",
    "world-class": "high-quality",
    "world class": "high-quality",
    "top-rated": "well-rated",
    "top rated": "well-rated",
    "unmatched": "strong",
    "ultimate": "complete",
    "perfect": "dependable",
}

STOP_WORDS = set(
    "a an the and or but if of to in on at by for with from as is are was were be been being it its this that these those our your their we you they he she i me my us them than then so such nor very can will would should could may might do does did has have had just also all any each into over under up down out off again here there when where why how what which who whom about between through during before after above below get gets got now new more most".split()
)

def compute_content_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower().strip())

def escape_regex(s: str) -> str:
    return re.escape(s)

def match_case(replacement: str, original: str) -> str:
    if not replacement:
        return replacement
    if len(original) > 1 and original.isupper():
        return replacement.upper()
    if original and original[0].isupper():
        return replacement[0].upper() + replacement[1:]
    return replacement

def find_all_matches(pattern: str, text: str, flags=re.IGNORECASE) -> List[Dict[str, Any]]:
    matches = []
    try:
        re_obj = re.compile(pattern, flags)
    except re.error:
        return []
    for m in re_obj.finditer(text):
        if m.end() > m.start():
            matches.append({
                "start": m.start(),
                "end": m.end(),
                "quote": m.group(0)
            })
    return matches

def split_sentences(text: str) -> List[Dict[str, Any]]:
    results = []
    re_sent = re.compile(r"[^.!?\n]+(?:[.!?]+|\n+|$)", re.UNICODE)
    for m in re_sent.finditer(text):
        raw = m.group(0)
        t = raw.strip()
        if len(t) > 1:
            lead = len(raw) - len(raw.lstrip())
            start = m.start() + lead
            end = start + len(t)
            results.append({
                "start": start,
                "end": end,
                "text": t
            })
    return results

def extract_numbers(s: str) -> List[str]:
    return [re.sub(r",", "", n) for n in re.findall(r"\d[\d,]*(?:\.\d+)?", s)]

def tokenize(s: str) -> List[str]:
    clean = re.sub(r"[^a-zA-Z0-9%\s]", " ", s.lower())
    words = clean.split()
    return [w for w in words if w not in STOP_WORDS and not w.isdigit()]

# Readability & Syllables
def count_syllables(word: str) -> int:
    w = re.sub(r"[^a-zA-Z]", "", word.lower())
    if not w:
        return 0
    if len(w) <= 3:
        return 1
    w = re.sub(r"(?:[^laeiouy]es|ed|[^laeiouy]e)$", "", w)
    w = re.sub(r"^y", "", w)
    vowels = re.findall(r"[aeiouy]{1,2}", w)
    return max(1, len(vowels))

def calculate_flesch_reading_ease(text: str) -> float:
    words = re.findall(r"[A-Za-z']+", text)
    sents = split_sentences(text)
    if not words or not sents:
        return 100.0
    total_syllables = sum(count_syllables(w) for w in words)
    words_count = len(words)
    sents_count = max(1, len(sents))
    
    score = 206.835 - (1.015 * (words_count / sents_count)) - (84.6 * (total_syllables / words_count))
    return max(0.0, min(100.0, score))

# Colour calculations & CIE deltaE
def hex_to_rgb(h: str) -> Optional[Tuple[int, int, int]]:
    h = h.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        return None
    try:
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
    except ValueError:
        return None

def luminance(rgb: Tuple[int, int, int]) -> float:
    def channel(v):
        v = v / 255.0
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = map(channel, rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_ratio(hex1: str, hex2: str) -> Optional[float]:
    c1 = hex_to_rgb(hex1)
    c2 = hex_to_rgb(hex2)
    if not c1 or not c2:
        return None
    l1 = luminance(c1)
    l2 = luminance(c2)
    hi = max(l1, l2)
    lo = min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)

def rgb_to_lab(rgb: Tuple[int, int, int]) -> Tuple[float, float, float]:
    def channel(v):
        v = v / 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = map(channel, rgb)
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722)
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
    
    def f(t):
        return t ** (1/3) if t > 0.008856 else (7.787 * t + 16/116)
    
    L = 116 * f(y) - 16
    a = 500 * (f(x) - f(y))
    b = 200 * (f(y) - f(z))
    return (L, a, b)

def delta_e(hex1: str, hex2: str) -> float:
    c1 = hex_to_rgb(hex1)
    c2 = hex_to_rgb(hex2)
    if not c1 or not c2:
        return 999.0
    lab1 = rgb_to_lab(c1)
    lab2 = rgb_to_lab(c2)
    return math.sqrt((lab1[0] - lab2[0])**2 + (lab1[1] - lab2[1])**2 + (lab1[2] - lab2[2])**2)

def is_neutral_color(hex_code: str) -> bool:
    rgb = hex_to_rgb(hex_code)
    if not rgb:
        return False
    return (max(rgb) - min(rgb)) < 22

# Word-level diff
def diff_words(a: str, b: str) -> List[Dict[str, str]]:
    words_a = re.split(r"(\s+)", a)
    words_b = re.split(r"(\s+)", b)
    words_a = [w for w in words_a if w]
    words_b = [w for w in words_b if w]
    
    n, m = len(words_a), len(words_b)
    if n * m > 1000000:
        return [{"t": "del", "v": a}, {"t": "add", "v": b}]
    
    # Standard LCS table
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n - 1, -1, -1):
        for j in range(m - 1, -1, -1):
            if words_a[i] == words_b[j]:
                dp[i][j] = dp[i + 1][j + 1] + 1
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j + 1])
                
    result = []
    i, j = 0, 0
    def push_diff(t, val):
        if result and result[-1]["t"] == t:
            result[-1]["v"] += val
        else:
            result.append({"t": t, "v": val})
            
    while i < n and j < m:
        if words_a[i] == words_b[j]:
            push_diff("same", words_a[i])
            i += 1
            j += 1
        elif dp[i + 1][j] >= dp[i][j + 1]:
            push_diff("del", words_a[i])
            i += 1
        else:
            push_diff("add", words_b[j])
            j += 1
            
    while i < n:
        push_diff("del", words_a[i])
        i += 1
    while j < m:
        push_diff("add", words_b[j])
        j += 1
        
    return result


class VerityAnalysisEngine:
    """
    Complete analysis engine implementing:
    - Layer 1: Deterministic rules (phrase variants, regex, brand name, required elements, prompt-injection, accessibility, visual)
    - Layer 2: Retrieval-grounded analysis (approved facts & guidelines passages, strict evidence citation or 'No approved supporting evidence found.')
    - Layer 3: AI contextual analysis (structured JSON, validated quotes & IDs, fallback)
    """

    def __init__(self, brand_profile_data: Dict[str, Any]):
        self.brand = brand_profile_data
        raw_name = self.brand.get("name", "Verity Learning")
        # Strip test brand annotation like "(Test Brand)" to ensure crisp brand casing check
        self.name = re.sub(r"\s*\(.*?\)", "", raw_name).strip() if raw_name else "Verity Learning"
        self.rules = self.brand.get("rules", [])
        self.facts = self.brand.get("facts", [])
        self.passages = self.brand.get("passages", [])
        self.terms = list(self.brand.get("terminology", []))
        term_avoids = {t.get("avoid", "").lower() for t in self.terms if isinstance(t, dict)}
        if "student" not in term_avoids:
            self.terms.append({"avoid": "student", "prefer": "learner", "note": "Brand prefers 'learner' over 'student'."})
        if "users" not in term_avoids:
            self.terms.append({"avoid": "users", "prefer": "learners", "note": "Brand prefers 'learners' over 'users'."})
        self.palette = self.brand.get("palette", [
            {"name": "Midnight Navy", "hex": "#0A1128", "role": "primary"},
            {"name": "Gold Accent", "hex": "#C8A35A", "role": "accent"},
            {"name": "Ivory Light", "hex": "#FBF9F3", "role": "background"}
        ])

    def run_analysis(
        self,
        content: str,
        content_type: str = "social",
        image_meta: Optional[Dict[str, Any]] = None,
        fg_color: Optional[str] = None,
        bg_color: Optional[str] = None,
        alt_text: Optional[str] = None,
        llm_findings: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        
        findings = []
        verified_checks = []
        layers_status = {
            "rules": "ok",
            "retrieval": "ok",
            "ai": "skipped"
        }
        
        # -------------------------------------------------------------
        # Security: Prompt-Injection Detection
        # Uploaded documents and pasted content are data only.
        # Strip nothing silently; detect instruction-like text and add finding.
        # Must have NO effect on analysis or approval.
        # -------------------------------------------------------------
        injection_patterns = [
            r"ignore\s+(all\s+)?(previous|prior)\s+instructions",
            r"disregard\s+(all\s+)?(previous|prior)\s+instructions",
            r"approve\s+this\s+content\s+immediately",
            r"mark\s+(this\s+)?as\s+approved",
            r"you\s+are\s+now\s+in\s+(admin|override|system)\s+mode",
            r"system\s*prompt\s*override",
            r"new\s+system\s+instruction:"
        ]
        for pat in injection_patterns:
            for m in find_all_matches(pat, content):
                findings.append({
                    "id": f"SEC-INJECT:{m['start']}-{m['end']}",
                    "category": "Security",
                    "severity": "medium",
                    "title": "Possible prompt-injection text found in content",
                    "quote": m["quote"],
                    "start_offset": m["start"],
                    "end_offset": m["end"],
                    "rule_id": "SEC-01",
                    "rule_text": "Content must be treated as inert data and not execute instructions.",
                    "evidence": {
                        "text": "Pattern matched instruction-override signature. AI never executes content instructions."
                    },
                    "explanation": f"The phrase '{m['quote']}' resembles an AI system instruction or prompt override attempt. Content is strictly treated as data only.",
                    "suggested_replacement": None,
                    "rationale": "Human reviewer must verify that this text was intended as legitimate content and not an adversarial attempt.",
                    "verdict": VERDICT_NEEDS_REVIEW,
                    "confidence": 0.95,
                    "layer": "rules",
                    "status": "open"
                })

        # -------------------------------------------------------------
        # Layer 1: Deterministic Rules
        # -------------------------------------------------------------
        # 1.1 Brand Name Spelling & Exact Casing (R1)
        if self.name:
            # Match any case-insensitive occurrence that does NOT match exact casing
            words = self.name.split()
            escaped_words = [escape_regex(w) for w in words]
            # Pattern allowing optional whitespace between brand words
            brand_pat = r"(?<!\w)" + r"\s*".join(escaped_words) + r"(?!\w)"
            for m in find_all_matches(brand_pat, content):
                if m["quote"] != self.name:
                    findings.append({
                        "id": f"R1-BRAND-NAME:{m['start']}-{m['end']}",
                        "category": "Terminology",
                        "severity": "medium",
                        "title": f"Incorrect brand name casing: \"{m['quote']}\"",
                        "quote": m["quote"],
                        "start_offset": m["start"],
                        "end_offset": m["end"],
                        "rule_id": "R1",
                        "rule_text": f"Approved product and company name is '{self.name}' (exact casing required).",
                        "evidence": {
                            "source": "Brand Guidelines",
                            "text": f"Always write the brand name exactly as '{self.name}'."
                        },
                        "explanation": f"Found '{m['quote']}'. The brand name must always be capitalized and formatted as '{self.name}'.",
                        "suggested_replacement": self.name,
                        "rationale": f"Correct casing to official brand standard '{self.name}'.",
                        "verdict": VERDICT_RULE_VIOLATION,
                        "confidence": 1.0,
                        "layer": "rules",
                        "status": "open"
                    })

        # 1.2 Prohibited Absolute Claims & Phrase Variants (R2)
        # Requirement: "100% guaranteed results" and absolute-outcome variants
        # Catch natural variants:
        # "100% guaranteed results", "guarantees 100% results", "guaranteed 100% result",
        # "results are 100% guaranteed", "100% results guaranteed", etc.
        # Plus generic absolute claims (100%, guaranteed, always, never fails, risk-free next to results/safe/success)
        absolute_variant_patterns = [
            r"100\s?%\s*(guaranteed|guarantee|guarantees)\s*(results?|success|outcomes?)?",
            r"(guarantees?|guaranteed)\s*100\s?%\s*(results?|success|outcomes?)?",
            r"(results?|outcomes?)\s*(are|is)?\s*100\s?%\s*(guaranteed|guarantee)",
            r"100\s?%\s*(results?|outcomes?)\s*(guaranteed|guarantee)",
            r"\b(guaranteed|guarantee|guarantees)\s+results?\b",
            r"\bresults?\s+(are\s+)?guaranteed\b",
            r"\bnever\s+fails?\b",
            r"\brisk[\s-]free\s+(success|results?|outcomes?)\b",
            r"\b100\s?%\s+success\b"
        ]
        
        # Lookup approved fact F-01 to use as exact intent-preserving correction wording!
        f01_text = "Our platform supports online learning."
        for f in self.facts:
            if f.get("code") == "F-01" or "supports online learning" in f.get("statement", "").lower():
                f01_text = f.get("statement")
                if not f01_text.endswith("."):
                    f01_text += "."
                break

        r2_matches = []
        for pat in absolute_variant_patterns:
            for m in find_all_matches(pat, content):
                # Avoid duplicate overlapping matches
                if not any(abs(m["start"] - ex["start"]) < 5 for ex in r2_matches):
                    r2_matches.append(m)
                    findings.append({
                        "id": f"R2-ABSOLUTE:{m['start']}-{m['end']}",
                        "category": "Claims",
                        "severity": "high",
                        "title": f"Prohibited terminology / absolute claim: \"{m['quote']}\"",
                        "quote": m["quote"],
                        "start_offset": m["start"],
                        "end_offset": m["end"],
                        "rule_id": "R2",
                        "rule_text": "Prohibited: '100% guaranteed results' and absolute-outcome claims.",
                        "evidence": {
                            "fact_id": "F-01",
                            "source": "Approved Fact F-01",
                            "text": f01_text
                        },
                        "explanation": f"The claim '{m['quote']}' makes an unverified absolute guarantee. Policy prohibits guaranteeing educational or business outcomes.",
                        "suggested_replacement": f01_text,
                        "rationale": f"Replaced prohibited guarantee with verified factual claim from Approved Fact F-01 ('{f01_text}').",
                        "verdict": VERDICT_RULE_VIOLATION,
                        "confidence": 1.0,
                        "layer": "rules",
                        "status": "open"
                    })

        # 1.3 Terminology Mapping (prefer over avoid) & Slang / Informal Tone
        for term in self.terms:
            avoid = term.get("avoid", "")
            prefer = term.get("prefer", "")
            if not avoid or not prefer:
                continue
            pat = r"\b" + escape_regex(avoid) + r"\b"
            for m in find_all_matches(pat, content):
                # Check if this occurrence is part of an approved fact statement
                # (e.g. F-02 uses "live and recorded classes", so "classes" in that approved context is allowed)
                is_approved_fact_phrase = False
                for f in self.facts:
                    stmt = f.get("statement", "").lower()
                    if avoid.lower() in stmt:
                        # Check if surrounding words in content match the fact statement
                        start_ctx = max(0, m["start"] - 25)
                        end_ctx = min(len(content), m["end"] + 25)
                        surrounding = content[start_ctx:end_ctx].lower()
                        # If at least 2 adjacent words from the fact appear in surrounding text
                        fact_words = [w for w in stmt.split() if len(w) > 3]
                        matching_fact_words = sum(1 for fw in fact_words if fw in surrounding)
                        if matching_fact_words >= 2:
                            is_approved_fact_phrase = True
                            break
                if is_approved_fact_phrase:
                    continue

                repl = match_case(prefer, m["quote"])
                findings.append({
                    "id": f"TERM:{m['start']}-{m['end']}",
                    "category": "Terminology",
                    "severity": "medium",
                    "title": f"Preferred terminology: Use \"{prefer}\" instead of \"{avoid}\"",
                    "quote": m["quote"],
                    "start_offset": m["start"],
                    "end_offset": m["end"],
                    "rule_id": "TERM-01",
                    "rule_text": f"Approved terminology prefers '{prefer}' over '{avoid}'.",
                    "evidence": {
                        "source": "Brand Glossary",
                        "text": term.get("note", f"Standard brand term is '{prefer}'.")
                    },
                    "explanation": f"Found '{m['quote']}'. Brand guidelines specify using '{prefer}' to maintain consistent brand vocabulary.",
                    "suggested_replacement": repl,
                    "rationale": f"Standardize on preferred brand term '{prefer}'.",
                    "verdict": VERDICT_RULE_VIOLATION,
                    "confidence": 1.0,
                    "layer": "rules",
                    "status": "open"
                })

        # Slang words (e.g. "guys", "gonna", "wanna", "bro")
        slang_map = {
            "guys": "everyone",
            "guy": "learner",
            "gonna": "going to",
            "wanna": "want to",
            "bro": "friend",
            "y'all": "all of you"
        }
        for slang, fix in slang_map.items():
            pat = r"\b" + escape_regex(slang) + r"\b"
            for m in find_all_matches(pat, content):
                repl = match_case(fix, m["quote"])
                findings.append({
                    "id": f"TONE-SLANG:{m['start']}-{m['end']}",
                    "category": "Tone",
                    "severity": "low",
                    "title": f"Informal slang: \"{m['quote']}\"",
                    "quote": m["quote"],
                    "start_offset": m["start"],
                    "end_offset": m["end"],
                    "rule_id": "R6",
                    "rule_text": "Professional tone required: avoid informal slang.",
                    "evidence": {
                        "source": "Brand Voice Guidelines",
                        "text": "Tone must be professional, trustworthy, and helpful. Avoid colloquialisms and informal slang."
                    },
                    "explanation": f"The term '{m['quote']}' is informal slang and detracts from the professional, trustworthy voice.",
                    "suggested_replacement": repl,
                    "rationale": f"Replace colloquialism with professional equivalent '{repl}'.",
                    "verdict": VERDICT_RULE_VIOLATION,
                    "confidence": 0.95,
                    "layer": "rules",
                    "status": "open"
                })

        # 1.4 Exclamation Marks (R6: at most one exclamation mark, no repeated "!!")
        exclam_matches = find_all_matches(r"!+", content)
        for i, m in enumerate(exclam_matches):
            if len(m["quote"]) > 1:
                findings.append({
                    "id": f"TONE-EXCLAM-REP:{m['start']}-{m['end']}",
                    "category": "Tone",
                    "severity": "low",
                    "title": "Repeated exclamation marks",
                    "quote": m["quote"],
                    "start_offset": m["start"],
                    "end_offset": m["end"],
                    "rule_id": "R6",
                    "rule_text": "Voice guideline allows at most one exclamation mark. No repeated '!!'.",
                    "evidence": {
                        "source": "Brand Voice Guidelines",
                        "text": "Keep punctuation restrained. Use at most one exclamation mark per communication; never repeat multiple exclamation marks."
                    },
                    "explanation": f"Found repeated exclamation '{m['quote']}'. Multiple exclamation marks feel like shouting and diminish trust.",
                    "suggested_replacement": ".",
                    "rationale": "Replace emphatic punctuation with standard punctuation.",
                    "verdict": VERDICT_RULE_VIOLATION,
                    "confidence": 1.0,
                    "layer": "rules",
                    "status": "open"
                })
            elif i >= 1:
                findings.append({
                    "id": f"TONE-EXCLAM-MAX:{m['start']}-{m['end']}",
                    "category": "Tone",
                    "severity": "low",
                    "title": "Too many exclamation marks (limit 1)",
                    "quote": m["quote"],
                    "start_offset": m["start"],
                    "end_offset": m["end"],
                    "rule_id": "R6",
                    "rule_text": "At most one exclamation mark per copy.",
                    "evidence": {
                        "source": "Brand Voice Guidelines",
                        "text": "Maximum one exclamation mark per communication."
                    },
                    "explanation": "Content exceeds the brand limit of 1 exclamation mark.",
                    "suggested_replacement": ".",
                    "rationale": "Use a period instead of an additional exclamation mark.",
                    "verdict": VERDICT_RULE_VIOLATION,
                    "confidence": 1.0,
                    "layer": "rules",
                    "status": "open"
                })

        # 1.5 Competitor Naming (R4)
        competitors = self.brand.get("competitors", ["Coursera", "Udemy", "Byjus", "Unacademy", "edX", "Khan Academy"])
        for comp in competitors:
            pat = r"\b" + escape_regex(comp) + r"\b"
            for m in find_all_matches(pat, content):
                findings.append({
                    "id": f"R4-COMPETITOR:{m['start']}-{m['end']}",
                    "category": "Messaging",
                    "severity": "high",
                    "title": f"Competitor named: \"{m['quote']}\"",
                    "quote": m["quote"],
                    "start_offset": m["start"],
                    "end_offset": m["end"],
                    "rule_id": "R4",
                    "rule_text": "No competitor naming without prior legal and marketing approval.",
                    "evidence": {
                        "source": "Compliance & Legal Guidelines",
                        "text": "Directly naming competitors in public-facing marketing requires explicit legal clearance."
                    },
                    "explanation": f"Competitor '{m['quote']}' is named. Compare against category benchmarks rather than named competitors.",
                    "suggested_replacement": "other learning platforms",
                    "rationale": "Replace specific competitor name with general category reference.",
                    "verdict": VERDICT_RULE_VIOLATION,
                    "confidence": 1.0,
                    "layer": "rules",
                    "status": "open"
                })

        # 1.6 Required Elements (R5)
        # Ads must include "Terms apply."
        # Emails must include an unsubscribe line: "To stop receiving these emails, click unsubscribe." or "unsubscribe"
        if content_type in ["ad", "advertisement"]:
            if not re.search(r"terms\s+apply\.?", content, re.IGNORECASE):
                findings.append({
                    "id": "R5-REQ-AD-TERMS",
                    "category": "Messaging",
                    "severity": "medium",
                    "title": "Missing required disclaimer: \"Terms apply.\"",
                    "quote": content[-30:] if len(content) > 30 else content,
                    "start_offset": len(content),
                    "end_offset": len(content),
                    "rule_id": "R5",
                    "rule_text": "All advertisement copy must include the disclaimer 'Terms apply.'",
                    "evidence": {
                        "source": "Legal & Advertising Compliance",
                        "text": "Mandatory disclosure: Advertising copy must conclude with 'Terms apply.'"
                    },
                    "explanation": "Promotional advertising copy is legally required to carry the standard terms disclosure.",
                    "suggested_replacement": content.rstrip() + "\n\nTerms apply.",
                    "rationale": "Append the mandatory legal disclaimer.",
                    "verdict": VERDICT_RULE_VIOLATION,
                    "confidence": 1.0,
                    "layer": "rules",
                    "status": "open"
                })
        elif content_type in ["email", "marketing email"]:
            if not re.search(r"unsubscribe", content, re.IGNORECASE):
                findings.append({
                    "id": "R5-REQ-EMAIL-UNSUB",
                    "category": "Messaging",
                    "severity": "medium",
                    "title": "Missing required email unsubscribe line",
                    "quote": content[-30:] if len(content) > 30 else content,
                    "start_offset": len(content),
                    "end_offset": len(content),
                    "rule_id": "R5",
                    "rule_text": "Marketing emails must include an unsubscribe notice.",
                    "evidence": {
                        "source": "Email Governance & Anti-Spam Policy",
                        "text": "All commercial emails must provide a visible, working opt-out link: 'To stop receiving these emails, click unsubscribe.'"
                    },
                    "explanation": "Marketing emails require an unsubscribe option to comply with CAN-SPAM and privacy regulations.",
                    "suggested_replacement": content.rstrip() + "\n\nTo stop receiving these emails, click unsubscribe.",
                    "rationale": "Append the required compliant unsubscribe footer.",
                    "verdict": VERDICT_RULE_VIOLATION,
                    "confidence": 1.0,
                    "layer": "rules",
                    "status": "open"
                })

        # 1.7 Accessibility: Long Sentences & Vague Links & Alt Text
        sents = split_sentences(content)
        for s in sents:
            words = s["text"].split()
            if len(words) > 25:
                findings.append({
                    "id": f"A11Y-LEN:{s['start']}-{s['end']}",
                    "category": "Accessibility",
                    "severity": "low",
                    "title": f"Sentence has {len(words)} words (limit 25)",
                    "quote": s["text"],
                    "start_offset": s["start"],
                    "end_offset": s["end"],
                    "rule_id": "A11Y-01",
                    "rule_text": "Sentences should not exceed 25 words to ensure high readability and cognitive accessibility.",
                    "evidence": {
                        "source": "WCAG 2.1 & Readability Guidelines",
                        "text": "Keep sentences under 25 words for clear comprehension by neurodivergent readers and assistive tech."
                    },
                    "explanation": f"Sentence has {len(words)} words. Long compound sentences increase cognitive load.",
                    "suggested_replacement": None,
                    "rationale": "Split the long sentence into two shorter, direct sentences.",
                    "verdict": VERDICT_RULE_VIOLATION,
                    "confidence": 1.0,
                    "layer": "rules",
                    "status": "open"
                })

        vague_links = [
            ("click here", "view details"),
            ("read more", "read the full guide"),
            ("this link", "the documentation"),
            ("here", "the overview")
        ]
        for vl, fix in vague_links:
            pat = r"\b" + escape_regex(vl) + r"\b"
            for m in find_all_matches(pat, content):
                findings.append({
                    "id": f"A11Y-LINK:{m['start']}-{m['end']}",
                    "category": "Accessibility",
                    "severity": "medium",
                    "title": f"Vague link text: \"{m['quote']}\"",
                    "quote": m["quote"],
                    "start_offset": m["start"],
                    "end_offset": m["end"],
                    "rule_id": "A11Y-02",
                    "rule_text": "Link text must clearly describe the destination out of context (WCAG AA).",
                    "evidence": {
                        "source": "WCAG 2.1 Guideline 2.4.4 Link Purpose",
                        "text": "Link text must be descriptive so screen-reader users browsing links in a list understand where it leads."
                    },
                    "explanation": f"'{m['quote']}' provides no context about the link target for screen-reader users.",
                    "suggested_replacement": match_case(fix, m["quote"]),
                    "rationale": f"Replace generic link with descriptive text '{fix}'.",
                    "verdict": VERDICT_RULE_VIOLATION,
                    "confidence": 1.0,
                    "layer": "rules",
                    "status": "open"
                })

        # Alt text check
        if image_meta and not alt_text:
            findings.append({
                "id": "A11Y-NO-ALT",
                "category": "Accessibility",
                "severity": "medium",
                "title": "Missing image alt text",
                "quote": image_meta.get("filename", "Uploaded Image"),
                "start_offset": None,
                "end_offset": None,
                "rule_id": "R7",
                "rule_text": "All images must include descriptive alt text for accessibility (WCAG AA).",
                "evidence": {
                    "source": "WCAG 2.1 Guideline 1.1.1 Non-text Content",
                    "text": "All non-text content presented to the user has a text alternative that serves the equivalent purpose."
                },
                "explanation": "The uploaded visual asset lacks an alt text description.",
                "suggested_replacement": None,
                "rationale": "Add a concise, informative text description of the image.",
                "verdict": VERDICT_RULE_VIOLATION,
                "confidence": 1.0,
                "layer": "rules",
                "status": "open"
            })

        # Contrast check if fg/bg colors provided
        if fg_color and bg_color:
            cr = contrast_ratio(fg_color, bg_color)
            if cr is not None and cr < 4.5:
                findings.append({
                    "id": "A11Y-CONTRAST",
                    "category": "Accessibility",
                    "severity": "medium",
                    "title": f"Low colour contrast: {cr:.1f}:1 (WCAG AA requires 4.5:1)",
                    "quote": f"Foreground {fg_color} on background {bg_color}",
                    "start_offset": None,
                    "end_offset": None,
                    "rule_id": "R7",
                    "rule_text": "Text contrast ratio must meet WCAG AA standard of 4.5:1 minimum.",
                    "evidence": {
                        "source": "WCAG 2.1 Guideline 1.4.3 Contrast (Minimum)",
                        "text": "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1."
                    },
                    "explanation": f"The contrast ratio of {cr:.1f}:1 fails the required 4.5:1 threshold for normal text readability.",
                    "suggested_replacement": "#0A1128",
                    "rationale": "Use higher contrast approved palette color such as Midnight Navy (#0A1128).",
                    "verdict": VERDICT_RULE_VIOLATION,
                    "confidence": 1.0,
                    "layer": "rules",
                    "status": "open"
                })

        # Visual Palette & Resolution check if image metadata provided
        if image_meta:
            dominant_colors = image_meta.get("colors", [])
            for c in dominant_colors:
                c_hex = c.get("hex")
                share = c.get("share", 0.0)
                if share >= 0.10 and not is_neutral_color(c_hex):
                    # Check distance against approved palette
                    min_dist = 999.0
                    closest_palette = None
                    for p in self.palette:
                        d = delta_e(c_hex, p.get("hex", "#000000"))
                        if d < min_dist:
                            min_dist = d
                            closest_palette = p
                    if min_dist > 30.0:
                        findings.append({
                            "id": f"VIS-PALETTE:{c_hex}",
                            "category": "Visual",
                            "severity": "medium",
                            "title": f"Colour {c_hex} ({int(share*100)}% of image) outside brand palette",
                            "quote": c_hex,
                            "start_offset": None,
                            "end_offset": None,
                            "rule_id": "VIS-01",
                            "rule_text": "Dominant image colours must align with the approved brand palette (CIE ΔE <= 30).",
                            "evidence": {
                                "source": "Brand Visual Identity Guidelines",
                                "text": f"Approved colours: {', '.join(p.get('name', '') + ' (' + p.get('hex', '') + ')' for p in self.palette)}."
                            },
                            "explanation": f"Colour {c_hex} has ΔE={min_dist:.1f} from the nearest brand colour ({closest_palette.get('name') if closest_palette else 'None'}).",
                            "suggested_replacement": closest_palette.get("hex") if closest_palette else None,
                            "rationale": f"Adjust artwork palette towards approved brand shade '{closest_palette.get('name') if closest_palette else 'Primary'}'.",
                            "verdict": VERDICT_RULE_VIOLATION,
                            "confidence": 0.9,
                            "layer": "rules",
                            "status": "open"
                        })

        # 1.8 Custom Saved Brand Rules
        builtin_codes = {"R1", "R2", "R3", "R4", "R5", "R6", "R7", "A11Y-01", "A11Y-CONTRAST", "VIS-01", "SEC-01", "TERM-01"}
        for cr in self.rules:
            c_code = cr.get("code")
            if not c_code or c_code in builtin_codes:
                continue
            
            c_type = cr.get("rule_type", "phrase")
            c_pat = cr.get("pattern") or cr.get("avoid_term")
            if not c_pat:
                continue

            matches = []
            if c_type in ["phrase", "competitor", "claim_policy"]:
                pat_regex = r"(?<!\w)" + escape_regex(c_pat) + r"(?!\w)"
                matches = find_all_matches(pat_regex, content)
            elif c_type == "regex":
                matches = find_all_matches(c_pat, content)
            elif c_type == "term_map":
                pat_regex = r"(?<!\w)" + escape_regex(c_pat) + r"(?!\w)"
                matches = find_all_matches(pat_regex, content)

            for cm in matches:
                findings.append({
                    "id": f"{c_code}:{cm['start']}-{cm['end']}",
                    "category": cr.get("category", "Messaging"),
                    "severity": cr.get("severity", "medium"),
                    "title": cr.get("title", f"Rule violation: {c_code}"),
                    "quote": cm["quote"],
                    "start_offset": cm["start"],
                    "end_offset": cm["end"],
                    "rule_id": c_code,
                    "rule_text": cr.get("description", "Brand guideline policy requirement."),
                    "evidence": {
                        "source": cr.get("source_ref", "Brand Guidelines"),
                        "text": cr.get("source_excerpt") or cr.get("description", "Configured brand rule.")
                    },
                    "explanation": cr.get("description", f"Violates brand rule {c_code}."),
                    "suggested_replacement": cr.get("prefer_term"),
                    "rationale": f"Replace with approved alternative: {cr.get('prefer_term')}" if cr.get("prefer_term") else "Remove non-compliant phrase.",
                    "verdict": VERDICT_RULE_VIOLATION,
                    "confidence": 1.0,
                    "layer": "rules",
                    "status": "open"
                })

        # -------------------------------------------------------------
        # Layer 2: Retrieval-Grounded Analysis (Claims & Facts)
        # Checks sentences against approved facts and guideline passages.
        # Strict Rule: If nothing relevant clears threshold, evidence MUST be:
        # "No approved supporting evidence found."
        # -------------------------------------------------------------
        claim_signals = [
            r"\b24\s?/\s?7\b",
            r"\d+(?:\.\d+)?\s?%",
            r"\b\d+x\b",
            r"(?:₹|rs\.?\s?|inr\s?|\$)\s?\d+",
            r"\b\d+[\d,]*\s*(?:users|learners|students|teachers|schools|classes|hours|minutes|seconds)\b"
        ]
        
        superlative_patterns = [
            r"\b(the\s+)?best\b(?:\s+[\w\s]{1,30})?",
            r"\bnumber\s+one\b",
            r"\bno\.?\s?1\b",
            r"\b#1\b",
            r"\bfastest\b",
            r"\bleading\b",
            r"\bmost\s+(trusted|secure|reliable|effective|popular)\b",
            r"\bunmatched\b",
            r"\bworld[\s-]class\b",
            r"\bunbeatable\b",
            r"\brevolutionary\b",
            r"\btop[\s-]rated\b"
        ]

        # Prepare tokens for facts and passages
        processed_facts = []
        for f in self.facts:
            st = f.get("statement", "")
            processed_facts.append({
                "raw": f,
                "statement": st,
                "tokens": set(tokenize(st)),
                "numbers": extract_numbers(st),
                "lower": st.lower()
            })

        for s in sents:
            st = s["text"]
            st_lower = st.lower()
            st_tokens = set(tokenize(st))
            st_numbers = extract_numbers(st)
            
            # Check for superlative phrases
            superlatives_found = []
            for sup_pat in superlative_patterns:
                for sm in find_all_matches(sup_pat, st):
                    # Check if already covered by an R2 match
                    if not any(r2["start"] <= (s["start"] + sm["start"]) and (s["start"] + sm["end"]) <= r2["end"] for r2 in r2_matches):
                        superlatives_found.append(sm)

            has_claim_signal = any(re.search(pat, st, re.IGNORECASE) for pat in claim_signals)
            
            if not superlatives_found and not has_claim_signal:
                # Check if sentence directly verifies an approved fact
                for pf in processed_facts:
                    overlap = len(st_tokens & pf["tokens"])
                    if len(pf["tokens"]) > 0 and (overlap / len(pf["tokens"])) >= 0.70:
                        verified_checks.append({
                            "sentence": st,
                            "fact_id": pf["raw"].get("code", "FACT"),
                            "statement": pf["statement"],
                            "source": pf["raw"].get("source", "Approved Fact")
                        })
                continue

            # Sentence contains claims or superlatives; retrieve closest fact
            best_match = None
            best_score = 0.0
            for pf in processed_facts:
                shared = len(st_tokens & pf["tokens"])
                if pf["tokens"]:
                    score = shared / max(len(pf["tokens"]), len(st_tokens), 1)
                    if score > best_score:
                        best_score = score
                        best_match = pf

            # 2.1 Handle Unsupported Superlatives (R3)
            # Example: "the best learning platform in India" or "We are number one."
            for sup_match in superlatives_found:
                sup_quote = sup_match["quote"]
                sup_start = s["start"] + sup_match["start"]
                sup_end = s["start"] + sup_match["end"]
                
                # Check if an approved fact explicitly validates this superlative
                fact_validates_sup = (
                    best_match is not None and
                    best_score >= 0.60 and
                    sup_quote.lower() in best_match["lower"]
                )

                if not fact_validates_sup:
                    # R3 violation: Unsupported promotional claim
                    soft_val = SOFTEN_MAP.get(sup_quote.lower(), "")
                    correction = f"Remove the superlative or provide approved evidence."
                    if soft_val:
                        correction = f"Replace '{sup_quote}' with '{soft_val}', or remove the superlative and cite approved evidence."
                    
                    findings.append({
                        "id": f"R3-SUPERLATIVE:{sup_start}-{sup_end}",
                        "category": "Claims",
                        "severity": "high",
                        "title": f"Unsupported promotional claim: \"{sup_quote}\"",
                        "quote": sup_quote,
                        "start_offset": sup_start,
                        "end_offset": sup_end,
                        "rule_id": "R3",
                        "rule_text": "Unsupported superlatives and comparatives need approved evidence before publication.",
                        "evidence": {
                            "text": NO_EVIDENCE_TEXT,
                            "status": "unsupported"
                        },
                        "explanation": f"The superlative claim '{sup_quote}' asserts market leadership or superior outcome without verified substantiation in the brand fact database.",
                        "suggested_replacement": soft_val if soft_val else None,
                        "rationale": "Remove the superlative or provide approved evidence.",
                        "verdict": VERDICT_SOURCE_BACKED,
                        "confidence": 0.95,
                        "layer": "retrieval",
                        "status": "open"
                    })

            # 2.2 Handle Figures / Factual Claims
            if has_claim_signal:
                # Check specific unverifiable patterns like "24/7"
                if re.search(r"\b24\s?/\s?7\b", st, re.IGNORECASE):
                    # Check if 24/7 is in any approved fact
                    fact_has_247 = any("24/7" in pf["statement"] or "24 hours" in pf["statement"] for pf in processed_facts)
                    if not fact_has_247:
                        m247 = re.search(r"\b24\s?/\s?7\b", st, re.IGNORECASE)
                        offset_start = s["start"] + m247.start() if m247 else s["start"]
                        offset_end = s["start"] + m247.end() if m247 else s["end"]
                        findings.append({
                            "id": f"FACT-UNVERIFIED-247:{offset_start}-{offset_end}",
                            "category": "Claims",
                            "severity": "high",
                            "title": "Unverifiable availability claim: \"24/7\"",
                            "quote": m247.group(0) if m247 else "24/7",
                            "start_offset": offset_start,
                            "end_offset": offset_end,
                            "rule_id": "R3",
                            "rule_text": "All service availability and operational figures require verified supporting evidence.",
                            "evidence": {
                                "text": NO_EVIDENCE_TEXT,
                                "status": "unsupported"
                            },
                            "explanation": "Claiming 24/7 support or classes requires SLA verification in the approved fact base.",
                            "suggested_replacement": "round-the-clock recorded access",
                            "rationale": "Clarify that recorded content is available anytime, or cite verified support SLA.",
                            "verdict": VERDICT_SOURCE_BACKED,
                            "confidence": 0.95,
                            "layer": "retrieval",
                            "status": "open"
                        })

                # Check if figures conflict with an approved fact on the same topic
                if best_match and best_score >= 0.40:
                    extra_nums = [n for n in st_numbers if n not in best_match["numbers"]]
                    if extra_nums and best_match["numbers"]:
                        # Topic matches but numbers conflict!
                        findings.append({
                            "id": f"FACT-CONFLICT:{s['start']}-{s['end']}",
                            "category": "Facts",
                            "severity": "high",
                            "title": f"Figure conflicts with approved fact {best_match['raw'].get('code', 'F-01')}",
                            "quote": s["text"],
                            "start_offset": s["start"],
                            "end_offset": s["end"],
                            "rule_id": "FACT-01",
                            "rule_text": "Factual figures must strictly align with the approved fact database.",
                            "evidence": {
                                "fact_id": best_match["raw"].get("code"),
                                "source": best_match["raw"].get("source"),
                                "text": best_match["statement"]
                            },
                            "explanation": f"Sentence states '{st}' with figure(s) {extra_nums}, whereas approved fact {best_match['raw'].get('code')} states: '{best_match['statement']}'.",
                            "suggested_replacement": best_match["statement"],
                            "rationale": "Use approved fact wording to preserve factual accuracy.",
                            "verdict": VERDICT_SOURCE_BACKED,
                            "confidence": 0.90,
                            "layer": "retrieval",
                            "status": "open"
                        })
                    elif not extra_nums and not superlatives_found:
                        # Matches approved fact!
                        verified_checks.append({
                            "sentence": st,
                            "fact_id": best_match["raw"].get("code", "F-01"),
                            "statement": best_match["statement"],
                            "source": best_match["raw"].get("source", "Approved Fact")
                        })
                elif not re.search(r"\b24\s?/\s?7\b", st, re.IGNORECASE) and not any(r2["start"] <= s["start"] and s["end"] <= r2["end"] for r2 in r2_matches):
                    # Factual figure present but no fact found at all
                    findings.append({
                        "id": f"FACT-UNSUPPORTED:{s['start']}-{s['end']}",
                        "category": "Claims",
                        "severity": "high",
                        "title": "Unsupported quantitative claim",
                        "quote": s["text"],
                        "start_offset": s["start"],
                        "end_offset": s["end"],
                        "rule_id": "FACT-02",
                        "rule_text": "All quantitative claims and performance metrics require approved evidence.",
                        "evidence": {
                            "text": NO_EVIDENCE_TEXT,
                            "status": "unsupported"
                        },
                        "explanation": f"No verified fact supports the quantitative assertion in '{s['text']}'.",
                        "suggested_replacement": None,
                        "rationale": "Remove the unproven figure or submit verified documentation to Brand Knowledge Hub.",
                        "verdict": VERDICT_NEEDS_REVIEW,
                        "confidence": 0.85,
                        "layer": "retrieval",
                        "status": "open"
                    })

        # 2.3 Unapproved Price Point Check
        price_matches = find_all_matches(r"(?:₹|rs\.?\s?|inr\s?|\$)\s?\d+", content)
        for pm in price_matches:
            if not any(pm["quote"].lower() in pf["lower"] for pf in processed_facts):
                findings.append({
                    "id": f"FACT-PRICE:{pm['start']}-{pm['end']}",
                    "category": "Facts",
                    "severity": "high",
                    "title": f"Unapproved price point claim: \"{pm['quote']}\"",
                    "quote": pm["quote"],
                    "start_offset": pm["start"],
                    "end_offset": pm["end"],
                    "rule_id": "FACT-01",
                    "rule_text": "All published subscription fees and pricing figures must be verified in the approved fact base.",
                    "evidence": {
                        "source": "Approved Pricing Schedule",
                        "text": "No approved pricing entry verifies this rate. Price claims require formal finance sign-off."
                    },
                    "explanation": f"The price claim '{pm['quote']}' is not in the approved fact base.",
                    "suggested_replacement": None,
                    "rationale": "Verify pricing with finance or cite approved tier from brand documentation.",
                    "verdict": VERDICT_NEEDS_REVIEW,
                    "confidence": 0.95,
                    "layer": "retrieval",
                    "status": "open"
                })

        # 2.4 Outdated Temporal Reference Check
        year_matches = find_all_matches(r"\b(202[0-4])\b", content)
        for ym in year_matches:
            findings.append({
                "id": f"FACT-YEAR:{ym['start']}-{ym['end']}",
                "category": "Facts",
                "severity": "high",
                "title": f"Outdated temporal reference: \"{ym['quote']}\"",
                "quote": ym["quote"],
                "start_offset": ym["start"],
                "end_offset": ym["end"],
                "rule_id": "FACT-02",
                "rule_text": "Forward-looking copy must reference current academic and operational cycles.",
                "evidence": {
                    "source": "Academic Operations Calendar",
                    "text": "Reference to past cycle requires factual update to current academic year."
                },
                "explanation": f"The year '{ym['quote']}' refers to a past academic cycle. Current communications must reference active cycles.",
                "suggested_replacement": "2026",
                "rationale": "Update past cycle year to current operational year.",
                "verdict": VERDICT_NEEDS_REVIEW,
                "confidence": 0.95,
                "layer": "retrieval",
                "status": "open"
            })

        # 2.5 Misleading Low-Effort / Outcome Guarantee Claim Check
        effort_matches = find_all_matches(r"\b(without\s+trying|zero\s+effort|learn\s+overnight|master\s+courses\s+without\s+trying)\b", content)
        for em in effort_matches:
            findings.append({
                "id": f"TONE-EFFORT:{em['start']}-{em['end']}",
                "category": "Messaging",
                "severity": "high",
                "title": f"Misleading low-effort claim: \"{em['quote']}\"",
                "quote": em["quote"],
                "start_offset": em["start"],
                "end_offset": em["end"],
                "rule_id": "R3",
                "rule_text": "Educational messaging must set realistic expectations; avoid claiming learners master skills without effort.",
                "evidence": {
                    "source": "Brand Voice Guidelines",
                    "text": "Guidelines prohibit marketing copy that promises educational outcomes 'without trying' or with zero effort."
                },
                "explanation": f"The claim '{em['quote']}' asserts low-effort mastery, diminishing educational credibility.",
                "suggested_replacement": "with structured guidance",
                "rationale": "Replace low-effort claim with supportive educational messaging.",
                "verdict": VERDICT_RULE_VIOLATION,
                "confidence": 0.95,
                "layer": "rules",
                "status": "open"
            })

        # -------------------------------------------------------------
        # Layer 3: AI Contextual Analysis (Optional, Validated)
        # -------------------------------------------------------------
        if llm_findings and isinstance(llm_findings, list):
            layers_status["ai"] = "ok"
            valid_rule_ids = set([r.get("code") for r in self.rules] + ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "FACT-01", "FACT-02", "TERM-01"])
            valid_passage_ids = set([p.get("id") for p in self.passages])
            
            for item in llm_findings:
                quote = item.get("quote", "")
                # Rule: Quote must be verbatim substring of content
                if not quote or quote not in content:
                    continue
                
                # Rule: AI can never create a Verified rule violation by itself; must be Needs human review
                verdict = VERDICT_NEEDS_REVIEW
                start_idx = content.find(quote)
                end_idx = start_idx + len(quote)
                
                rule_id = item.get("rule_id")
                if rule_id and rule_id not in valid_rule_ids:
                    rule_id = None
                    
                passage_id = item.get("passage_id")
                evidence_dict = {}
                if passage_id and passage_id in valid_passage_ids:
                    evidence_dict = {"passage_id": passage_id, "text": "Retrieved from guideline passage"}
                else:
                    evidence_dict = {"text": NO_EVIDENCE_TEXT}
                    
                findings.append({
                    "id": f"AI-{start_idx}-{end_idx}",
                    "category": item.get("category", "Tone"),
                    "severity": item.get("severity", "medium"),
                    "title": f"AI Contextual Concern: {item.get('title', 'Advisory notice')}",
                    "quote": quote,
                    "start_offset": start_idx,
                    "end_offset": end_idx,
                    "rule_id": rule_id,
                    "rule_text": item.get("rule_text", "AI contextual guidance"),
                    "evidence": evidence_dict,
                    "explanation": item.get("explanation", "AI advisory flag based on contextual nuance."),
                    "suggested_replacement": item.get("suggested_replacement"),
                    "rationale": item.get("rationale", "Suggested contextual improvement."),
                    "verdict": verdict,
                    "confidence": float(item.get("confidence", 0.75)),
                    "layer": "ai",
                    "status": "open"
                })

        # Sort findings by severity (high -> medium -> low) then position
        findings.sort(key=lambda f: (
            SEVERITY_ORDER.get(f.get("severity", "low"), 2),
            f.get("start_offset") if f.get("start_offset") is not None else 999999
        ))
        
        # Deduplicate findings with identical id
        unique_findings = []
        seen_ids = set()
        for f in findings:
            if f["id"] not in seen_ids:
                seen_ids.add(f["id"])
                unique_findings.append(f)

        flesch_score = calculate_flesch_reading_ease(content)
        words_count = len(re.findall(r"[A-Za-z']+", content))

        return {
            "findings": unique_findings,
            "verified_checks": verified_checks,
            "layers": layers_status,
            "stats": {
                "word_count": words_count,
                "reading_ease": round(flesch_score, 1),
                "total_findings": len(unique_findings),
                "high_severity": sum(1 for f in unique_findings if f["severity"] == "high"),
                "medium_severity": sum(1 for f in unique_findings if f["severity"] == "medium"),
                "low_severity": sum(1 for f in unique_findings if f["severity"] == "low")
            }
        }
