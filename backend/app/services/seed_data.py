import hashlib
import bcrypt
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from backend.app.models.verity_models import (
    Workspace, BrandProfile, BrandRule, ApprovedFact, Terminology,
    VisualAsset, SourcePassage, BrandSource, User, Membership, Organisation
)

def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def seed_demo_workspace(db: Session, workspace_id: str) -> BrandProfile:
    """
    Seeds the test workspace with:
    - Test brand profile: "Verity Learning (Test Brand)"
    - Rules R1 to R7 (all initialized with 0 flags)
    - Approved Facts F-01 to F-03
    - Terminology glossary
    - Visual assets
    - Guideline passages & brand sources with owner and version
    - Seeded users for the 4 roles (Creator, Manager, Admin, Reviewer)
    NO fake pre-made submissions or invented authors.
    """
    org = db.query(Organisation).first()
    if not org:
        org = Organisation(name="Verity Governance Org", slug="verity-gov")
        db.add(org)
        db.flush()

    ws = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not ws:
        ws = Workspace(id=workspace_id, organisation_id=org.id, name="Test Brand Workspace", slug="test-brand")
        db.add(ws)
        db.flush()
    elif not ws.organisation_id:
        ws.organisation_id = org.id
        db.flush()

    # Seed the 4 official users
    official_users = [
        {"email": "creator@verity.internal", "name": "Alex Chen (Creator)", "role": "creator"},
        {"email": "manager@verity.internal", "name": "Samira Patel (Manager)", "role": "manager"},
        {"email": "admin@verity.internal", "name": "Jordan Taylor (Admin)", "role": "admin"},
        {"email": "reviewer@verity.internal", "name": "Elena Vance (Reviewer)", "role": "reviewer"},
    ]
    default_pw = hash_password("Password123!")

    for u_info in official_users:
        existing_u = db.query(User).filter(User.email == u_info["email"]).first()
        if not existing_u:
            new_u = User(
                email=u_info["email"],
                name=u_info["name"],
                role=u_info["role"],
                password_hash=default_pw,
                workspace_id=workspace_id,
                is_active=True
            )
            db.add(new_u)
            db.flush()
            db.add(Membership(organisation_id=org.id, user_id=new_u.id, role=u_info["role"]))
        else:
            existing_u.role = u_info["role"]
            existing_u.name = u_info["name"]

    profile = db.query(BrandProfile).filter(BrandProfile.workspace_id == workspace_id).first()
    if profile:
        profile.name = "Verity Learning (Test Brand)"
        db.commit()
        return profile

    # 1. Create Brand Profile (Labelled Test Brand)
    profile = BrandProfile(
        workspace_id=workspace_id,
        name="Verity Learning (Test Brand)",
        tagline="Consistent. Compliant. Trustworthy. (Test Brand)",
        voice_attributes=["professional", "trustworthy", "helpful"],
        audience="learners and parents",
        palette_json=[
            {"name": "Midnight Navy", "hex": "#0A1128", "role": "primary"},
            {"name": "Verity Gold", "hex": "#D4AF37", "role": "accent"},
            {"name": "Ivory Warm", "hex": "#F6F1E7", "role": "background"},
            {"name": "Cream Surface", "hex": "#EFE6D2", "role": "surface"}
        ],
        neutrals_allowed=True,
        palette_tolerance=30.0
    )
    db.add(profile)
    db.flush()

    # 2. Add Rules (R1 - R7) with 0 initial flags
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
            times_flagged=0,
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
            times_flagged=0,
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
            times_flagged=0,
            times_dismissed=0,
            times_challenged=0
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
            times_flagged=0,
            times_dismissed=0,
            times_challenged=0
        ),
        BrandRule(
            brand_profile_id=profile.id,
            code="R5",
            category="Messaging",
            title="Mandatory disclaimer for promotional enrollment offers",
            description="All marketing and advertisements promoting enrollments must include the phrase 'Terms apply.'",
            rule_type="required_element",
            prefer_term="Terms apply.",
            severity="high",
            source_ref="Regulatory Compliance Guide §1.5",
            times_flagged=0,
            times_dismissed=0,
            times_challenged=0
        ),
        BrandRule(
            brand_profile_id=profile.id,
            code="R6",
            category="Tone",
            title="Over-casual slang and excessive exclamation marks",
            description="Avoid informal slang like 'guys' or 'gonna', and restrict exclamation points to at most one per paragraph.",
            rule_type="regex",
            pattern=r"\b(guys|gonna|wanna|kinda)\b|!{2,}",
            severity="low",
            source_ref="Editorial Stylebook §2.1",
            times_flagged=0,
            times_dismissed=0,
            times_challenged=0
        ),
        BrandRule(
            brand_profile_id=profile.id,
            code="R7",
            category="Accessibility",
            title="Descriptive link text and image text alternatives",
            description="Hyperlinks must not use bare 'click here' or 'learn more' without identifying destination context.",
            rule_type="accessibility",
            severity="medium",
            source_ref="Digital Accessibility Standards §5.2",
            times_flagged=0,
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
            name="Platform Learning Formats",
            statement="Verity Learning supports online learning with live and recorded classes.",
            source="Verity Learning Product Specification 2026 §2.1",
            category="Product Facts"
        ),
        ApprovedFact(
            brand_profile_id=profile.id,
            code="F-02",
            name="Learner Progress Analytics",
            statement="Learners can track their progress in a real-time dashboard.",
            source="Verity Learning Product Specification 2026 §4.3",
            category="Product Facts"
        ),
        ApprovedFact(
            brand_profile_id=profile.id,
            code="F-03",
            name="Support Availability Hours",
            statement="Student academic support is available Monday through Friday from 8:00 AM to 8:00 PM IST.",
            source="Operations Manual v3.2 §1.1",
            category="Operations Facts"
        )
    ]
    db.add_all(facts_data)

    # 4. Add Terminology Glossary
    terms_data = [
        Terminology(
            brand_profile_id=profile.id,
            prefer="Verity Learning",
            avoid="Verity learning, verity learning, Verity Edu",
            context="Company brand name",
            note="Always capitalize both V and L."
        ),
        Terminology(
            brand_profile_id=profile.id,
            prefer="learners",
            avoid="users, customers, clients",
            context="Audience designation",
            note="Use 'learners' rather than impersonal terms like 'users'."
        ),
        Terminology(
            brand_profile_id=profile.id,
            prefer="mentors",
            avoid="tutors, trainers",
            context="Instructional staff",
            note="Instructors who guide classes are titled 'mentors'."
        )
    ]
    db.add_all(terms_data)

    # 5. Add Brand Source Documents
    source1 = BrandSource(
        brand_profile_id=profile.id,
        filename="Verity_Learning_Brand_Identity_v2.4.pdf",
        file_type="pdf",
        raw_text="Verity Learning Official Brand Identity Guide. Tone is encouraging, measured, and academic. Always write 'Verity Learning' with capital V and capital L. Refer to our audience as learners rather than users or customers.",
        page_count=18
    )
    source2 = BrandSource(
        brand_profile_id=profile.id,
        filename="Regulatory_Compliance_and_Claims_Policy_2026.docx",
        file_type="docx",
        raw_text="Regulatory Compliance and Truth-in-Advertising Policy. Prohibited: absolute guarantees such as 100% results. Educational outcomes vary based on individual participation. Promotional advertising requires 'Terms apply.'",
        page_count=12
    )
    db.add_all([source1, source2])
    db.flush()

    # 6. Add Guideline Passages
    passages_data = [
        SourcePassage(
            source_id=source1.id,
            brand_profile_id=profile.id,
            passage_text="Never claim 100% guaranteed results, employment placement, or outcome certainty in any public ad copy. Outcomes vary by learner participation.",
            page_number=8,
            heading="Compliance & Claims Standards",
            word_count=23
        ),
        SourcePassage(
            source_id=source2.id,
            brand_profile_id=profile.id,
            passage_text="Always write 'Verity Learning' with capital V and capital L. Refer to our audience as learners rather than users or customers. Tone should be encouraging yet measured.",
            page_number=4,
            heading="Editorial Voice & Nomenclature",
            word_count=29
        )
    ]
    db.add_all(passages_data)

    db.commit()
    return profile
