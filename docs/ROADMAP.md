# VERITY Product Roadmap

This document outlines the planned future milestones for VERITY following the Round 3 completion.

---

## Current Release: Round 3 (November 2026) — Complete & Verified

- [x] **Durable Cloud Persistence:** Supabase PostgreSQL integration, Alembic migrations, `/api/ready` probe, and relational binary blob storage.
- [x] **Claim Evidence Ledger:** Automated claim extraction, verification against approved facts, and approval blocking on ungrounded claims.
- [x] **Gold Refinement UI:** Non-destructive visual effect replacing all strike-through with amber glow, dissolution into gold dust, and letter condensation.
- [x] **Interactive Rule Tester:** Live testing sandbox on Brand Hub rule cards with real-time regex/pattern evaluation.
- [x] **Brand Kit Portability:** Clean JSON export and validated import with preview modals.
- [x] **Audit Trail CSV Exports:** Dedicated endpoints (`/api/submissions/{id}/audit.csv` & `/api/audit/export.csv`).
- [x] **Draft Safety & Autosave:** Debounced local persistence and `beforeunload` unsaved copy warnings.
- [x] **4-Step Guided Tour & Getting Started Milestones:** Onboarding guidance remembered per user.
- [x] **Concurrency 409 Conflict Handling:** Stale version approval rejection and recovery UI.
- [x] **Channel Quality Checklists:** Channel-specific guidelines for Social, Ad, Email, Press, Web, and Document.

---

## Near-Term Roadmap: Q1 2027

### 1. Multi-Language Governance
- Extension of Layer 1 deterministic rules to German, French, Spanish, and Japanese.
- Morphological lemmatization for non-English inflections.
- Multilingual approved fact statements and multilingual PDF compliance reports.

### 2. CMS & Marketing Integrations
- Direct publish plugins for WordPress, Contentful, and Webflow.
- Chrome Extension allowing creators to scan Google Docs and Notion drafts prior to export.
- Figma plugin inspecting text layers and color tokens against Brand Hub guidelines.

### 3. Advanced Vector RAG Pipelines
- Hybrid BM25 + dense embedding retrieval using `pgvector` HNSW indexes in Supabase.
- Automated document chunk hierarchy for lengthy corporate annual reports and legal disclaimers.

---

## Long-Term Roadmap: Q2–Q3 2027

### 1. Enterprise SSO & SAML 2.0
- Okta, Azure Active Directory, and Google Workspace SSO integration.
- SCIM directory synchronization for automated reviewer persona provisioning.

### 2. Automated Regulatory Compliance Frameworks
- Pre-packaged rule packs for FTC advertising guidelines, FDA health claim boundaries, and SEBI / SEC financial disclosure standards.
- Automated jurisdiction tagging (e.g. EU AI Act disclaimer requirements).

### 3. Real-Time Collaborative Canvas
- Multi-user simultaneous editing with presence avatars and cursor tracking on draft revisions.
