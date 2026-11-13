# VERITY System Architecture

**Product:** VERITY — Intelligent Brand Governance Platform  
**Team:** COGNEXA • WCC Forge 48 (Inkloom AI Problem Statement)

---

## 1. High-Level System Architecture

```mermaid
flowchart TD
    User["Content Creator / Compliance Reviewer"] --> SPA["React 18 SPA (Vite + Tailwind CSS)"]
    
    subgraph FastAPI_Unified_Service["FastAPI Application (Port 8000)"]
        SPA_Static["Static Files Mount (/assets, index.html)"]
        APIRouter["API Router Layer (/api/*)"]
        
        subgraph Engine_Core["3-Layer Verification Engine"]
            L1["Layer 1: Deterministic Rules\n(Regex, Casing, Prohibitions, A11y)"]
            L2["Layer 2: Grounded Fact Retrieval\n(FTS tsvector / Approved Facts F-01..F-03)"]
            L3["Layer 3: Validated Contextual AI\n(LLM Adapter with Quote/Rule Validator)"]
        end
        
        subgraph Aux_Engines["Governance Differentiators"]
            ScoreEng["Compliance Score Engine (Weighted 0-100)"]
            LedgerEng["Evidence Ledger Generator"]
            ReportGen["ReportLab PDF Generator"]
        end

        DB_Layer["SQLAlchemy ORM + SQLite / PostgreSQL pgvector"]
    end

    SPA -->|REST Calls| APIRouter
    APIRouter --> Engine_Core
    APIRouter --> Aux_Engines
    Engine_Core --> DB_Layer
    Aux_Engines --> DB_Layer
```

---

## 2. Review & Approval State Machine

```mermaid
stateDiagram-v2
    [*] --> Draft : Creator submits new draft
    Draft --> Submitted : Ready for initial review
    Submitted --> In_Review : Assigned to compliance reviewer
    In_Review --> Changes_Requested : High severity violations flagged (reason mandatory)
    Changes_Requested --> Resubmitted : Creator accepts diff & saves v2
    Resubmitted --> In_Review : Re-analysis verified
    In_Review --> Approved : Version-bound SHA-256 seal (high issues resolved)
    In_Review --> Rejected : Non-compliant content rejected (reason mandatory)
```

---

## 3. Data Isolation Model

- **Multi-Tenant / Guest Isolation:** Every visitor is allocated an isolated workspace UUID stored in a session cookie.
- **Strict Query Scoping:** All database queries for brand guidelines, rules, approved facts, submissions, and audit events are strictly parameterized by `workspace_id`.
- **Zero Cross-Contamination:** Evaluators and judges run independent evaluations without overwriting shared brand data.
