from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from sqlmodel import SQLModel, Field as SQLField
from sqlalchemy import JSON, Column
from datetime import datetime
import uuid


# ========== REQUEST MODEL ==========


class IdeaRequest(BaseModel):
    idea: str = Field(..., description="The startup idea to analyze")
    analysis_type: str = Field("small", description="'small' (free) or 'full' (1 credit)")
    language: str = Field("en", description="Output language for the report ('en' or 'fr')")


# User class removed - using Supabase table 'users'

class WaitlistRequest(BaseModel):
    email: str = Field(..., description="Email address to add to waitlist")


class ContactRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: str = Field(..., description="Contact email")
    message: str = Field(..., description="Message content")


# ========== ANALYST MODELS ==========

class ScoreCard(BaseModel):
    title: str
    level: str
    description: str


class MarketMetric(BaseModel):
    name: str
    value: str
    change_percentage: str
    note: str
    verified_url: str = Field(..., description="URL source from Tavily that verifies this market metric")


class Keyword(BaseModel):
    term: str
    volume_estimate: str = Field(..., description="Qualitative estimate, e.g., 'High', 'Medium', 'Niche'")
    difficulty_level: str = Field(..., description="Qualitative estimate, e.g., 'Very Competitive', 'Low entry barrier'")


class SEOOpportunity(BaseModel):
    title: str
    subtitle: str
    high_opportunity_keywords: List[Keyword] = Field(..., min_length=1, description="At least one keyword required")


class PersonaDetails(BaseModel):
    age_range: str
    income: str
    education: str
    team_size: str


class PainPoint(BaseModel):
    title: str
    details: str


class IdealCustomerPersona(BaseModel):
    title: str
    subtitle: str
    persona_name: str
    persona_role: str
    persona_department: str
    persona_quote: str
    details: PersonaDetails
    pain_points: List[PainPoint]
    jobs_to_be_done: List[str]
    where_to_find: List[str]


class ScoringBreakdown(BaseModel):
    name: str
    score: float
    max_score: int


class AnalystFooter(BaseModel):
    verdyct_summary: str
    scoring_breakdown: List[ScoringBreakdown]
    data_confidence_level: str = Field(..., description="'High', 'Medium', 'Low' based on verified data availability")
    risk_flags: List[str] = Field(default=[], description="List of critical risks identified (e.g., 'Saturated Market', 'Regulatory Risk')")
    recommendation_title: str
    recommendation_text: str


class Analyst(BaseModel):
    title: str
    analysis_for: str
    score: int
    pcs_score: int = Field(0, description="Predictive Opportunity Score (0-100) calculated deterministically")
    score_card: ScoreCard
    market_metrics: List[MarketMetric] = Field(..., min_length=1, description="At least one market metric required")
    seo_opportunity: SEOOpportunity
    ideal_customer_persona: IdealCustomerPersona
    analyst_footer: AnalystFooter


class AnalystResponse(BaseModel):
    analyst: Analyst


# ========== SPY AGENT MODELS ==========

class AxisLabels(BaseModel):
    label_left: str
    label_right: str


class YAxisLabels(BaseModel):
    label_bottom: str
    label_top: str


class CompetitorPosition(BaseModel):
    name: str
    x_value: int
    y_value: int
    quadrant_label: str
    verified_url: str = Field(..., description="URL source from Tavily that verifies this competitor exists")


class StrategicOpening(BaseModel):
    label: str
    x_value: int
    y_value: int
    quadrant_label: str


class MarketQuadrant(BaseModel):
    x_axis: AxisLabels
    y_axis: YAxisLabels
    competitors: List[CompetitorPosition] = Field(..., min_length=1, description="At least one verified competitor required")
    strategic_opening: StrategicOpening


class Complaint(BaseModel):
    quote: str
    source: str
    competitor: str
    verified_url: str = Field(..., description="URL source from Tavily (Reddit, G2, Capterra) that contains this complaint")


class PainWord(BaseModel):
    term: str
    mentions: int


class CustomerIntel(BaseModel):
    title: str
    subtitle: str
    top_complaints: List[Complaint] = Field(..., min_length=1, description="At least one verified complaint required")
    pain_word_cloud: List[PainWord] = Field(..., min_length=1, description="At least one pain word required")


class AnalysisSummary(BaseModel):
    title: str
    text: str


class VerdyctSummary(BaseModel):
    title: str
    text: str


class HighlightBox(BaseModel):
    value: str
    label: str


class SpyFooter(BaseModel):
    ai_analysis_summary: AnalysisSummary
    verdyct_summary: VerdyctSummary
    highlight_boxes: List[HighlightBox]


class Spy(BaseModel):
    title: str
    score: int
    market_quadrant: MarketQuadrant
    customer_intel: CustomerIntel
    spy_footer: SpyFooter


class SpyResponse(BaseModel):
    spy: Spy


# ========== FINANCIER AGENT MODELS ==========

class PricingTier(BaseModel):
    name: str
    price: str
    features: List[str]
    recommended: bool
    benchmark_competitor: str
    verified_url: str = Field(..., description="URL source from Tavily that verifies this competitor pricing")


class PricingModel(BaseModel):
    title: str
    tiers: List[PricingTier] = Field(..., min_length=1, description="At least one pricing tier required")


class LeverValue(BaseModel):
    value: float
    min: float
    max: float
    step: float


class Levers(BaseModel):
    monthly_price: LeverValue
    ad_spend: LeverValue
    conversion_rate: LeverValue


class Metrics(BaseModel):
    ltv_cac_ratio: str
    status: str
    estimated_cac: str
    estimated_ltv: str


class ProfitEngine(BaseModel):
    levers: Levers
    metrics: Metrics


class RevenueProjection(BaseModel):
    year: str
    revenue: str


class RevenueProjections(BaseModel):
    projections: List[RevenueProjection] = Field(..., min_length=1, description="At least one projection required")


class FinancierFooter(BaseModel):
    verdyct_summary: str
    recommendation_text: str


class Financier(BaseModel):
    title: str
    score: int
    pricing_model: PricingModel
    profit_engine: ProfitEngine
    revenue_projection: RevenueProjections
    financier_footer: FinancierFooter


class FinancierResponse(BaseModel):
    financier: Financier


# ========== ARCHITECT AGENT MODELS ==========

class BuildStat(BaseModel):
    value: str
    label: str


class MVPStatus(BaseModel):
    title: str
    status: str
    subtitle: str
    mvp_screenshot_url: str = ""
    mvp_live_link: str = ""
    mvp_button_text: str = "View MVP"
    build_stats: List[BuildStat] = []


class FlowStep(BaseModel):
    step: int
    action: str


class UserFlow(BaseModel):
    title: str
    steps: List[FlowStep] = Field(..., min_length=1, description="At least one step required")
    figma_button_text: str


class TechCategory(BaseModel):
    name: str
    technologies: List[str] = Field(..., min_length=1, description="At least one technology required")


class TechStack(BaseModel):
    title: str
    categories: List[TechCategory] = Field(..., min_length=1, description="At least one category required")


class TypographyItem(BaseModel):
    use: str
    font: str


class BrandKit(BaseModel):
    title: str
    project_name: str
    color_palette: List[str] = Field(..., min_length=1, description="At least one color required")
    typography: List[TypographyItem] = Field(..., min_length=1, description="At least one typography item required")


class DataMoatFeature(BaseModel):
    title: str
    description: str


class DataMoat(BaseModel):
    title: str
    status: str
    features: List[DataMoatFeature] = Field(..., min_length=1, description="At least one feature required")


class ScoringBreakdownItem(BaseModel):
    name: str
    score: float
    max_score: int


class ArchitectFooter(BaseModel):
    verdyct_summary: str
    scoring_breakdown: List[ScoringBreakdownItem] = Field(..., min_length=1, description="At least one scoring item required")
    recommendation_text: str


class Architect(BaseModel):
    title: str
    score: int
    mvp_status: MVPStatus
    user_flow: UserFlow
    tech_stack: TechStack
    brand_kit: BrandKit
    data_moat: DataMoat
    architect_footer: ArchitectFooter



class ArchitectResponse(BaseModel):
    architect: Architect


# ========== RESCUE PLAN MODEL ==========

class RescueOption(BaseModel):
    title: str
    description: str
    ai_suggested_prompt: str = Field(..., description="Short, clickable idea string (5-10 words) for the user to re-analyze")

class RescuePlan(BaseModel):
    improve: RescueOption
    pivot: RescueOption

# ========== ORCHESTRATOR MODEL ==========

class Agents(BaseModel):
    analyst: Analyst
    spy: Optional[Spy] = None
    financier: Optional[Financier] = None
    architect: Optional[Architect] = None


class VerdyctReportResponse(BaseModel):
    report_id: str
    project_id: str = Field(..., description="The ID of the created project")
    submitted_at: str
    status: str = Field(..., description="'approved' or 'rejected'")
    pcs_score: int
    global_summary: str
    agents: Agents
    rescue_plan: Optional[RescuePlan] = None


# ========== PIXEL & WATCHDOG MODELS ==========



class PixelEvent(SQLModel, table=True):
    id: Optional[int] = SQLField(default=None, primary_key=True)
    project_id: str = SQLField(index=True)
    event_type: str = "CLICK"
    element_id: Optional[str] = None
    element_text: Optional[str] = None
    element_class: Optional[str] = None
    tag_name: Optional[str] = None
    page_url: str
    timestamp: datetime = SQLField(default_factory=datetime.utcnow)

class Project(SQLModel, table=True):
    id: str = SQLField(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str
    raw_idea: str
    pos_score: float = 0.0
    status: str = "draft"
    api_key: str = SQLField(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = SQLField(default_factory=datetime.utcnow)
    
    # Pixel config
    url: Optional[str] = None
    cta_text: Optional[str] = None
    cta_selector: Optional[str] = None
    last_verified: Optional[str] = None
    
    # Full Report Storage
    report_json: Optional[Dict] = SQLField(default=None, sa_column=Column(JSON))
    
    # User Ownership
    user_id: str = SQLField(index=True)
    
    # Leaderboard / Social
    is_public: bool = SQLField(default=False)
    upvotes: int = SQLField(default=0)
    views: int = SQLField(default=0)

class ProjectUpdate(BaseModel):
    name: Optional[str] = None


# ========== TIMELINE MODELS ==========

class Timeline(SQLModel, table=True):
    id: str = SQLField(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    project_id: str = SQLField(index=True)
    status: str = "active"  # active, completed
    goal: str = Field(..., description="The user's final objective")
    context: Dict = SQLField(default={}, sa_column=Column(JSON))
    created_at: datetime = SQLField(default_factory=datetime.utcnow)

class TimelineStep(SQLModel, table=True):
    id: str = SQLField(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    timeline_id: str = SQLField(index=True)
    order_index: int
    title: str
    description: str
    status: str = "locked"  # locked, active, completed
    content: str  # Detailed instructions
    created_at: datetime = SQLField(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

class TimelineMessage(SQLModel, table=True):
    id: str = SQLField(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    timeline_id: str = SQLField(index=True)
    step_id: Optional[str] = SQLField(default=None, index=True)
    role: str  # user, assistant
    content: str
    created_at: datetime = SQLField(default_factory=datetime.utcnow)
