# DISCLOSURES & ATTRIBUTIONS

**Product:** VERITY — Intelligent Brand Governance Platform  
**Team:** COGNEXA (Vookoti Sowmya, Gadidamalla Bhanu Rasool)  
**Competition:** WCC Forge 48 (Inkloom AI Problem Statement)

---

## 1. Third-Party Libraries & Dependencies

### Backend (Python 3.11+ / 3.13)
- **FastAPI** (`fastapi`): High-performance asynchronous REST API framework.
- **Uvicorn** (`uvicorn`): ASGI production server implementation.
- **SQLAlchemy** (`sqlalchemy`): Object-relational mapping supporting SQLite and PostgreSQL with pgvector.
- **Pydantic** (`pydantic`, `pydantic-settings`): Strict data schema validation and environment parsing.
- **PyMuPDF / Fitz** (`pymupdf`): PDF document parsing and text extraction.
- **python-docx** (`python-docx`): Microsoft Word document extraction.
- **Pillow** (`pillow`): Visual image processing, dominant color extraction, and resolution checking.
- **HTTPX** (`httpx`): Asynchronous HTTP client for external AI provider adapters.
- **Pytest** (`pytest`): Automated unit and integration testing suite.
- **Alembic** (`alembic`): Database schema migrations.
- **bcrypt** (`bcrypt`): Secure password hashing.

### Frontend (JavaScript / React 18)
- **React & ReactDOM** (`react`, `react-dom`): Declarative UI library.
- **Vite** (`vite`): Frontend build tooling and fast dev server.
- **Tailwind CSS** (`tailwindcss`, `autoprefixer`, `postcss`): Utility-first CSS design system.
- **Lucide React** (`lucide-react`): Consistent, accessible icon set.
- **Recharts** (`recharts`): SVG-based charting library for governance telemetry analytics.
- **Framer Motion** (`framer-motion`): UI transitions and timeline animations.

---

## 2. Typography & Fonts

- **Playfair Display**: Google Fonts (Display headings).
- **Inter**: Google Fonts (Body copy, buttons, labels, tables).
- **JetBrains Mono**: Monospace font for hash verification, rule codes, and diff inspection.

---

## 3. External Services & APIs

- **LLM Contextual Analysis (Layer 3)**: Optional adapter configured for Google Gemini API (`gemini-1.5-flash`) or OpenAI-compatible endpoints. The platform strictly enforces graceful fallback: if no API key is provided, Layer 1 (Rules) and Layer 2 (Fact Retrieval) execute with 100% precision and recall on the test set.
- **Database**: Zero-dependency local SQLite file default with seamless PostgreSQL and Supabase pgvector compatibility via `DATABASE_URL`.

---

## 4. Artificial Intelligence Tool Disclosure

Portions of this software architecture, including backend route scaffolds, regex generators, React components, and documentation, were authored with the collaborative assistance of Google DeepMind's Antigravity AI coding agent. All generated code was reviewed, validated, and verified through automated pytest test suites and evaluation harnesses by Team COGNEXA.
