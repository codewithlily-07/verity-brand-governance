# VERITY: Testing Notes & Quality Audit

This document records the automated and manual testing procedures executed for VERITY Round 3.

---

## 1. Automated Test Suite (Pytest)

The backend test suite contains **27 automated tests** covering core workflow endpoints, edge cases, authentication, claim ledgers, and audit CSV exports:

```bash
pytest backend/tests
```

### Test Breakdown by File:
- `backend/tests/test_api.py` (8 tests):
  - Session initialization & demo seeding
  - Brand profile retrieval
  - Fact & rule creation
  - Document ingestion (.pdf / .docx)
  - Submission creation & deterministic Layer 1 violation detection
  - Version creation & diff calculation
  - Finding status transition (accepted, dismissed, challenged)
  - PDF report generation
- `backend/tests/test_api_v2.py` (1 test):
  - Evaluation benchmark logic and accuracy metrics
- `backend/tests/test_audit_csv.py` (2 tests):
  - Single submission audit CSV export (`GET /api/submissions/{id}/audit.csv`)
  - Workspace-wide audit CSV export (`GET /api/audit/export.csv`)
- `backend/tests/test_auth.py` (2 tests):
  - User registration & JWT generation
  - Protected route access & persona role switching
- `backend/tests/test_claim_ledger.py` (3 tests):
  - Extraction and grounding of claims in Claim Evidence Ledger
  - Review approval blocking when unsupported claims exist without override
  - Successful approval when override reason is recorded
- `backend/tests/test_engine.py` (6 tests):
  - Deterministic regex rule engine (R1–R7)
  - Syllable counting & Flesch Reading Ease
  - CIE ΔE color distance and contrast ratio calculations
  - Word-level intent diffing
- `backend/tests/test_enterprise_suite.py` (1 test):
  - Complete enterprise end-to-end lifecycle (org, rules, submission, v2 diff, review, pdf, audit)
- `backend/tests/test_frontend_serve.py` (1 test):
  - Static SPA serving & HTML fallback for client-side routing
- `backend/tests/test_persistence.py` (3 tests):
  - Readiness endpoint (`/api/ready`) database ping
  - Alembic migration version tracking
  - Binary blob persistence in database tables

**Result:** 27 passed, 0 failed.

---

## 2. Automated Axe-Core Accessibility Audit

The color contrast audit script (`scripts/check_contrast.py`) drives a headless Chrome browser across all 16 marketing, application, and authentication routes at `1366x768` resolution:

```bash
python scripts/check_contrast.py
```

### Audit Results:
| Route | Page Name | Elements Checked | Violations | Status |
| :--- | :--- | :---: | :---: | :--- |
| `/` | Landing Page | 40 | 0 | PASS (0 failures) |
| `/product` | Product Page | 111 | 0 | PASS (0 failures) |
| `/how-it-works` | How It Works | 61 | 0 | PASS (0 failures) |
| `/trust-security` | Trust & Security | 186 | 0 | PASS (0 failures) |
| `/resources` | Resources | 66 | 0 | PASS (0 failures) |
| `/quality` | Quality & Engine | 128 | 0 | PASS (0 failures) |
| `/dashboard` | App Dashboard | 70 | 0 | PASS (0 failures) |
| `/brand-hub` | Brand Hub | 47 | 0 | PASS (0 failures) |
| `/new-review` | New Review | 55 | 0 | PASS (0 failures) |
| `/review` | Review & Approval | 26 | 0 | PASS (0 failures) |
| `/insights` | Governance Insights | 37 | 0 | PASS (0 failures) |
| `/settings` | Settings | 40 | 0 | PASS (0 failures) |
| `/roadmap` | Roadmap | 41 | 0 | PASS (0 failures) |
| `/login` | Login Page | 43 | 0 | PASS (0 failures) |
| `/register` | Register Page | 49 | 0 | PASS (0 failures) |
| `/forgot-password` | Forgot Password | 36 | 0 | PASS (0 failures) |

**Total Contrast Violations:** 0 across all 16 routes.  
*(Note: As documented in our disclaimers, automated axe-core checks verify color contrast and DOM attributes on tested pages; human review of manual assistive keyboard navigation remains part of ongoing governance).*

---

## 3. Boundary & Error Handling Verification

1. **Double Actions:** Rapid double-clicking on "Run Brand Review", "Save as New Version", "Approve", and "Post Comment" was verified; stateful `useRef` locks prevent duplicate database records.
2. **Refresh & Deep-Linking:** Full page refresh on `/results?id=...` and `/review?id=...` tested; both gracefully reload submission data from database or fall back to recent drafts without hanging spinners or blank screens.
3. **Invalid Files:** Uploading renamed non-PDF files (.txt renamed to .pdf) triggers immediate 400 Bad Request with `"Invalid PDF file: Missing %PDF signature"`. Uploading non-ZIP .docx files triggers `"Missing PK ZIP archive signature"`.
4. **Oversized Text:** Pasting copy over 150,000 characters triggers client-side warning to upload as document.
5. **Stale Approvals (Concurrency):** Approving version 1 after version 2 has been created yields HTTP 409 and surfaces the resolution card to reload the latest copy.
