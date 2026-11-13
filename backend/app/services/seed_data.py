import hashlib
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from backend.app.models.verity_models import (
    Workspace, BrandProfile, BrandRule, ApprovedFact, Terminology,
    VisualAsset, SourcePassage, Submission, SubmissionVersion,
    AnalysisRun, Finding, ReviewDecision, Comment, AuditEvent
)

def seed_demo_workspace(db: Session, workspace_id: str) -> BrandProfile:
    """
    Idempotently seeds the demo workspace with:
    - Verity Learning brand profile
    - Rules R1 to R7
    - Approved Facts F-01 to F-03
    - Terminology glossary
    - Visual assets
    - Guideline passages
    - Sample historical submissions for governance insights
    """
    profile = db.query(BrandProfile).filter(BrandProfile.workspace_id == workspace_id).first()
    if profile:
        return profile

    now = datetime.now(timezone.utc)

    # 1. Create Brand Profile
    profile = BrandProfile(
        workspace_id=workspace_id,
        name="Verity Learning",
        tagline="Consistent. Compliant. Trustworthy.",
        voice_attributes=["professional", "trustworthy", "helpful"],
        audience="learners and parents",
        palette_json=[
            {"name": "Midnight Navy", "hex": "#0A1128", "role": "primary"},
            {"name": "Verity Gold", "hex": "#C8A35A", "role": "accent"},
            {"name": "Ivory Light", "hex": "#FBF9F3", "role": "background"},
            {"name": "Champagne Soft", "hex": "#F5ECD2", "role": "surface"}
        ],
        neutrals_allowed=True,
        palette_tolerance=30.0
    )
    db.add(profile)
    db.flush()

    # 2. Add Rules (R1 - R7)
    rules_data = [
        BrandRule(
            brand_profile_id=profile.id,
            code="R1",
            category="Terminology",
            title="Approved brand name spelling and casing",
            description="The company name must always be written with exact casing as 'Verity Learning'.",
            rule_type="brand_name",
            severity="medium",
            prefer_term="Verity Learning",
            source_ref="Brand Identity Guide §1.2",
            times_flagged=4,
            times_dismissed=0,
            times_challenged=0
        ),
        BrandRule(
            brand_profile_id=profile.id,
            code="R2",
            category="Claims",
            title="Prohibited absolute outcome claims and guarantees",
            description="Prohibited: '100% guaranteed results' and all absolute outcome variants.",
            rule_type="phrase",
            pattern=r"100\s?%\s*(guaranteed|guarantee|guarantees)\s*(results?|success|outcomes?)?",
            severity="high",
            source_ref="Regulatory Compliance Guide §3.1",
            source_excerpt="Educational providers cannot legally promise guaranteed employment or outcome percentages without accredited disclaimers.",
            times_flagged=8,
            times_dismissed=0,
            times_challenged=0
        ),
        BrandRule(
            brand_profile_id=profile.id,
            code="R3",
            category="Claims",
            title="Unsupported superlatives and comparative claims",
            description="Superlatives like 'best', 'number one', 'fastest', or 'leading' require approved evidence citations.",
            rule_type="claim_policy",
            severity="high",
            source_ref="Marketing Truth in Advertising Policy §4.2",
            times_flagged=6,
            times_dismissed=1,
            times_challenged=1
        ),
        BrandRule(
            brand_profile_id=profile.id,
            code="R4",
            category="Messaging",
            title="Prohibited competitor naming without legal clearance",
            description="Never name competitors directly in marketing communications.",
            rule_type="competitor",
            severity="high",
            source_ref="Legal & Trademark Standards §2.4",
            times_flagged=2,
            times_dismissed=0,
            times_challenged=0
        ),
        BrandRule(
            brand_profile_id=profile.id,
            code="R5",
            category="Messaging",
            title="Mandatory disclaimers and unsubscribe disclosures",
            description="Ads must include 'Terms apply.'; marketing emails must include an unsubscribe notice.",
            rule_type="required_element",
            severity="medium",
            source_ref="Consumer Protection & CAN-SPAM Policy §5.0",
            times_flagged=5,
            times_dismissed=0,
            times_challenged=0
        ),
        BrandRule(
            brand_profile_id=profile.id,
            code="R6",
            category="Tone",
            title="Professional voice, no slang, maximum 1 exclamation mark",
            description="Maintain a professional and trustworthy voice. Prohibit slang like 'guys' and limit exclamation marks.",
            rule_type="regex",
            severity="low",
            source_ref="Editorial Stylebook §2.1",
            times_flagged=12,
            times_dismissed=5,
            times_challenged=3 # Rules possibly unclear candidate!
        ),
        BrandRule(
            brand_profile_id=profile.id,
            code="R7",
            category="Accessibility",
            title="Accessibility: descriptive alt text and WCAG AA contrast (4.5:1)",
            description="All imagery requires descriptive alt text. Text contrast against background must be at least 4.5:1.",
            rule_type="accessibility",
            severity="medium",
            source_ref="Digital Accessibility Standards (WCAG 2.1 AA)",
            times_flagged=3,
            times_dismissed=0,
            times_challenged=0
        )
    ]
    db.add_all(rules_data)

    # 3. Add Approved Facts (F-01 to F-03)
    facts_data = [
        ApprovedFact(
            brand_profile_id=profile.id,
            code="F-01",
            name="Online Learning Platform Support",
            statement="The platform supports online learning.",
            source="Product Documentation v3.4 (Verified Jan 2026)",
            category="Product Capabilities",
            last_updated=now - timedelta(days=30),
            status="approved"
        ),
        ApprovedFact(
            brand_profile_id=profile.id,
            code="F-02",
            name="Class Formats",
            statement="Verity Learning offers live and recorded classes.",
            source="Curriculum Overview 2026",
            category="Curriculum & Delivery",
            last_updated=now - timedelta(days=20),
            status="approved"
        ),
        ApprovedFact(
            brand_profile_id=profile.id,
            code="F-03",
            name="Student Progress Tracking",
            statement="Learners can track their progress in a dashboard.",
            source="Platform Feature Matrix Q1 2026",
            category="Student Experience",
            last_updated=now - timedelta(days=15),
            status="approved"
        )
    ]
    db.add_all(facts_data)

    # 4. Add Terminology
    terms_data = [
        Terminology(
            brand_profile_id=profile.id,
            avoid="users",
            prefer="learners",
            context="Product & Marketing",
            note="We center on human educational growth. Use 'learners' rather than impersonal tech terms like 'users'."
        ),
        Terminology(
            brand_profile_id=profile.id,
            avoid="classes",
            prefer="courses",
            context="Course Catalog",
            note="Use 'courses' when referring to full curriculum offerings; reserve 'classes' only for individual live sessions."
        )
    ]
    db.add_all(terms_data)

    # 5. Visual Assets
    assets_data = [
        VisualAsset(
            brand_profile_id=profile.id,
            name="Midnight Navy",
            asset_type="palette_color",
            hex_color="#0A1128",
            role="primary"
        ),
        VisualAsset(
            brand_profile_id=profile.id,
            name="Verity Gold",
            asset_type="palette_color",
            hex_color="#C8A35A",
            role="accent"
        ),
        VisualAsset(
            brand_profile_id=profile.id,
            name="Ivory Light",
            asset_type="palette_color",
            hex_color="#FBF9F3",
            role="background"
        )
    ]
    db.add_all(assets_data)

    # 6. Guideline Passages (For retrieval Layer 2)
    passages_data = [
        SourcePassage(
            brand_profile_id=profile.id,
            passage_text="Verity Learning is dedicated to providing high-quality, verified educational experiences. Our platform supports online learning through interactive courseware, live mentor sessions, and structured self-paced review.",
            page_number=1,
            heading="Introduction & Core Mission",
            word_count=29
        ),
        SourcePassage(
            brand_profile_id=profile.id,
            passage_text="Marketing communications must never make unverified guarantees. Outright promises of job placement, 100% exam scores, or unconditional results are strictly prohibited by both federal guidelines and our brand charter.",
            page_number=3,
            heading="Claims & Compliance Standards",
            word_count=32
        ),
        SourcePassage(
            brand_profile_id=profile.id,
            passage_text="Always write 'Verity Learning' with capital V and capital L. Refer to our audience as learners rather than users or customers. Tone should be encouraging yet measured.",
            page_number=4,
            heading="Editorial Voice & Nomenclature",
            word_count=29
        )
    ]
    db.add_all(passages_data)

    # 7. Seed Demonstration Submissions (Labeled "Demonstration data")
    # Sub 1: Approved submission with clean history
    sub1_content = "Verity Learning supports online learning with live and recorded classes. Learners can track their progress in a dashboard.\n\nTerms apply."
    sub1_hash = hashlib.sha256(sub1_content.encode("utf-8")).hexdigest()
    sub1 = Submission(
        workspace_id=workspace_id,
        brand_profile_id=profile.id,
        title="Q1 Course Launch Announcement [Demonstration data]",
        content_type="advertisement",
        campaign="Spring 2026 Enrollments",
        status="Approved",
        author_name="Priya Sharma",
        author_role="creator",
        created_at=now - timedelta(days=3),
        updated_at=now - timedelta(days=2)
    )
    db.add(sub1)
    db.flush()

    v1_1 = SubmissionVersion(
        submission_id=sub1.id,
        version_number=1,
        content=sub1_content,
        content_hash=sub1_hash,
        created_at=now - timedelta(days=3)
    )
    db.add(v1_1)
    db.flush()

    dec1 = ReviewDecision(
        submission_id=sub1.id,
        submission_version_id=v1_1.id,
        content_hash=sub1_hash,
        decision="approve",
        reviewer_name="Elena Vance",
        reviewer_role="reviewer",
        reason="Fully compliant with brand terminology, approved facts F-01 & F-02, and required ad disclaimer.",
        created_at=now - timedelta(days=2)
    )
    db.add(dec1)

    comm1 = Comment(
        submission_id=sub1.id,
        submission_version_id=v1_1.id,
        user_name="Elena Vance",
        user_role="reviewer",
        comment_text="Great copy! Cites verified facts and includes the mandatory Terms apply disclaimer.",
        created_at=now - timedelta(days=2)
    )
    db.add(comm1)

    # Sub 2: In Review with resolved and pending findings
    sub2_content = "Verity Learning offers live and recorded classes for all learners."
    sub2_hash = hashlib.sha256(sub2_content.encode("utf-8")).hexdigest()
    sub2 = Submission(
        workspace_id=workspace_id,
        brand_profile_id=profile.id,
        title="Student Welcome Newsletter [Demonstration data]",
        content_type="email",
        campaign="Onboarding Series",
        status="In Review",
        author_name="Marcus Reed",
        author_role="creator",
        created_at=now - timedelta(hours=6),
        updated_at=now - timedelta(hours=2)
    )
    db.add(sub2)
    db.flush()

    v2_1 = SubmissionVersion(
        submission_id=sub2.id,
        version_number=1,
        content=sub2_content,
        content_hash=sub2_hash,
        created_at=now - timedelta(hours=6)
    )
    db.add(v2_1)
    db.flush()

    # Audit events
    db.add(AuditEvent(
        workspace_id=workspace_id,
        submission_id=sub1.id,
        event_type="submission_approved",
        details_json={"version": 1, "reviewer": "Elena Vance"},
        actor_name="Elena Vance",
        actor_role="reviewer",
        version_number=1,
        timestamp=now - timedelta(days=2)
    ))

    db.commit()
    return profile
