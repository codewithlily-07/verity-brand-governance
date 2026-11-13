import io
from datetime import datetime, timezone
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)

def generate_submission_pdf(submission_data: dict, score_data: dict = None) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Brand Palette Colors
    navy = colors.HexColor("#0B1428")
    gold = colors.HexColor("#C6A15B")
    teal = colors.HexColor("#1E9E78")
    coral = colors.HexColor("#D64550")
    mist = colors.HexColor("#F8F7F3")
    charcoal = colors.HexColor("#172033")

    # Custom typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=navy,
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.gray
    )
    section_heading = ParagraphStyle(
        'SecHead',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=navy,
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=charcoal
    )
    mono_style = ParagraphStyle(
        'Mono',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=charcoal
    )

    story = []

    # Header Banner
    header_data = [
        [
            Paragraph("<b>VERITY</b> • Institutional Brand Governance", title_style),
            Paragraph(f"<b>REPORT DATE</b><br/>{datetime.now(timezone.utc).strftime('%B %d, %Y')}", subtitle_style)
        ]
    ]
    t_header = Table(header_data, colWidths=[380, 160])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
    ]))
    story.append(t_header)
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=2, color=gold, spaceAfter=15))

    # Submission Metadata Table
    versions = submission_data.get("versions", [])
    active_version = versions[-1] if versions else {}
    version_num = active_version.get("version_number", 1)
    content_hash = active_version.get("content_hash", "N/A")

    meta_table_data = [
        [
            Paragraph("<b>Document Title:</b>", body_style),
            Paragraph(submission_data.get("title", "Untitled Review"), body_style),
            Paragraph("<b>Status:</b>", body_style),
            Paragraph(f"<b>{submission_data.get('status', 'Draft')}</b>", body_style),
        ],
        [
            Paragraph("<b>Channel / Type:</b>", body_style),
            Paragraph(str(submission_data.get("content_type", "social")).capitalize(), body_style),
            Paragraph("<b>Author:</b>", body_style),
            Paragraph(submission_data.get("author_name", "Creator"), body_style),
        ],
        [
            Paragraph("<b>Version:</b>", body_style),
            Paragraph(f"v{version_num}", body_style),
            Paragraph("<b>SHA-256 Hash:</b>", body_style),
            Paragraph(f"<font size=7>{content_hash[:20]}...</font>", mono_style),
        ]
    ]
    t_meta = Table(meta_table_data, colWidths=[100, 170, 90, 180])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), mist),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 12))

    # Brand Compliance Score Section
    if score_data and score_data.get("overall_score") is not None:
        score_val = score_data.get("overall_score", 0)
        grade = score_data.get("grade", "N/A")
        score_table_data = [
            [
                Paragraph(f"<font size=22 color='{teal.hexval()}'><b>{score_val}/100</b></font><br/><b>Brand Compliance Score</b>", body_style),
                Paragraph(f"<b>Rating Grade:</b> {grade}<br/>"
                          f"<b>Status:</b> {score_data.get('summary', '')}<br/>"
                          f"<font size=7 color='gray'>Formula: 100 × (1 − Σ weight_failed / Σ weight_checked)</font>", body_style)
            ]
        ]
        t_score = Table(score_table_data, colWidths=[200, 340])
        t_score.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F0FDF4")),
            ('BOX', (0, 0), (-1, -1), 1, teal),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(t_score)
        story.append(Spacer(1, 12))

    # Content Preview Box
    story.append(Paragraph("Evaluated Content Text Snapshot", section_heading))
    content_text = active_version.get("content", "")
    content_preview = content_text if len(content_text) <= 500 else content_text[:500] + "..."
    t_content = Table([[Paragraph(content_preview.replace('\n', '<br/>'), body_style)]], colWidths=[540])
    t_content.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FAFAFA")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_content)
    story.append(Spacer(1, 12))

    # Findings & Evidence Grounding Table
    story.append(Paragraph("Evidence-Linked Findings & Grounding Citations", section_heading))
    run = active_version.get("analysis_run") or {}
    findings = run.get("findings", [])

    if not findings:
        story.append(Paragraph("<b>✓ Zero Violations Detected:</b> Content complies fully with active brand guidelines and verified facts.", body_style))
    else:
        findings_table_data = [
            [
                Paragraph("<b>Sev</b>", body_style),
                Paragraph("<b>Rule</b>", body_style),
                Paragraph("<b>Finding & Quoted Text</b>", body_style),
                Paragraph("<b>Evidence Grounding</b>", body_style),
                Paragraph("<b>Intent-Preserving Correction</b>", body_style)
            ]
        ]
        for f in findings:
            sev = f.get("severity", "medium").upper()
            rule_id = f.get("rule_id", "N/A")
            quote = f.get("quote", "")
            title = f.get("title", "")
            ev = f.get("evidence", {}).get("text", "No approved supporting evidence found.")
            fix = f.get("suggested_replacement") or "Requires manual review."

            findings_table_data.append([
                Paragraph(f"<b>{sev}</b>", body_style),
                Paragraph(f"<font size=7>{rule_id}</font>", mono_style),
                Paragraph(f"<b>{title}</b><br/><i>\"{quote}\"</i>", body_style),
                Paragraph(f"<font color='{navy.hexval()}'>{ev}</font>", body_style),
                Paragraph(f"<font color='{teal.hexval()}'>{fix}</font>", body_style)
            ])

        t_findings = Table(findings_table_data, colWidths=[45, 55, 140, 160, 140])
        t_findings.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), navy),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story.append(t_findings)

    story.append(Spacer(1, 14))

    # Human Approval Sign-off Box
    story.append(Paragraph("Human Approval Sign-off & Audit Seal", section_heading))
    decisions = submission_data.get("decisions", [])
    latest_decision = decisions[-1] if decisions else None

    if latest_decision:
        dec_status = latest_decision.get("decision", "in_review").upper()
        dec_table_data = [
            [
                Paragraph(f"<b>DECISION: {dec_status}</b>", body_style),
                Paragraph(f"<b>Sign-off Authority:</b> {latest_decision.get('reviewer_name')} ({latest_decision.get('reviewer_role')})", body_style),
            ],
            [
                Paragraph(f"<b>Audit Remarks:</b> {latest_decision.get('reason') or 'No remarks recorded.'}", body_style),
                Paragraph(f"<b>Timestamp:</b> {latest_decision.get('created_at')[:19]} UTC", subtitle_style),
            ]
        ]
        t_dec = Table(dec_table_data, colWidths=[240, 300])
        t_dec.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F9FBF9")),
            ('BOX', (0, 0), (-1, -1), 1, teal if dec_status == "APPROVE" else coral),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(t_dec)
    else:
        story.append(Paragraph("<i>Pending formal reviewer sign-off. AI recommendations remain advisory.</i>", body_style))

    # Footer note
    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.gray, spaceAfter=8))
    story.append(Paragraph(
        "<b>VERITY Brand Governance Platform</b> • Team COGNEXA • "
        "Every approval is human, version-bound, and audited. AI is never authorized to approve publications autonomously.",
        subtitle_style
    ))

    doc.build(story)
    return buffer.getvalue()
