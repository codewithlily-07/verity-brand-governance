# KNOWN LIMITATIONS & HONEST DISCLOSURES

In accordance with Round 2 and Round 3 judging guidelines, this document provides an honest assessment of current technical boundaries and planned advancements.

---

### 1. Vector Search Enhancement vs Full-Text Default
- **Current Behavior:** VERITY implements a hybrid retrieval engine where PostgreSQL tsvector / SQLite tokenized search is the reliable default that always works without external configuration. Vector embeddings via `pgvector` are an optional enhancement when embedding providers are configured.
- **Limitation:** In the absence of an embedding API key, retrieval operates in deterministic keyword-token similarity mode, which is highly accurate on structured facts but does not perform multi-lingual semantic vector nearest-neighbor lookups.

### 2. Deep Visual Asset Raster Analysis
- **Current Behavior:** Image checks verify palette alignment via CIE ΔE mathematical distance against approved hex tokens, inspect resolution thresholds, and enforce WCAG contrast ratios and alt-text tags.
- **Limitation:** Advanced pixel-level logo distortion, vector path manipulation, and 3D rendering compliance verification are marked as future roadmap items and are not executed in this release.

### 3. Direct Publishing Integrations
- **Current Behavior:** Once approved, content enters the "Approved" state with an immutable SHA-256 hash snapshot, audit event, and exportable compliance review report.
- **Limitation:** Direct publication dispatch webhooks (e.g. pushing directly to Twitter/X, LinkedIn, WordPress, or Mailchimp APIs) are out of scope for the Round 2 MVP boundary and must be dispatched manually by authorized creators.

### 4. Cold-Start Latency on Serverless Containers
- **Current Behavior:** On free-tier container platforms (such as Render free tier), the container may spin down during prolonged inactivity. The first wake request can experience a 15–20 second delay.
- **Mitigation:** The frontend provides non-blocking status messaging ("Connecting to Verity Engine...") and does not crash or display broken states during server initialization.

### 5. Automated Accessibility Testing Scope
- **Current Behavior:** Automated axe-core audits verify 0 contrast violations across all 16 tested routes.
- **Limitation:** Automated tools evaluate machine-detectable rules (contrast ratios, image alt attributes, form labels). Full end-to-end screen reader compliance (NVDA, VoiceOver) and human cognitive accessibility are part of continuous human governance.


