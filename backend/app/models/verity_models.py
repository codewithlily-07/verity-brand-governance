import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def gen_uuid():
    return str(uuid.uuid4())

def utcnow():
    return datetime.now(timezone.utc)

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(255), default="Default Workspace")
    is_demo = Column(Boolean, default=True)
    settings_json = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    brand_profiles = relationship("BrandProfile", back_populates="workspace", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="workspace", cascade="all, delete-orphan")
    audit_events = relationship("AuditEvent", back_populates="workspace", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    role = Column(String(50), default="creator")  # creator | reviewer | admin
    created_at = Column(DateTime(timezone=True), default=utcnow)

class BrandProfile(Base):
    __tablename__ = "brand_profiles"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    name = Column(String(255), nullable=False)
    tagline = Column(String(255), nullable=True)
    voice_attributes = Column(JSON, default=list) # e.g. ["professional", "trustworthy", "helpful"]
    audience = Column(String(255), nullable=True)
    palette_json = Column(JSON, default=list) # [{name, hex, role}]
    neutrals_allowed = Column(Boolean, default=True)
    palette_tolerance = Column(Float, default=30.0)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    workspace = relationship("Workspace", back_populates="brand_profiles")
    sources = relationship("BrandSource", back_populates="brand_profile", cascade="all, delete-orphan")
    passages = relationship("SourcePassage", back_populates="brand_profile", cascade="all, delete-orphan")
    rules = relationship("BrandRule", back_populates="brand_profile", cascade="all, delete-orphan")
    facts = relationship("ApprovedFact", back_populates="brand_profile", cascade="all, delete-orphan")
    terms = relationship("Terminology", back_populates="brand_profile", cascade="all, delete-orphan")
    visual_assets = relationship("VisualAsset", back_populates="brand_profile", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="brand_profile")

class BrandSource(Base):
    __tablename__ = "brand_sources"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    brand_profile_id = Column(String(36), ForeignKey("brand_profiles.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False) # pdf | docx | txt
    raw_text = Column(Text, nullable=False)
    page_count = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    brand_profile = relationship("BrandProfile", back_populates="sources")
    passages = relationship("SourcePassage", back_populates="source", cascade="all, delete-orphan")

class SourcePassage(Base):
    __tablename__ = "source_passages"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    source_id = Column(String(36), ForeignKey("brand_sources.id"), nullable=True)
    brand_profile_id = Column(String(36), ForeignKey("brand_profiles.id"), nullable=False)
    passage_text = Column(Text, nullable=False)
    page_number = Column(Integer, default=1)
    heading = Column(String(255), default="General Guideline")
    word_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    source = relationship("BrandSource", back_populates="passages")
    brand_profile = relationship("BrandProfile", back_populates="passages")

class BrandRule(Base):
    __tablename__ = "brand_rules"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    brand_profile_id = Column(String(36), ForeignKey("brand_profiles.id"), nullable=False)
    code = Column(String(50), nullable=False) # e.g. R1, R2, TONE-01
    category = Column(String(50), nullable=False) # Claims, Facts, Messaging, Terminology, Tone, Visual, Accessibility
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    rule_type = Column(String(50), nullable=False) # phrase | regex | term_map | competitor | required_element | claim_policy | brand_name | accessibility
    pattern = Column(Text, nullable=True)
    prefer_term = Column(String(255), nullable=True)
    avoid_term = Column(String(255), nullable=True)
    severity = Column(String(20), default="medium") # high | medium | low
    is_active = Column(Boolean, default=True)
    fix_template = Column(Text, nullable=True)
    source_ref = Column(String(255), default="Brand Guidelines")
    source_excerpt = Column(Text, default="")
    times_flagged = Column(Integer, default=0)
    times_dismissed = Column(Integer, default=0)
    times_challenged = Column(Integer, default=0)

    brand_profile = relationship("BrandProfile", back_populates="rules")

class ApprovedFact(Base):
    __tablename__ = "approved_facts"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    brand_profile_id = Column(String(36), ForeignKey("brand_profiles.id"), nullable=False)
    code = Column(String(50), nullable=False) # e.g. F-01
    name = Column(String(255), nullable=False)
    statement = Column(Text, nullable=False)
    source = Column(String(255), nullable=False)
    category = Column(String(100), default="Product Facts")
    last_updated = Column(DateTime(timezone=True), default=utcnow)
    status = Column(String(50), default="approved") # approved | deprecated

    brand_profile = relationship("BrandProfile", back_populates="facts")

class Terminology(Base):
    __tablename__ = "terminology"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    brand_profile_id = Column(String(36), ForeignKey("brand_profiles.id"), nullable=False)
    avoid = Column(String(255), nullable=False)
    prefer = Column(String(255), nullable=False)
    context = Column(String(255), nullable=True)
    note = Column(Text, nullable=True)

    brand_profile = relationship("BrandProfile", back_populates="terms")

class VisualAsset(Base):
    __tablename__ = "visual_assets"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    brand_profile_id = Column(String(36), ForeignKey("brand_profiles.id"), nullable=False)
    name = Column(String(255), nullable=False)
    asset_type = Column(String(50), default="palette_color") # palette_color | logo
    hex_color = Column(String(20), nullable=True)
    role = Column(String(50), default="primary")
    created_at = Column(DateTime(timezone=True), default=utcnow)

    brand_profile = relationship("BrandProfile", back_populates="visual_assets")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    brand_profile_id = Column(String(36), ForeignKey("brand_profiles.id"), nullable=False)
    title = Column(String(255), nullable=False)
    content_type = Column(String(50), default="social") # social | advertisement | email | website | press_release | document
    campaign = Column(String(255), nullable=True)
    status = Column(String(50), default="Draft") # Draft | Submitted | In Review | Changes Requested | Resubmitted | Approved | Rejected
    author_name = Column(String(255), default="Creator")
    author_role = Column(String(50), default="creator")
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    workspace = relationship("Workspace", back_populates="submissions")
    brand_profile = relationship("BrandProfile", back_populates="submissions")
    versions = relationship("SubmissionVersion", back_populates="submission", cascade="all, delete-orphan", order_by="SubmissionVersion.version_number")
    comments = relationship("Comment", back_populates="submission", cascade="all, delete-orphan")
    decisions = relationship("ReviewDecision", back_populates="submission", cascade="all, delete-orphan")

class SubmissionVersion(Base):
    __tablename__ = "submission_versions"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False)
    version_number = Column(Integer, nullable=False, default=1)
    content = Column(Text, nullable=False)
    content_hash = Column(String(64), nullable=False)
    image_meta_json = Column(JSON, default=dict)
    fg_color = Column(String(20), nullable=True)
    bg_color = Column(String(20), nullable=True)
    alt_text = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    submission = relationship("Submission", back_populates="versions")
    analysis_runs = relationship("AnalysisRun", back_populates="submission_version", cascade="all, delete-orphan")
    decisions = relationship("ReviewDecision", back_populates="submission_version")

class AnalysisRun(Base):
    __tablename__ = "analysis_runs"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    submission_version_id = Column(String(36), ForeignKey("submission_versions.id"), nullable=False)
    stage = Column(String(50), default="completed") # extract | rules | retrieval | ai | verify | completed
    mode_flags_json = Column(JSON, default=dict) # {rules: "ok", retrieval: "ok"|"fts_only", ai: "ok"|"unavailable"|"skipped"}
    duration_ms = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    submission_version = relationship("SubmissionVersion", back_populates="analysis_runs")
    findings = relationship("Finding", back_populates="analysis_run", cascade="all, delete-orphan")

class Finding(Base):
    __tablename__ = "findings"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    analysis_run_id = Column(String(36), ForeignKey("analysis_runs.id"), nullable=False)
    category = Column(String(50), nullable=False) # Claims, Facts, Messaging, Terminology, Tone, Visual, Accessibility
    severity = Column(String(20), nullable=False) # high | medium | low
    title = Column(String(255), nullable=False)
    quote = Column(Text, nullable=False)
    start_offset = Column(Integer, nullable=True)
    end_offset = Column(Integer, nullable=True)
    rule_id = Column(String(50), nullable=True)
    rule_text = Column(Text, nullable=True)
    evidence_json = Column(JSON, default=dict) # {passage_id, fact_id, statement, source, last_updated, verdict, text}
    explanation = Column(Text, nullable=False)
    suggested_replacement = Column(Text, nullable=True)
    rationale = Column(Text, nullable=True)
    verdict = Column(String(50), nullable=False) # verified_rule_violation | source_backed_concern | needs_human_review
    confidence = Column(Float, default=1.0)
    layer = Column(String(20), default="rules") # rules | retrieval | ai
    status = Column(String(30), default="open") # open | accepted | edited | dismissed | challenged
    user_edited_replacement = Column(Text, nullable=True)
    dismiss_reason = Column(Text, nullable=True)
    challenge_reason = Column(Text, nullable=True)
    decided_by = Column(String(255), nullable=True)
    decided_at = Column(DateTime(timezone=True), nullable=True)

    analysis_run = relationship("AnalysisRun", back_populates="findings")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False)
    submission_version_id = Column(String(36), ForeignKey("submission_versions.id"), nullable=True)
    user_name = Column(String(255), nullable=False)
    user_role = Column(String(50), default="reviewer")
    comment_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    submission = relationship("Submission", back_populates="comments")

class ReviewDecision(Base):
    __tablename__ = "review_decisions"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False)
    submission_version_id = Column(String(36), ForeignKey("submission_versions.id"), nullable=False)
    content_hash = Column(String(64), nullable=False)
    decision = Column(String(30), nullable=False) # approve | reject | request_changes
    reviewer_name = Column(String(255), nullable=False)
    reviewer_role = Column(String(50), default="reviewer")
    reason = Column(Text, nullable=True)
    override_used = Column(Boolean, default=False)
    override_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    submission = relationship("Submission", back_populates="decisions")
    submission_version = relationship("SubmissionVersion", back_populates="decisions")

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    submission_id = Column(String(36), nullable=True)
    event_type = Column(String(100), nullable=False)
    details_json = Column(JSON, default=dict)
    actor_name = Column(String(255), default="System")
    actor_role = Column(String(50), default="system")
    version_number = Column(Integer, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=utcnow)

    workspace = relationship("Workspace", back_populates="audit_events")
