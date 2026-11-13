# VERITY Architectural & Technical Decisions (ADRs)

**Product:** VERITY — Intelligent Brand Governance Platform  
**Team:** COGNEXA • WCC Forge 48 (Inkloom AI Problem Statement)  
**Status:** Accepted & Implemented (Round 2 Build Pack)

---

## Overview

This document records the foundational architecture and engineering decisions made during the design and implementation of VERITY. Each decision explains the context, alternatives evaluated, rationale, and consequences for production reliability and judge evaluation.

---

## Decision 1: Single-Process Unified Service Architecture

### Context
Pre-publication governance requires tight coupling between document parsing, rule execution, AI analysis, and reactive UI feedback. Deploying the frontend (React Vite SPA) and backend (FastAPI) as independent microservices or on separate free-tier hosts (e.g., Vercel + Render) typically introduces:
- Cross-Origin Resource Sharing (CORS) preflight latencies and origin misconfigurations.
- Asynchronous cold starts where the frontend loads but API requests fail for 30–60 seconds.
- Multi-step local setup for hackathon judges (e.g., launching frontend and backend on separate ports).

### Decision
Build the production React application (`npm run build` → `frontend/dist`) and serve both the REST API (`/api/*`), interactive OpenAPI documentation (`/docs`), and the static Single Page Application directly through FastAPI using `StaticFiles` and a SPA fallback router on port `8000`.

### Consequences
- **Positive:** Judges open a single link (`http://127.0.0.1:8000`) with zero CORS overhead and instant availability.
- **Positive:** Deployment to Docker, Render, or Railway requires only a single container without multi-host coordination.
- **Trade-off:** Frontend rebuild required when modifying UI source code before production packaging.

---

## Decision 2: Zero-Dependency Local SQLite Default with PostgreSQL + pgvector Schema

### Context
Hackathon evaluation requires instant local setup without prerequisite external services (PostgreSQL cluster, pgvector extensions, Docker daemon). However, enterprise production demands relational integrity, multi-tenancy, and vector similarity search.

### Decision
Architect the database layer using SQLAlchemy ORM with dual-engine compatibility:
1. **Local & Evaluation Default:** SQLite (`sqlite:///./verity.db`) requiring zero configuration or background services. Full-text search and fact retrieval utilize token-overlap and fuzzy substring matching.
2. **Production Tier:** Configurable via `DATABASE_URL` to target PostgreSQL 15+ with `pgvector` for high-dimensional cosine similarity over embeddings.

### Consequences
- **Positive:** 100% out-of-the-box reproducibility. Evaluators execute tests and run the full stack in under 10 seconds.
- **Positive:** Enterprise multi-tenant relational schema (`workspaces`, `brand_profiles`, `submissions`, `findings`, `audit_events`) is maintained identically across both engines.
- **Trade-off:** Advanced vector distance operators (`<=>`) are conditionally executed based on database dialect.

---

## Decision 3: Three-Layer Hybrid Analysis Engine with Strict Server-Side Validation

### Context
Generic AI compliance tools rely solely on unconstrained Large Language Model prompts, leading to:
- Hallucinated rules or fake corporate policy citations.
- Suggestion tampering (injecting speculative marketing buzzwords like "industry-leading" or "world-class").
- Failure when LLM API keys are unconfigured, rate-limited, or timing out.

### Decision
Implement an immutable, ordered 3-layer verification engine:
- **Layer 1 (Deterministic Rules):** Always-on regex, phrase variants, case normalisation, tone/slang checks, required elements, and accessibility algorithms (WCAG contrast, reading ease). Confirmed violations are emitted strictly here.
- **Layer 2 (Retrieval-Grounded Evidence):** Lexical and passage chunk retrieval matching claims against approved facts (F-01..F-03). Findings cite exact fact IDs or explicitly state `"No approved supporting evidence found."`
- **Layer 3 (Contextual AI with Strict Server Validation):** Optional LLM integration for subtle tone and alignment. Every AI finding is verified server-side:
  - The quoted text must be a verbatim substring of the draft.
  - The cited `rule_id` or `passage_id` must exist in the brand catalog.
  - The suggested replacement must not introduce novel proper nouns, figures, or claims absent from the original and approved facts.
  - If invalid, the finding is discarded (`rejected_ai_findings` incremented). AI findings default to "Potential issue requiring human verification" and cannot produce confirmed violations alone.

### Consequences
- **Positive:** Zero hallucinated brand rules.
- **Positive:** Complete graceful degradation when no AI API key is configured ("AI layer unavailable. Rule-based and retrieval checks ran.").
- **Positive:** Built-in prompt injection defense flags adversarial instructions without corrupting the governance pipeline.

---

## Decision 4: Immutable Version-Bound SHA-256 Approval Seals

### Context
In traditional CMS workflows, an item marked "Approved" can be subsequently edited by creators, inadvertently deploying non-compliant copy while retaining the approval badge.

### Decision
Bind human approval decisions cryptographically to the exact `submission_version_id` and the SHA-256 digest of the evaluated content:
1. When content is submitted or edited, a new version record is created with an immutable `content_hash` (`sha256(content.encode('utf-8'))`).
2. An approval decision records this specific `version_id` and `content_hash`.
3. High-severity findings hard-block the "Approve" button unless a compliance reviewer explicitly provides a recorded override justification.
4. Any post-approval edits force the creation of version `N+1` in "Resubmitted" or "Draft" state, immediately revoking the approval badge for the active draft.

### Consequences
- **Positive:** Guaranteed compliance audit trail with zero risk of unreviewed copy leakage.
- **Positive:** Reviewer decisions are tamper-evident and legally defensible.

---

## Decision 5: The Three Named Improvements Architecture

### Context
The WCC Forge 48 Inkloom specification explicitly judges three named improvements over standard compliance tools:
1. Evidence-backed detection.
2. Intent-preserving corrections.
3. Adaptive governance insights.

### Decision
1. **Evidence-Backed Detection:** Every finding is linked to an approved fact ID or passage. If a comparative or absolute claim lacks grounding, the engine explicitly attaches the standardized string: `"No approved supporting evidence found."`
2. **Intent-Preserving Corrections:** Suggested fixes are strictly synthesized using vocabulary from the creator's original sentence combined exclusively with approved fact phrasing (e.g., F-01 "supports online learning"). The engine never overwrites the original text; changes appear in a side-by-side word diff workspace.
3. **Adaptive Governance Telemetry:** User dismissals and challenges are tracked in `findings.status`. Rules exceeding a challenge threshold are flagged in the Governance Insights dashboard as *"Rules That May Be Unclear"* with recommendations to refine guideline phrasing without autonomously rewriting corporate policy.

### Consequences
- **Positive:** Transparent explainability, non-destructive editing, and continuous policy improvement loop.

---

## Decision 6: Cookie-Scoped Guest Workspace Isolation

### Context
Hackathon judges must be able to explore the platform immediately without an account creation or email verification barrier, while ensuring multiple concurrent visitors do not collide or overwrite brand rules.

### Decision
Implement a zero-friction demo session route (`POST /api/demo/session`) that issues a signed workspace cookie. Each visitor receives an isolated workspace UUID pre-seeded with the "Verity Learning" brand catalog, rules R1–R7, facts F-01–F-03, and benchmark sample submissions.

### Consequences
- **Positive:** Complete isolation between concurrent evaluators.
- **Positive:** Resetting demo data affects only the caller's workspace.
- **Positive:** Real Supabase authentication remains available for enterprise tenant accounts.

