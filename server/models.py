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
    keyword: str
    opportunity_level: str
    # PHASE 2 ENHANCEMENTS
    search_volume: Optional[str] = None  # e.g., "1,200/mo" or "500-1000/mo"
    difficulty: Optional[str] = None  # "Easy", "Medium", "Hard"
    top_ranker_1: Optional[str] = None  # Who currently ranks #1
    top_ranker_2: Optional[str] = None
    top_ranker_3: Optional[str] = None


class SEOOpportunity(BaseModel):
    title: str
    subtitle: str
    high_opportunity_keywords: List[Keyword] = Field(..., min_length=1, description="At least one keyword required")
    # PHASE 2 ENHANCEMENTS
    content_gap_insight: Optional[str] = None  # e.g., "Competitors rank for X but ignore Y"
    organic_traffic_potential: Optional[str] = None  # e.g., "2,500-4,000 monthly visitors if ranked #1"


# ========== MODULAR ANALYST STEPS ==========




# ========== ANALYST RESPONSE ==========

class CriticalAssumption(BaseModel):
    assumption: str  # e.g., "Customers will pay $X/month"
    validation_method: str  # e.g., "Run pricing survey with 50 target users"
    priority: str  # "Critical", "High", "Medium"


class DerisingMilestone(BaseModel):
    stage: str  # e.g., "Before building", "Before scaling"
    milestone: str  # e.g., "20 customer interviews"


class RedFlag(BaseModel):
    condition: str  # e.g., "If CAC > $200 after 6 months"
    action: str  # e.g., "Pivot channels"


class RiskValidation(BaseModel):
    critical_assumptions: List[CriticalAssumption]
    derisking_milestones: List[DerisingMilestone]
    red_flags: List[RedFlag]


# ========== PHASE 3: JTBD + MARKETING PLAYBOOK MODELS ==========

class FunctionalJob(BaseModel):
    job: str  # e.g., "Manage team communication efficiently"
    success_metrics: List[str]  # How they measure if product solved this
    current_alternatives: List[str]  # What they use today
    switching_cost: str  # How hard to change from current solution


class EmotionalJob(BaseModel):
    job: str  # e.g., "Feel in control of my work"
    messaging_angle: str  # How to use in marketing


class SocialJob(BaseModel):
    job: str  # e.g., "Look like an innovative leader to my team"
    word_of_mouth_trigger: str  # What makes them tell others


class JTBDDeepDive(BaseModel):
    functional_job: FunctionalJob
    emotional_job: EmotionalJob
    social_job: SocialJob


class BuyingTrigger(BaseModel):
    trigger: str  # e.g., "Free trial", "Case studies"
    campaign_idea: str  # e.g., "Run 14-day trial campaign"


class ContentPreference(BaseModel):
    preference: str  # e.g., "Video tutorials", "Blog posts"
    strategy: str  # e.g., "YouTube/TikTok strategy", "SEO content calendar"


class ObjectionHandler(BaseModel):
    objection: str  # e.g., "Too expensive"
    response: str  # e.g., "Show ROI calculator"


class MarketingPlaybook(BaseModel):
    buying_triggers: List[BuyingTrigger]
    content_strategy: List[ContentPreference]
    objection_handling: List[ObjectionHandler]


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


# ========== PREMIUM FEATURES MODELS ==========

class CompetitorPreview(BaseModel):
    name: str
    market_position: str  # "Market Leader", "Emerging Player", "Niche Specialist", "Legacy Provider"
    pricing_tier: str  # "Low ($)", "Medium ($$)", "High ($$$)", "Enterprise ($$$$)"
    key_strength: str
    verified_url: str


class UnitEconomicsPreview(BaseModel):
    estimated_cac_range: str  # e.g., "$120-$180"
    estimated_ltv_range: str  # e.g., "$500-$800"
    ltv_cac_ratio: str  # e.g., "4.5x" or "3.5-5.0x"
    health_assessment: str  # "Healthy (>3x)", "Moderate (2-3x)", "Concerning (<2x)"
    confidence_level: str  # "High", "Medium", "Low"
    key_assumption: str


class MarketSegment(BaseModel):
    segment_name: str  # e.g., "Enterprise (500+)", "SMB (10-500)", "Individual Prosumers"
    market_size: str  # e.g., "$12.5B" or "40% of TAM"
    percentage_of_total: str  # e.g., "40%"
    growth_rate: str  # e.g., "18% CAGR"
    attractiveness: str  # "High", "Medium", "Low"
    rationale: str


class GTMChannel(BaseModel):
    channel_name: str
    roi_potential: str  # "High", "Medium", "Low"
    estimated_cac: str
    time_to_results: str
    initial_budget: str
    why_this_channel: str


class GTMActionPlan(BaseModel):
    recommended_channels: List[GTMChannel]
    week_1_2_actions: List[str]
    week_3_4_actions: List[str]
    month_2_actions: List[str]
    month_3_actions: List[str]
    budget_minimum: str
    budget_recommended: str
    budget_aggressive: str
    success_metrics: List[str]



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
    market_overview: str = Field(..., description="The executive summary / thesis of the analysis")
    
    # PREMIUM FEATURES (PHASE 1)
    competitors_preview: Optional[List[CompetitorPreview]] = None
    unit_economics_preview: Optional[UnitEconomicsPreview] = None
    market_segments: Optional[List[MarketSegment]] = None
    gtm_action_plan: Optional[GTMActionPlan] = None
    
    # PREMIUM FEATURES (PHASE 2)
    risk_validation: Optional[RiskValidation] = None
    
    # PREMIUM FEATURES (PHASE 3)
    jtbd_deep_dive: Optional[JTBDDeepDive] = None
    marketing_playbook: Optional[MarketingPlaybook] = None



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
    competitors: List[CompetitorPosition] = Field(description="List of verified competitors (can be empty)")
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
    top_complaints: List[Complaint] = Field(description="List of verified complaints (can be empty)")
    pain_word_cloud: List[PainWord] = Field(description="Pain word frequency (can be empty)")


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


# ========== PREMIUM SPY FEATURES (NEW) ==========

# Feature Comparison Matrix
class CompetitorStatus(BaseModel):
    name: str
    status: str  # ✅, ❌, 🔄

class FeatureRow(BaseModel):
    feature_name: str
    user_product: str
    competitors: List[CompetitorStatus] # Replaced Dict[str, str] with List for Structured Outputs support
    strategic_note: Optional[str] = None
    verified_url: str

class FeatureComparisonMatrix(BaseModel):
    title: str
    subtitle: str
    feature_rows: List[FeatureRow]
    key_differentiator: str

# Pricing Comparison
class PricingTier(BaseModel):
    tier_name: str
    price: str
    key_features: List[str]

class CompetitorPricing(BaseModel):
    competitor_name: str
    tiers: List[PricingTier]
    verified_url: str

class PricingComparison(BaseModel):
    title: str
    subtitle: str
    recommended_positioning: str
    competitors_pricing: List[CompetitorPricing]

# Sentiment Breakdown
class ReviewSource(BaseModel):
    source: str
    positive_mentions: int
    negative_mentions: int
    neutral_mentions: int
    top_positive_theme: Optional[str] = None
    top_negative_theme: Optional[str] = None

class SentimentBreakdown(BaseModel):
    title: str
    overall_sentiment_score: int
    sources: List[ReviewSource]
    key_insight: str

# Gap Opportunities
class GapOpportunity(BaseModel):
    opportunity_title: str
    description: str
    impact_level: str
    competitor_coverage: str
    verified_url: str

class GapAnalysis(BaseModel):
    title: str
    subtitle: str
    opportunities: List[GapOpportunity]

# ========== END PREMIUM FEATURES ==========

class Spy(BaseModel):
    title: str
    score: int
    market_quadrant: MarketQuadrant
    customer_intel: CustomerIntel
    spy_footer: SpyFooter
    
    # Premium Features (Optional for backward compatibility)
    feature_comparison_matrix: Optional[FeatureComparisonMatrix] = None
    pricing_comparison: Optional[PricingComparison] = None
    sentiment_breakdown: Optional[SentimentBreakdown] = None
    gap_opportunities: Optional[GapAnalysis] = None


# ========== END PREMIUM FEATURES ==========

class Spy(BaseModel):
    title: str
    score: int
    market_quadrant: MarketQuadrant
    customer_intel: CustomerIntel
    spy_footer: SpyFooter
    
    # Premium Features (Optional for backward compatibility)
    feature_comparison_matrix: Optional[FeatureComparisonMatrix] = None
    pricing_comparison: Optional[PricingComparison] = None
    sentiment_breakdown: Optional[SentimentBreakdown] = None
    gap_opportunities: Optional[GapAnalysis] = None



# ========== MODULAR ANALYST STEPS ==========

class AnalystCore(BaseModel):
    """Step 1: Core Foundation (The Brain)"""
    market_metrics: List[MarketMetric] = Field(..., min_length=1)
    value_proposition: str
    ideal_customer_persona: IdealCustomerPersona
    competitors_preview: List[CompetitorPreview]
    market_overview: str # Summary of the landscape


class AnalystStrategy(BaseModel):
    """Step 2: Market Logic (The Strategist)"""
    market_segments: List[MarketSegment]
    marketing_playbook: MarketingPlaybook
    gtm_action_plan: GTMActionPlan
    unit_economics_preview: UnitEconomicsPreview


class AnalystValidation(BaseModel):
    """Step 3: Risk & Validation (The Skeptic)"""
    risk_validation: RiskValidation
    seo_opportunity: SEOOpportunity
    score_card: ScoreCard
    analyst_footer: AnalystFooter
    pcs_score: int


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
    break_even_users: str # Required (Placeholder allowed)
    projected_runway_months: str # Required (Placeholder allowed)

class ProfitEngine(BaseModel):
    title: str
    levers: Levers
    metrics: Metrics

class ProjectionItem(BaseModel):
    year: str
    revenue: str
    profit: str
    customers: str

class RevenueProjection(BaseModel):
    projections: List[ProjectionItem]

# NEW: Cost Structure Model
class CostCategory(BaseModel):
    name: str
    monthly_amount: float
    is_variable: bool

class FinancialRoadmapPhase(BaseModel):
    phase_name: str
    duration_months: int
    required_budget: str
    milestone_goal: str

class FinancierFooter(BaseModel):
    verdyct_summary: str
    recommendation_text: str

class Financier(BaseModel):
    title: str
    score: int
    pricing_model: PricingModel
    profit_engine: ProfitEngine
    revenue_projection: RevenueProjection
    financier_footer: FinancierFooter
    # Premium / Enhanced Fields - REQUIRED for Strict Mode
    cost_structure: List[CostCategory]
    financial_roadmap: List[FinancialRoadmapPhase]


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


class MVPMilestone(BaseModel):
    phase: str
    duration: str
    deliverables: List[str] = Field(..., min_length=1)


class TechRisk(BaseModel):
    risk: str
    impact: str  # Low, Medium, High
    mitigation: str


class ScalabilityStrategy(BaseModel):
    title: str
    description: str


class ComplianceItem(BaseModel):
    requirement: str
    status: str  # Required, Recommended
    action: str


class Integration(BaseModel):
    name: str # e.g., Stripe, Auth0
    category: str # Payment, Auth
    justification: str


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
    # Enhanced Fields (Mini-CTO)
    mvp_roadmap: List[MVPMilestone] = []
    tech_risks: List[TechRisk] = []
    scalability_strategy: List[ScalabilityStrategy] = []
    compliance_checklist: List[ComplianceItem] = []
    recommended_integrations: List[Integration] = []
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
