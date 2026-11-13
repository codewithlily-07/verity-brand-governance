# VERITY Technical Inventory

**Product:** VERITY — Intelligent Brand Governance Platform  
**Team:** COGNEXA • WCC Forge 48 (Inkloom AI Problem Statement)  
**Document Purpose:** Complete disclosure of every API, AI model, dataset, library, template, and external service utilized across the VERITY codebase for Round 2 ("The Build").

---

## 1. Core Programming Languages & Runtimes

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Backend Runtime | Python | 3.13.7 | Server application runtime, rules engine, report generation |
| Frontend Runtime | Node.js | v20+ (Vite) | Frontend build system and asset compilation |
| Frontend Framework | React | 18.3.1 | Single-Page Application (SPA) component architecture |
| Typing & Validation | Pydantic | 2.10+ | Request/response schema validation and serialization |

---

## 2. Backend Libraries & Frameworks

| Package | Version | Source / License | Functionality |
|---|---|---|---|
| `fastapi` | 0.115.6 | MIT | Asynchronous REST API framework, dependency injection, OpenAPI documentation |
| `uvicorn` | 0.34.0 | BSD-3 | High-performance ASGI web server |
| `sqlalchemy` | 2.0.36 | MIT | SQL ORM, table schemas, transactional session management |
| `pymupdf` (`fitz`) | 1.25.1 | AGPL / Commercial | High-fidelity text, metadata, and structural extraction from uploaded PDF documents |
| `python-docx` | 1.1.2 | MIT | XML-level paragraph and table parsing for uploaded Word DOCX guidelines and drafts |
| `pillow` (`PIL`) | 11.0.0 | HPND | Image parsing, dimension checks, CIE ΔE color distance, and WCAG AA contrast calculation |
| `reportlab` | 4.4.1 | BSD | Server-side cryptographic PDF review report generation (with compliance seal and tables) |
| `httpx` | 0.28.1 | BSD-3 | Asynchronous HTTP client for API health probes and LLM adapter connectivity |
| `pytest` | 9.2.0 | MIT | Automated unit, integration, and rule acceptance test runner |

---

## 3. Frontend Libraries & Design Packages

| Package | Version | Source / License | Functionality |
|---|---|---|---|
| `vite` | 5.4.11 | MIT | Next-generation frontend bundler, HMR dev server, static production build |
| `tailwindcss` | 3.4.15 | MIT | Utility-first CSS framework with custom luxury tokens (`midnight-navy`, `verity-gold`, `ivory`) |
| `lucide-react` | 0.460.0 | ISC | Scalable SVG iconography for compliance badges, status indicators, and navigation |
| `framer-motion` | 11.3.19 | MIT | 60fps micro-animations, Verity Lens hero simulation, collapsible diffs, and page transitions |
| `recharts` | 2.12.7 | MIT | SVG-based responsive data visualization (compliance scores, category breakdown, risk heatmaps) |
| `@fontsource/fraunces` | 5.1.0 | SIL Open Font | Self-hosted serif typography for headings and editorial authority |
| `@fontsource/manrope` | 5.1.0 | SIL Open Font | Self-hosted clean sans-serif typography for UI controls and dense data tables |
| `@fontsource/jetbrains-mono` | 5.1.0 | SIL Open Font | Self-hosted monospaced typography for SHA-256 hashes, IDs, and diff highlighting |

---

## 4. Artificial Intelligence & Models

| Service / Model | Role | Configuration | Fallback Behavior |
|---|---|---|---|
| **Google Gemini API** (`gemini-1.5-flash`) | Layer 3 Contextual AI Analysis | Optional (`LLM_API_KEY`, `LLM_PROVIDER=gemini`) | When key is absent or provider is unreachable, Layer 3 is gracefully skipped. Layers 1 and 2 run with notice: *"AI layer unavailable. Rule-based and retrieval checks ran."* |
| **OpenAI / Claude Adapter** | Alternative LLM Provider | Configurable via `LLM_PROVIDER` | Same graceful fallback with server-side validation |
| **Server-Side AI Validator** | Output Verification Guardrail | Built-in Python Engine | Discards hallucinations, validates exact quotation substrings, verifies rule references, and blocks speculative claims |

---

## 5. Storage & Database Systems

| System | Role | Configuration | Description |
|---|---|---|---|
| **SQLite 3** | Default Local Storage | `sqlite:///./verity.db` | Zero-dependency local relational storage used for evaluation, unit testing, and instant judge review |
| **PostgreSQL 15+ (Supabase)** | Production Relational Storage | `DATABASE_URL` (optional) | Multi-tenant organization isolation, indexing, and transactional integrity |
| **pgvector** | Vector Similarity Search | Optional extension | High-dimensional embedding storage for semantic similarity matching (falls back to FTS lexical matching) |
| **Supabase Storage / Local Buffer** | Document Storage | `STORAGE_BUCKET` | Uploaded brand guidelines (PDF/DOCX) and generated audit reports |

---

## 6. Datasets & Seed Catalogs

| Dataset | Location | Records | Description |
|---|---|---|---|
| **Verity Learning Brand Catalog** | `backend/app/services/seed_data.py` | 7 Rules (R1–R7), 3 Facts (F-01–F-03), 8 Terms, 4 Visual Swatches | Benchmark demonstration brand dataset modelling an online educational platform with strict compliance rules |
| **Governance Benchmark Suite** | `eval/benchmark_data.json` | 30 Labelled Test Cases | Ground-truth evaluation dataset testing precision, recall, false positive rejection, and prompt injection defense |
| **Sample Acceptance Inputs** | Embedded in App & Test Suite | Samples A, B, C, D, E | Direct verification samples as defined in WCC Forge 48 Inkloom specification Section 8 |

---

## 7. External Cloud Services & Platforms

| Platform | Role | Mode |
|---|---|---|
| **Render / Railway / Docker** | Deployment Targets | Prepared via `Dockerfile`, `docker-compose.yml`, and `render.yaml` |
| **Supabase** | Cloud Auth & Storage | Supported via server-side JWT verification and S3-compatible storage endpoints |
| **Localhost** | Evaluation Target | Default execution on `http://127.0.0.1:8000` |
