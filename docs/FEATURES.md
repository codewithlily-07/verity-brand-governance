# VERITY Feature Catalog & Functional Matrix

This document provides a comprehensive inventory of all functional features available in VERITY as of Round 3.

---

## 1. Feature Breakdown by Functional Area

### A. Intake & Analysis Engine
- **Multi-Format Ingestion:** Paste raw text, or upload `.pdf`, `.docx`, or `.txt` files with automated file magic-byte validation and 10MB size limits.
- **Channel Template Checklists:** Dynamic quality hints tailored for Social, Ads, Emails, Press Releases, Websites, and Institutional Documents.
- **Three-Layer Evaluation Pipeline:**
  1. *Layer 1 (Deterministic Rules):* Always-on regex and normalization checking absolute guarantees (R1), unbacked superlatives (R2), informal greetings (R3), casing (R4), repeated punctuation (R5), and required elements (R6).
  2. *Layer 2 (Retrieval-Grounded Analysis):* Vector and full-text retrieval matching factual claims against approved fact statements.
  3. *Layer 3 (Validated Contextual AI):* Advisory contextual suggestions with strict JSON schema validation and graceful fallback when API keys are absent.
- **Brand Compliance Score:** Transparent weighted evaluation metric (0–100) and letter grade (A–F) detailing individual components (Rules, Facts, Terminology, Tone, Visual).

### B. Workspace & Correction Environment
- **Claim Evidence Ledger:** Dedicated view displaying each extracted claim, verdict (`supported`, `conflicting`, `unsupported`), and grounding citations.
- **Gold Refinement Effect:** Pure CSS/canvas animation transforming flagged text into verified wording through gold dust dissolution and letter condensation.
- **Side-by-Side Intent Diff:** Real-time word-level diff viewer highlighting original vs revised draft.
- **Apply All Safe Fixes:** Single-click preview modal applying all verified rule and terminology corrections, accompanied by an instant 8-second Undo toast.
- **Draft Autosave & Protection:** Debounced local persistence and `beforeunload` unsaved copy warnings.
- **Version Restoration:** Restore any historical version as a new revision without overwriting immutable prior records.

### C. Reviewer Sign-off & Audit Governance
- **Role-Based Permission Enforcement:** Creator, Reviewer, Admin, and Owner separation with server-side validation.
- **Cryptographic SHA-256 Stamping:** Every version is hashed upon creation; approvals bind strictly to the exact hash evaluated.
- **Concurrency Conflict Handling (409):** Detects when reviews are attempted on stale drafts and prompts the reviewer to reload the latest copy.
- **Compliance Override Ledger:** Approving with open high-severity findings or ungrounded claims requires recording an explicit audit explanation.
- **Executive PDF Report Export:** Generates official compliance certification via ReportLab including hash snapshots, finding breakdowns, and audit decisions.
- **CSV Audit Exports:** Instant download of submission-level and workspace-level audit event streams.

### D. Brand Knowledge Hub
- **Approved Fact Repository:** Manage institutional claims (code, statement, source documentation) used for Layer 2 grounding.
- **Deterministic Rules Management:** View active rules, citations, and violation telemetry.
- **Interactive Rule Tester:** Test any rule live with sample copy and match quote highlighting.
- **Terminology Glossary:** Word replacement mappings (avoid vs prefer) enforcing corporate vocabulary.
- **Visual Identity Palette:** Approved brand hex codes with CIE ΔE color distance and WCAG AA contrast validation.
- **Brand Kit JSON Portability:** One-click export and schema-validated import of complete brand configurations.

### E. Navigation, Onboarding & Reliability
- **Getting Started Milestones:** Dashboard progress tracker for essential onboarding tasks.
- **4-Step Guided First-Use Tour:** Skippable modal introducing the core platform concepts.
- **Deep-Link URL Sync:** Query parameters (`?id=`, `?search=`, `?status=`) preserve UI state across refreshes and tab openings.
- **React Error Boundary & Offline Banner:** Graceful error handling and network status monitoring.
