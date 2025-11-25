import uuid
from datetime import datetime
import json
from models import (
    Analyst, Spy, Financier, Architect, Agents, VerdyctReportResponse,
    ScoreCard, MarketMetric, SEOOpportunity, IdealCustomerPersona, AnalystFooter,
    MarketQuadrant, CustomerIntel, SpyFooter,
    PricingModel, ProfitEngine, RevenueProjections, FinancierFooter,
    MVPStatus, UserFlow, TechStack, BrandKit, DataMoat, ArchitectFooter,
    Keyword, PersonaDetails, PainPoint, ScoringBreakdown,
    AxisLabels, YAxisLabels, CompetitorPosition, StrategicOpening, Complaint, PainWord, AnalysisSummary, VerdyctSummary, HighlightBox,
    PricingTier, Levers, LeverValue, Metrics, RevenueProjection,
    BuildStat, FlowStep, TechCategory, TypographyItem, DataMoatFeature, ScoringBreakdownItem
)

def test_structure():
    # 1. Create Dummy Analyst
    analyst = Analyst(
        title="Analyst Title",
        analysis_for="Idea",
        score=80,
        pcs_score=75,
        score_card=ScoreCard(title="A", level="High", description="Good"),
        market_metrics=[MarketMetric(name="TAM", value="1B", change_percentage="10%", note="Big", verified_url="http://url")],
        seo_opportunity=SEOOpportunity(title="SEO", subtitle="Sub", high_opportunity_keywords=[Keyword(term="kwd", volume_estimate="High", difficulty_level="Hard")]),
        ideal_customer_persona=IdealCustomerPersona(
            title="ICP", subtitle="Sub", persona_name="Bob", persona_role="Dev", persona_department="IT", persona_quote="I code",
            details=PersonaDetails(age_range="20-30", income="100k", education="BS", team_size="10"),
            pain_points=[PainPoint(title="Pain", details="Ouch")],
            jobs_to_be_done=["Code"], where_to_find=["GitHub"]
        ),
        analyst_footer=AnalystFooter(verdyct_summary="Analyst Summary", scoring_breakdown=[ScoringBreakdown(name="Mkt", score=10, max_score=10)], recommendation_title="Go", recommendation_text="Do it")
    )

    # 2. Create Dummy Spy
    spy = Spy(
        title="Spy Title",
        score=70,
        market_quadrant=MarketQuadrant(
            x_axis=AxisLabels(label_left="Low", label_right="High"),
            y_axis=YAxisLabels(label_bottom="Low", label_top="High"),
            competitors=[CompetitorPosition(name="Comp1", x_value=10, y_value=10, quadrant_label="Q1", verified_url="http://url")],
            strategic_opening=StrategicOpening(label="Open", x_value=90, y_value=90, quadrant_label="Q4")
        ),
        customer_intel=CustomerIntel(
            title="Intel", subtitle="Sub",
            top_complaints=[Complaint(quote="Bad", source="Reddit", competitor="Comp1", verified_url="http://url")],
            pain_word_cloud=[PainWord(term="Slow", mentions=10)]
        ),
        spy_footer=SpyFooter(
            ai_analysis_summary=AnalysisSummary(title="AI", text="Summary"),
            verdyct_summary=VerdyctSummary(title="Verdyct", text="Spy Summary"),
            highlight_boxes=[HighlightBox(value="10", label="Complaints")]
        )
    )

    # 3. Create Dummy Financier
    financier = Financier(
        title="Financier Title",
        score=90,
        pricing_model=PricingModel(
            title="Pricing",
            tiers=[PricingTier(name="Basic", price="10", features=["F1"], recommended=True, benchmark_competitor="Comp1", verified_url="http://url")]
        ),
        profit_engine=ProfitEngine(
            levers=Levers(
                monthly_price=LeverValue(value=10, min=5, max=20, step=1),
                ad_spend=LeverValue(value=100, min=50, max=200, step=10),
                conversion_rate=LeverValue(value=0.05, min=0.01, max=0.1, step=0.01)
            ),
            metrics=Metrics(ltv_cac_ratio="3:1", status="Healthy", estimated_cac="50", estimated_ltv="150")
        ),
        revenue_projection=RevenueProjections(projections=[RevenueProjection(year="Y1", revenue="100k")]),
        financier_footer=FinancierFooter(verdyct_summary="Financier Summary", recommendation_text="Invest")
    )

    # 4. Create Dummy Architect
    architect = Architect(
        title="Architect Title",
        score=85,
        mvp_status=MVPStatus(
            title="MVP", status="Ready", subtitle="Sub", mvp_screenshot_url="http://img", mvp_live_link="http://link", mvp_button_text="Click",
            build_stats=[BuildStat(value="1 week", label="Time")]
        ),
        user_flow=UserFlow(title="Flow", steps=[FlowStep(step=1, action="Login")], figma_button_text="Figma"),
        tech_stack=TechStack(title="Stack", categories=[TechCategory(name="Frontend", technologies=["React"])]),
        brand_kit=BrandKit(title="Brand", project_name="Proj", color_palette=["#000"], typography=[TypographyItem(use="Header", font="Inter")]),
        data_moat=DataMoat(title="Moat", status="Strong", features=[DataMoatFeature(title="Data", description="Lots")]),
        architect_footer=ArchitectFooter(
            verdyct_summary="Architect Summary",
            scoring_breakdown=[ScoringBreakdownItem(name="Tech", score=10, max_score=10)],
            recommendation_text="Build"
        )
    )

    # 5. Create Agents
    agents = Agents(
        analyst=analyst,
        spy=spy,
        financier=financier,
        architect=architect
    )

    # 6. Create Full Report
    report = VerdyctReportResponse(
        report_id=str(uuid.uuid4()),
        submitted_at=datetime.utcnow().isoformat(),
        pcs_score=analyst.pcs_score,
        global_summary="Global Summary",
        agents=agents
    )

    print("Successfully created VerdyctReportResponse!")
    print(report.model_dump_json(indent=2))

if __name__ == "__main__":
    test_structure()
