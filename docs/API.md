# VERITY REST API Documentation

VERITY provides an OpenAPI 3.0 compliant REST API served by FastAPI. Complete interactive documentation is accessible at `/docs` (Swagger UI) and `/redoc` (ReDoc).

---

## Base Endpoints

### 1. Session & Workspace Isolation
- `GET /api/health`
  - Health check endpoint returning service status, name, and version.
- `POST /api/session`
  - Establishes a cookie-isolated guest workspace.
  - Automatically seeds the **Verity Learning** brand profile, rules, approved facts, and demonstration history.
- `POST /api/demo/reset`
  - Clears all workspace edits and reseeds fresh demonstration catalog data.

---

## 2. Brand Knowledge Hub
- `GET /api/brand`
  - Retrieves active brand profile with rules, facts, terminology, and visual tokens.
- `PUT /api/brand`
  - Updates brand profile attributes (name, voice attributes, audience, palette).
- `POST /api/brand/rules` | `DELETE /api/brand/rules/{id}`
  - CRUD operations for deterministic brand rules.
- `POST /api/brand/facts` | `DELETE /api/brand/facts/{id}`
  - CRUD operations for verified approved facts.
- `POST /api/brand/sources`
  - Multipart file upload (PDF or DOCX). Parses and chunks into 120–200 word passages for retrieval.

---

## 3. Submissions & Review Workflow
- `POST /api/submissions`
  - Creates a new submission and version 1, executing analysis immediately.
- `POST /api/submissions/upload`
  - Creates submission directly from uploaded PDF or DOCX document.
- `GET /api/submissions`
  - Lists all submissions in current workspace.
- `GET /api/submissions/{id}`
  - Retrieves submission details, versions, analysis findings, decisions, and comments.
- `POST /api/submissions/{id}/versions`
  - Creates a revised version snapshot (v2, v3, etc.) and re-runs the analysis engine.
- `POST /api/submissions/diff`
  - Word-level diff calculation between original and proposed revised copy.
- `PATCH /api/findings/{id}`
  - Updates finding status (`accepted`, `edited`, `dismissed`, `challenged`).
- `POST /api/submissions/{id}/review`
  - Submits reviewer decision (`approve`, `reject`, `request_changes`).
  - Requires version ID; enforces high-severity resolution checks unless override is recorded.
- `POST /api/submissions/{id}/comments`
  - Appends review commentary to the submission audit thread.

---

## 4. Governance Telemetry & AI Status
- `GET /api/insights`
  - Real calculated analytics: category distributions, top violated rules, average decision times, and rules flagged as possibly unclear.
- `GET /api/audit`
  - Returns cryptographically linked workspace audit event ledger.
- `GET /api/ai/status`
  - Reports provider status, model, and active fallback mode.

