# WCC Forge 48 — Submission Answers

**Team Name:** Cognexa  
**Problem Statement:** Inkloom AI (Brand Governance)  
**Project Name:** VERITY  

---

### Question 1: Team Leader Email
```
sowmyavookoti@gmail.com
```

---

### Question 2: Team Member Names
*(One per line)*
```
Vookoti Sowmya
Gadidamalla Bhanu Rasool
```

---

### Question 3: Link to the Functioning Project (Live Deployed URL)
```
[DEPLOYED_URL_PLACEHOLDER]
```
*(Note: Replace with your deployed Render / Railway URL once deployed)*

---

### Question 4: Public Source-Code Repository URL
```
https://github.com/codewithlily-07/verity-brand-governance
```

---

### Question 5: Google Drive Link to Updated Project PDF
```
TODO: I will paste this after uploading docs/ROUND2_PROJECT_REPORT.md to Google Drive
```

---

### Question 6: What did you build in Round 2?
*(Summary of product and scope)*
```
In Round 2, we built VERITY, an intelligent pre-publication brand governance platform that enforces organizational rules, facts, terminology, and visual standards across content before release. VERITY implements our core commitment: Check, Explain, Improve, Review, and Approve. 

The system features a 3-layer checking engine (deterministic rules, grounded fact retrieval, and contextual AI) with zero-cost offline fallback. It provides an isolated guest demo workspace (no sign-up required), role-separated review gates (Creators submit; only Authorised Reviewers can approve), and cryptographic SHA-256 version locking. We also built an automated evaluation harness with 100% precision and recall across our labelled benchmark suite.
```

---

### Question 7: Technology Stack & Architecture
```
Backend: Python 3.11+, FastAPI, Uvicorn, SQLAlchemy (supporting SQLite and PostgreSQL with pgvector), Pydantic v2, PyMuPDF, and python-docx.
Frontend: React 18, Vite, Tailwind CSS, Lucide React, and Recharts.
Architecture: Single-container full-stack application where FastAPI directly serves the pre-built React SPA, eliminating cross-origin overhead.
Testing: Pytest (16 automated tests), Selenium browser automation, and automated axe-core WCAG AA contrast verification (0 failures across all 16 routes).
```

---

### Question 8: AI & External Services Used
```
- Contextual Analysis (Layer 3): Google Gemini API (gemini-1.5-flash) and OpenAI-compatible adapters with strict structured JSON output parsing.
- Safe Degradation: External AI is strictly optional. If an API key is absent or unreachable, Layers 1 and 2 operate deterministically with 100% precision and recall on our benchmark suite.
- Fonts: Playfair Display and Inter via Google Fonts.
- Document Parsers: PyMuPDF for PDF extraction and python-docx for Word documents.
- Antigravity AI: Collaborative code scaffolding and test harness generation (all code verified by team).
```

---

### Question 9: The Three Named Improvements (Round 1 Commitment)
```
1. Evidence-Backed Detection: Every finding links to an approved rule or fact code with exact policy quotations. When an assertion lacks corporate grounding, it explicitly flags "No approved supporting evidence found."
2. Intent-Preserving Corrections: Generates minimal, non-hallucinatory replacements displayed in an interactive side-by-side word diff, ensuring the author's voice is preserved without adding promotional claims.
3. Adaptive Governance Insights: Aggregates real submission telemetry, tracking flag frequency against creator dismissals and challenges. Rules with high challenge rates (≥25%) are surfaced as "Rules That May Be Unclear" to guide policy updates.
```

---

### Question 10: Testing & Evaluation Metrics
```
Our automated test suite includes 16 unit and integration tests covering the complete submission lifecycle, role permissions, and engine detection (100% pass rate). 

Using our built-in labelled test set (/quality) containing 11 planted violations across 4 scenarios:
- Precision: 100.0% (11/11 findings correct)
- Recall: 100.0% (11/11 planted issues detected)
- Evidence Accuracy: 100.0% (11/11 cited approved sources)
- Clean Draft False Positives: 0
- Review Time: Honestly reported as "Not measured yet" pending longitudinal multi-reviewer studies.
```

---

### Question 11: User Testing
```
Feedback collection has been integrated directly into the application via a floating feedback widget. Structured external end-user feedback is not yet collected, as testing thus far has been conducted internally across our evaluation harness and test cohorts.
```

---

### Question 12: Team Contributions
```
- Vookoti Sowmya (Team Leader): Architected full-stack system, implemented FastAPI routes, state-machine transitions, role-based review gatekeeper, and automated evaluation harness.
- Gadidamalla Bhanu Rasool: Designed 3-layer checking engine, intent-preserving diff algorithm, React UI components, automated test suites, and WCAG contrast compliance.
```

---

### Question 13: Known Limitations & Next Steps
```
Current limitations include sequential text extraction on multi-column PDFs, requirement of PostgreSQL for active pgvector semantic search (SQLite BM25 used locally), and lack of external longitudinal timing data. Round 3 focuses on direct CMS export integrations (HubSpot, WordPress), concurrent multi-reviewer collaboration, and automated guideline ingestion from uploaded brand books.
```

---

### Question 14: How a Judge Uses It in 3 Steps (Demo Instructions)
```
1. Open the Live Site and click "Explore Demo Workspace" on the hero. Your session instantly connects to an isolated, pre-seeded workspace with approved rules, facts, and glossary (no login required).
2. Go to "New Review" and click the sample chip: "Our platform guarantees 100% results and is the best learning platform in India!". Click "Run Brand Review" to see 3 high-severity violations with exact policy citations.
3. Click "Apply Intent-Preserving Fixes" to view the side-by-side diff, create Version 2, then switch role to "Authorised Reviewer" in the top bar to approve the release with a decision note.
```
