# CHANGELOG

All notable changes to VERITY are documented in this file.

## [1.0.0] - 2026-11-13 (Round 2 Build Release)

### Added
- **3-Layer Review Engine:**
  - Layer 1: Deterministic rules (R1 brand casing, R2 absolute outcome claim variants, R4 competitor naming, R5 required elements, R6 tone & exclamations, R7 WCAG contrast & alt text).
  - Layer 2: Retrieval-grounded analysis against approved facts (F-01, F-02, F-03) and guidelines.
  - Layer 3: Contextual AI review with strict server-side validation and graceful fallback.
- **The Three Round 1 Named Improvements:**
  - 1. Evidence-Backed Detection: every finding cites an approved fact or explicitly states: "No approved supporting evidence found."
  - 2. Intent-Preserving Corrections: side-by-side word diff where original copy is never overwritten.
  - 3. Adaptive Governance Insights: identifies rules with high challenge or dismiss rates ("Rules That May Be Unclear").
- **Security & Integrity:**
  - Prompt-injection text detector: adversarial prompts treated strictly as inert data.
  - Cryptographic version-bound approvals with SHA-256 hash enforcement.
  - Strict workflow state machine (Draft → Submitted → In Review → Changes Requested → Resubmitted → Approved / Rejected).
- **Multi-Format Document Parsing:**
  - PyMuPDF integration for PDF text extraction.
  - python-docx integration for Microsoft Word DOCX parsing.
- **Rich User Interface:**
  - Landing page with animated signature live-review simulation card.
  - Interactive Brand Knowledge Hub for facts, guidelines, terminology, and visual swatches.
  - New Review submission flow with instant Sample A–D loaders.
  - Governance telemetry dashboard with Recharts visualizations.
  - Trust and Roadmap pages.
- **Evaluation & Deployment:**
  - 30-sample labelled evaluation benchmark suite with automated metrics generation.
  - Docker multi-stage containerization and Docker Compose setup.
