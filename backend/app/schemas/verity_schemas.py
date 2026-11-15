from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class WorkspaceResponse(BaseModel):
    id: str
    name: str
    is_demo: bool
    created_at: datetime
    settings_json: Dict[str, Any] = {}

    class Config:
        from_attributes = True

class RuleSchema(BaseModel):
    id: Optional[str] = None
    code: str
    category: str
    title: str
    description: str
    rule_type: str
    pattern: Optional[str] = None
    prefer_term: Optional[str] = None
    avoid_term: Optional[str] = None
    severity: str = "medium"
    is_active: bool = True
    fix_template: Optional[str] = None
    source_ref: Optional[str] = "Brand Guidelines"
    source_excerpt: Optional[str] = ""
    times_flagged: int = 0
    times_dismissed: int = 0
    times_challenged: int = 0

    class Config:
        from_attributes = True

class FactSchema(BaseModel):
    id: Optional[str] = None
    code: str
    name: str
    statement: str
    source: str
    category: str = "Product Facts"
    last_updated: Optional[datetime] = None
    status: str = "approved"

    class Config:
        from_attributes = True

class TermSchema(BaseModel):
    id: Optional[str] = None
    avoid: str
    prefer: str
    context: Optional[str] = None
    note: Optional[str] = None

    class Config:
        from_attributes = True

class VisualAssetSchema(BaseModel):
    id: Optional[str] = None
    name: str
    asset_type: str = "palette_color"
    hex_color: Optional[str] = None
    role: str = "primary"

    class Config:
        from_attributes = True

class BrandSourceSchema(BaseModel):
    id: Optional[str] = None
    filename: str
    file_type: str = "pdf"
    page_count: int = 1
    owner: str = "Brand Governance / Legal"
    version: str = "v2.4"
    status: str = "Current"
    passages_count: int = 0

    class Config:
        from_attributes = True

class BrandProfileResponse(BaseModel):
    id: str
    workspace_id: str
    name: str
    tagline: Optional[str] = None
    voice_attributes: List[str] = []
    audience: Optional[str] = None
    palette_json: List[Dict[str, Any]] = []
    rules: List[RuleSchema] = []
    facts: List[FactSchema] = []
    terms: List[TermSchema] = []
    visual_assets: List[VisualAssetSchema] = []
    sources: List[BrandSourceSchema] = []

    class Config:
        from_attributes = True

class SubmissionCreate(BaseModel):
    title: str
    content_type: str = "social"
    campaign: Optional[str] = None
    content: str
    fg_color: Optional[str] = None
    bg_color: Optional[str] = None
    alt_text: Optional[str] = None
    author_name: str = "Creator"
    author_role: str = "creator"

class SubmissionVersionResponse(BaseModel):
    id: str
    submission_id: str
    version_number: int
    content: str
    content_hash: str
    fg_color: Optional[str] = None
    bg_color: Optional[str] = None
    alt_text: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class FindingResponse(BaseModel):
    id: str
    category: str
    severity: str
    title: str
    quote: str
    start_offset: Optional[int] = None
    end_offset: Optional[int] = None
    rule_id: Optional[str] = None
    rule_text: Optional[str] = None
    evidence: Dict[str, Any] = {}
    explanation: str
    suggested_replacement: Optional[str] = None
    rationale: Optional[str] = None
    verdict: str
    confidence: float
    layer: str
    status: str = "open"
    user_edited_replacement: Optional[str] = None
    dismiss_reason: Optional[str] = None
    challenge_reason: Optional[str] = None

class FindingPatchRequest(BaseModel):
    status: str # accepted | edited | dismissed | challenged | open
    user_edited_replacement: Optional[str] = None
    dismiss_reason: Optional[str] = None
    challenge_reason: Optional[str] = None
    decided_by: Optional[str] = "Reviewer"

class AnalysisResultResponse(BaseModel):
    submission_id: str
    version_id: str
    version_number: int
    content_hash: str
    findings: List[FindingResponse]
    verified_checks: List[Dict[str, Any]] = []
    layers: Dict[str, str]
    stats: Dict[str, Any]

class ReviewDecisionRequest(BaseModel):
    version_id: str
    decision: str # approve | reject | request_changes
    reviewer_name: str = "Senior Reviewer"
    reviewer_role: str = "reviewer"
    reason: Optional[str] = None
    override_used: bool = False
    override_reason: Optional[str] = None

class ReviewDecisionResponse(BaseModel):
    id: str
    submission_id: str
    submission_version_id: str
    content_hash: str
    decision: str
    reviewer_name: str
    reviewer_role: str
    reason: Optional[str] = None
    override_used: bool = False
    override_reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    submission_version_id: Optional[str] = None
    user_name: str = "Reviewer"
    user_role: str = "reviewer"
    comment_text: str

class CommentResponse(BaseModel):
    id: str
    submission_id: str
    submission_version_id: Optional[str] = None
    user_name: str
    user_role: str
    comment_text: str
    created_at: datetime

    class Config:
        from_attributes = True

class SubmissionDetailResponse(BaseModel):
    id: str
    workspace_id: str
    brand_profile_id: str
    title: str
    content_type: str
    campaign: Optional[str] = None
    status: str
    author_name: str
    author_role: str
    created_at: datetime
    updated_at: datetime
    current_version: Optional[SubmissionVersionResponse] = None
    versions: List[SubmissionVersionResponse] = []
    decisions: List[ReviewDecisionResponse] = []
    comments: List[CommentResponse] = []

    class Config:
        from_attributes = True

class GovernanceInsightsResponse(BaseModel):
    total_submissions: int
    approved_count: int
    changes_requested_count: int
    rejected_count: int
    in_review_count: int
    high_severity_count: int
    total_findings_resolved: int
    average_decision_time_minutes: float
    common_categories: List[Dict[str, Any]]
    most_violated_rules: List[Dict[str, Any]]
    rules_possibly_unclear: List[Dict[str, Any]]
    resolution_rate: float
    pre_review_fix_rate: float

class AIStatusResponse(BaseModel):
    provider: str
    model: str
    has_api_key: bool
    status: str
    message: str
