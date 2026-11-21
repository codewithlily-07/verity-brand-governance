import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

pdf_path = os.path.join("docs", "VERITY_Round3_Product_Report.pdf")
os.makedirs("docs", exist_ok=True)

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    leftMargin=36,
    rightMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

navy = colors.HexColor("#101B35")
gold = colors.HexColor("#8A6A24")
ink = colors.HexColor("#14203D")
champagne = colors.HexColor("#F3EAD3")
line_color = colors.HexColor("#D5DBEE")

title_style = ParagraphStyle(
    "DocTitle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=20,
    leading=24,
    textColor=navy,
    alignment=TA_CENTER
)

subtitle_style = ParagraphStyle(
    "DocSubTitle",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=10,
    leading=14,
    textColor=gold,
    alignment=TA_CENTER
)

h1_style = ParagraphStyle(
    "H1",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=12,
    leading=16,
    textColor=navy,
    spaceBefore=10,
    spaceAfter=4
)

h2_style = ParagraphStyle(
    "H2",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9.5,
    leading=13,
    textColor=gold,
    spaceBefore=6,
    spaceAfter=2
)

body_style = ParagraphStyle(
    "Body",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.5,
    leading=12,
    textColor=ink,
    spaceAfter=3
)

bullet_style = ParagraphStyle(
    "Bullet",
    parent=body_style,
    leftIndent=12,
    firstLineIndent=-8,
    spaceAfter=2
)

story = []

# Title & Metadata
story.append(Paragraph("VERITY — Intelligent Brand Governance Platform", title_style))
story.append(Spacer(1, 2))
story.append(Paragraph("Official Round 3 Project Report • WCC Forge 48 (Inkloom AI Problem Statement)", subtitle_style))
story.append(Paragraph("Team Cognexa | Vookoti Sowmya (Lead), Gadidamalla Bhanu Rasool | November 21, 2026", subtitle_style))
story.append(Spacer(1, 4))
story.append(HRFlowable(width="100%", thickness=1.5, color=gold, spaceBefore=3, spaceAfter=8))

# 1. Executive Summary
story.append(Paragraph("1. Executive Summary & Core Mission", h1_style))
story.append(Paragraph("VERITY is an enterprise-grade pre-publication brand governance platform designed to protect organizational reputation across high-volume marketing, social, ad, and editorial copy. VERITY executes an automated 5-step lifecycle: <b>Check, Explain, Improve, Review, and Approve</b>. Rather than relying on black-box generative models that hallucinate policies, VERITY employs a deterministic 3-layer checking pipeline, an immutable claim evidence ledger, and cryptographic SHA-256 state locks with server-enforced role separation. In Round 3, VERITY transitioned from a functional prototype into a battle-hardened, accessible product with durable cloud persistence, real-time concurrency resolution, and zero WCAG AA contrast violations.", body_style))

# 2. Key Links Table
links_data = [
    [Paragraph("<b>Live Deployed Platform:</b>", body_style), Paragraph("https://verity-brand-governance.onrender.com", body_style)],
    [Paragraph("<b>Public Source Repository:</b>", body_style), Paragraph("https://github.com/codewithlily-07/verity-brand-governance", body_style)],
    [Paragraph("<b>Readiness & Health Probe:</b>", body_style), Paragraph("https://verity-brand-governance.onrender.com/api/ready", body_style)],
]
t_links = Table(links_data, colWidths=[150, 390])
t_links.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), champagne),
    ("PADDING", (0,0), (-1,-1), 3),
    ("BOX", (0,0), (-1,-1), 0.5, gold),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
]))
story.append(t_links)
story.append(Spacer(1, 6))

# 3. The Three Promised Improvements
story.append(Paragraph("2. The Three Round 2 Commitments: Delivery Audit", h1_style))

story.append(Paragraph("Improvement 1: Durable Cloud Persistence & Database Migration", h2_style))
story.append(Paragraph("<b>Committed:</b> Transition from ephemeral demo/memory stores to a durable relational database with automated schema migration management and persistent binary document storage.<br/><b>Delivered:</b> Integrated SQLAlchemy async ORM supporting PostgreSQL (Supabase) and SQLite with Alembic migration versioning (migration <code>7a1e2c3d4e5f</code>). Implemented a live readiness probe at <code>/api/ready</code> confirming schema existence and migration tracking. Added binary blob persistence directly into database tables (<code>file_bytes</code>, <code>data_blob</code>), ensuring corporate guidelines survive container restarts.", body_style))

story.append(Paragraph("Improvement 2: Claim Evidence Ledger & Grounding Engine", h2_style))
story.append(Paragraph("<b>Committed:</b> Implement an institutional claim validation ledger that extracts assertions, matches them against corporate ground truths, and enforces review sign-off gating.<br/><b>Delivered:</b> Built the Claim Evidence Ledger engine (<code>claim_ledger.py</code>) pairing draft statements against approved facts using BM25 and token overlap, classifying claims as <i>supported</i>, <i>conflicting</i>, or <i>unsupported</i>. In the Review Sign-off Centre, approval is strictly blocked if high-severity ungrounded claims exist unless the reviewer logs an explicit compliance override justification.", body_style))

story.append(Paragraph("Improvement 3: Multi-Role Team Collaboration & Concurrency Control", h2_style))
story.append(Paragraph("<b>Committed:</b> Support concurrent creator and reviewer workflows with optimistic locking, conflict recovery, and tamper-evident audit trails.<br/><b>Delivered:</b> Implemented server-side RBAC separating Creator, Reviewer, Admin, and Owner personas. Added integer <code>lock_version</code> optimistic locking returning HTTP 409 Conflict if a review is attempted on a stale draft. Provided non-destructive version restoration, threaded review commentary, and instant CSV audit stream downloads (<code>/api/submissions/{id}/audit.csv</code>).", body_style))

# 4. Production Hardening & Usability Features
story.append(Paragraph("3. Round 3 Production Hardening & User Experience", h1_style))
story.append(Paragraph("• <b>Gold Refinement Animation:</b> Completely replaced punitive red strike-throughs with an amber glowing halo, gold dust motes, and letter condensation, visualising purification rather than punishment.", bullet_style))
story.append(Paragraph("• <b>Zero WCAG Contrast Violations:</b> Implemented the 'Navy Like' design system (#0A1226 midnight, #101B35 navy, #FAF8F2 ivory, #F3EAD3 champagne, #E2B857 gold, #7A5B18 deep-gold), scoring 0 contrast violations across all 16 routes under automated axe-core scans.", bullet_style))
story.append(Paragraph("• <b>Interactive Brand Hub Rule Tester:</b> Live pattern sandbox allowing compliance teams to test regex and dictionary rules with real-time match highlighting before publishing.", bullet_style))
story.append(Paragraph("• <b>Brand Kit Portability:</b> One-click JSON export/import of rules, facts, terminology, and palettes (<code>verity-brand-kit.json</code>) with schema validation.", bullet_style))
story.append(Paragraph("• <b>Safe Fixes Preview Modal:</b> Instant one-click application of verified fixes accompanied by an 8-second reversible Undo toast.", bullet_style))
story.append(Paragraph("• <b>Resilience & Boundaries:</b> Client-side <code>useRef</code> double-action prevention, magic-byte file signature validation (%PDF, PK), and deep-link URL parameter synchronization.", bullet_style))

# 5. Technical Architecture
story.append(Paragraph("4. Technical Architecture & Data Flow", h1_style))
story.append(Paragraph("VERITY is architected as a high-performance single-container service. FastAPI directly mounts the pre-built React 18 SPA, eliminating cross-origin latency and multi-service failure points. Incoming copy traverses a 3-layer pipeline: (1) Deterministic AST/Regex rules for zero-latency policy checks; (2) Grounded Fact Retrieval matching claims against verified organizational facts; and (3) Contextual AI suggestions using Gemini 1.5 Flash with strict JSON schema parsing and zero-cost local fallback. Evaluated content is cryptographically fingerprinted using SHA-256; approvals permanently bind to the evaluated content hash.", body_style))

# 6. Evaluation & Testing Metrics
story.append(Paragraph("5. Verification & Test Metrics", h1_style))
story.append(Paragraph("• <b>Automated Pytest Suite:</b> 27/27 automated backend tests passing (unit, integration, claim ledger, audit CSV, persistence).", bullet_style))
story.append(Paragraph("• <b>Axe-Core Accessibility:</b> 0 color contrast failures across 16 routes and 30 multi-viewport screen sizes.", bullet_style))
story.append(Paragraph("• <b>Quality Benchmark Harness (/quality):</b> 100% Precision (11/11), 100% Recall (11/11), 0 False Positives on clean drafts.", bullet_style))
story.append(Paragraph("• <b>Honest Disclosure:</b> Render free-tier deployment runs in SQLite file mode pending dedicated PostgreSQL environment provisioning; Alembic migration head <code>7a1e2c3d4e5f</code> is verified and ready.", bullet_style))

# 7. Roadmap
story.append(Paragraph("6. Product Roadmap (Post-Round 3)", h1_style))
story.append(Paragraph("• <b>Q1 2027:</b> Multilingual governance (German, French, Spanish) and hybrid BM25 + dense vector RAG with pgvector.", bullet_style))
story.append(Paragraph("• <b>Q2 2027:</b> CMS direct authoring connectors (WordPress, HubSpot, Google Docs extension, Figma token auditor).", bullet_style))
story.append(Paragraph("• <b>Q3 2027:</b> Enterprise SAML 2.0 / SCIM directory sync and pre-packaged regulatory rule packs (FTC, FDA, SEBI, EU AI Act).", bullet_style))

doc.build(story)
print("SUCCESS: PDF successfully generated at:", os.path.abspath(pdf_path))
