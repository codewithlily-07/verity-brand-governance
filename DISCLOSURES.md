# DISCLOSURES & ATTRIBUTIONS

**Product:** VERITY — Intelligent Brand Governance Platform  
**Team:** COGNEXA  
**Competition:** WCC Forge 48 (Inkloom AI Problem Statement)

---

## 1. Third-Party Libraries & Dependencies

### Backend (Python 3.11+ / 3.13)
- **FastAPI** (`fastapi`): High-performance asynchronous REST API framework.
- **Uvicorn** (`uvicorn`): ASGI server implementation.
- **SQLAlchemy** (`sqlalchemy`): Object-relational mapping and database abstraction supporting SQLite and PostgreSQL.
- **Pydantic** (`pydantic`, `pydantic-settings`): Strict data schema validation and settings parsing.
- **PyMuPDF / Fitz** (`pymupdf`): High-accuracy PDF document parsing and text extraction.
- **python-docx** (`python-docx`): Microsoft Word DOCX paragraph extraction.
- **Pillow** (`pillow`): Visual image processing, dominant color extraction, and resolution checking.
- **HTTPX** (`httpx`): Asynchronous HTTP client for AI provider adapters.
- **Pytest** (`pytest`): Automated unit and API integration testing.
- **Alembic** (`alembic`): Database schema migrations.

### Frontend (JavaScript / React 18)
- **React & ReactDOM** (`react`, `react-dom`): Declarative UI library.
- **Vite** (`vite`): Next-generation frontend build tooling and dev server.
- **Tailwind CSS** (`tailwindcss`, `autoprefixer`, `postcss`): Utility-first CSS design system.
- **Lucide React** (`lucide-react`): Consistent, accessible icon set.
- **Recharts** (`recharts`): SVG-based charting library for governance telemetry analytics.
- **Framer Motion** (`framer-motion`): Fluid UI transitions and timeline animations.
- **clsx & tailwind-merge**: Class name merging utilities.

---

## 2. Fonts & Assets

- **Fraunces** (`@fontsource/fraunces`): Open-source serif display font hosted via Fontsource (Google Fonts).
- **Manrope** (`@fontsource/manrope`): Open-source clean sans-serif UI font.
- **JetBrains Mono** (`@fontsource/jetbrains-mono`): Open-source monospace font for hashes, codes, and diffs.
- **Brand Seal Logo**: Custom-crafted SVG vector seal featuring a rosette lens and centered checkmark.

---

## 3. External Services & APIs

- **LLM Contextual Analysis (Layer 3)**: Optional adapter configured for Google Gemini API (`gemini-1.5-flash`) or OpenAI-compatible endpoints. The platform strictly enforces graceful degradation: if no API key is present or the service times out, Layer 1 (Rules) and Layer 2 (Fact Retrieval) continue uninterrupted.
- **Database**: Zero-dependency local SQLite file default with seamless PostgreSQL and Supabase pgvector compatibility via `DATABASE_URL`.

---

## 4. Artificial Intelligence Tool Disclosure

Portions of this software architecture, including backend route scaffolds, regex phrase generators, React components, and documentation, were authored with the collaborative assistance of Google DeepMind's Antigravity AI coding agent. All generated code was reviewed, validated, and verified through automated pytest test suites and evaluation harnesses by Team COGNEXA.
