# VERITY Feature Catalog & Functional Matrix

This document provides a comprehensive inventory of all functional features available in VERITY as of Round 3.

---

## 1. Complete Feature List (Live & Deployed)

1. Three-layer brand governance engine combining deterministic policy rules, approved-source retrieval and optional contextual AI advisory.
2. Multi-format content intake supporting direct text, PDF, DOCX and TXT uploads with file-signature validation.
3. Channel-specific compliance checklists for social media, advertisements, emails, press releases, websites and institutional documents.
4. Brand Compliance Score (0–100) with letter-grade assessment and breakdowns for rules, facts, terminology, tone and visual standards.
5. Claim Evidence Ledger extracting factual assertions and classifying them as supported, conflicting or unsupported against approved corporate facts.
6. Evidence-linked findings displaying relevant approved facts or guideline passages, or explicitly identifying missing supporting evidence.
7. Server-enforced approval restrictions for unresolved high-severity unsupported claims, with documented reviewer override justification.
8. Intent-preserving word-level diff comparing original and revised content without overwriting the original submission.
9. Gold Refinement correction animation using amber and gold visual effects.
10. Apply All Safe Fixes preview with an eight-second reversible Undo option.
11. Submission version history with non-destructive restoration.
12. SHA-256 content fingerprinting binding reviewer decisions to specific submission versions.
13. Server-side role-based access control for Content Creator, Authorised Reviewer, Administrator and Owner.
14. Optimistic concurrency control detecting stale versions and returning HTTP 409 Conflict.
15. Threaded review comments associated with submission versions.
16. Notification bell with read/unread notification state and Mark All as Read functionality.
17. PDF compliance certificate generation with review findings and verification fingerprints.
18. Individual submission and workspace-wide CSV audit exports.
19. Brand Knowledge Hub for managing approved facts, guideline sources, deterministic rules, terminology and visual identity.
20. Interactive Brand Hub Rule Tester with live pattern matching.
21. Portable Brand Kit JSON export and schema-validated import.
22. Visual palette distance and WCAG contrast validation.
23. Draft autosave and browser-exit safeguards.
24. Four-step guided onboarding tour and dynamic Getting Started dashboard checklist.
25. Deep-link URL synchronization for submission IDs, search and status filters.
26. React error boundary with incident identification and network connectivity feedback.
27. Public Quality dashboard with a labelled evaluation runner.
28. Graceful fallback to deterministic rules and approved-source retrieval when external AI services are unavailable.

---

## 2. Functional Matrix by Persona

| Capability | Creator | Reviewer | Admin | Owner |
| :--- | :---: | :---: | :---: | :---: |
| Draft Ingestion (Text/File) | ✓ | ✓ | ✓ | ✓ |
| View 3-Layer Findings & Diff | ✓ | ✓ | ✓ | ✓ |
| Apply Safe Fixes & Undo | ✓ | ✓ | ✓ | ✓ |
| Save New Versions & Restore | ✓ | ✓ | ✓ | ✓ |
| Sign-Off / Approve Release | ✗ | ✓ | ✓ | ✓ |
| Request Changes / Reject | ✗ | ✓ | ✓ | ✓ |
| Compliance Override Justification | ✗ | ✓ | ✓ | ✓ |
| Configure Brand Rules & Facts | ✗ | ✗ | ✓ | ✓ |
| Export Audit CSV & PDF Reports | ✓ | ✓ | ✓ | ✓ |
| Run Quality Benchmark Runner | ✓ | ✓ | ✓ | ✓ |
