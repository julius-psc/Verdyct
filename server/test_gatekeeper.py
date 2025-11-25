import asyncio
from unittest.mock import MagicMock, AsyncMock, patch
from main import generate_full_report
from models import IdeaRequest, AnalystResponse, Analyst, AnalystFooter, ScoringBreakdown, SpyResponse, Spy, FinancierResponse, Financier, ArchitectResponse, Architect, RescuePlan, RescueOption

# Mock Data
def create_mock_analyst_response(score):
    return AnalystResponse(
        analyst=Analyst(
            title="Test Analysis",
            analysis_for="Test Idea",
            score=score,
            pcs_score=score,
            score_card={"title": "Score Card", "level": "High", "description": "Desc"},
            market_metrics=[{"name": "TAM", "value": "1B", "change_percentage": "10%", "note": "Note", "verified_url": "http://test.com"}],
            seo_opportunity={"title": "SEO", "subtitle": "Sub", "high_opportunity_keywords": [{"term": "keyword", "volume_estimate": "High", "difficulty_level": "Low"}]},
            ideal_customer_persona={
                "title": "Persona", "subtitle": "Sub", "persona_name": "John", "persona_role": "Dev", "persona_department": "IT", "persona_quote": "Quote",
                "details": {"age_range": "20-30", "income": "High", "education": "PhD", "team_size": "10"},
                "pain_points": [{"title": "Pain", "details": "Details"}],
                "jobs_to_be_done": ["Job 1"],
                "where_to_find": ["LinkedIn"]
            },
            analyst_footer=AnalystFooter(
                verdyct_summary="Test Summary",
                scoring_breakdown=[ScoringBreakdown(name="Market", score=score/10, max_score=10)],
                recommendation_title="Test Rec",
                recommendation_text="Test Text"
            )
        )
    )

def create_mock_rescue_plan():
    return RescuePlan(
        improve=RescueOption(title="Improve", description="Desc", ai_suggested_prompt="Improved Idea"),
        pivot=RescueOption(title="Pivot", description="Desc", ai_suggested_prompt="Pivot Idea")
    )

async def test_gatekeeper():
    print("Testing Gatekeeper Logic...")
    
    # Test Case 1: Low Score (< 60)
    print("\n--- Test Case 1: Low Score (PCS 40) ---")
    with patch('main.analyze_idea', new_callable=AsyncMock) as mock_analyst:
        with patch('main.generate_rescue_plan') as mock_rescue:
            mock_analyst.return_value = create_mock_analyst_response(40)
            mock_rescue.return_value = create_mock_rescue_plan()
            
            request = IdeaRequest(idea="Bad Idea")
            response = await generate_full_report(request)
            
            print(f"Status: {response.status}")
            print(f"PCS Score: {response.pcs_score}")
            print(f"Rescue Plan Present: {response.rescue_plan is not None}")
            print(f"Other Agents Present: {response.agents.spy is None}")
            
            assert response.status == "rejected"
            assert response.pcs_score == 40
            assert response.rescue_plan is not None
            assert response.agents.spy is None

    # Test Case 2: High Score (>= 60)
    print("\n--- Test Case 2: High Score (PCS 80) ---")
    with patch('main.analyze_idea', new_callable=AsyncMock) as mock_analyst:
        with patch('main.spy_analysis', new_callable=AsyncMock) as mock_spy:
            with patch('main.financier_analysis', new_callable=AsyncMock) as mock_financier:
                with patch('main.architect_blueprint', new_callable=AsyncMock) as mock_architect:
                    
                    mock_analyst.return_value = create_mock_analyst_response(80)
                    
                    # Create valid mock responses for other agents
                    mock_spy.return_value = SpyResponse(spy=Spy(
                        title="Spy", score=80, 
                        market_quadrant={"x_axis": {"label_left": "L", "label_right": "R"}, "y_axis": {"label_bottom": "B", "label_top": "T"}, "competitors": [{"name": "C1", "x_value": 1, "y_value": 1, "quadrant_label": "Q1", "verified_url": "http://url.com"}], "strategic_opening": {"label": "Open", "x_value": 1, "y_value": 1, "quadrant_label": "Q1"}},
                        customer_intel={"title": "Intel", "subtitle": "Sub", "top_complaints": [{"quote": "Q", "source": "S", "competitor": "C", "verified_url": "http://url.com"}], "pain_word_cloud": [{"term": "Pain", "mentions": 10}]},
                        spy_footer={"ai_analysis_summary": {"title": "Sum", "text": "Text"}, "verdyct_summary": {"title": "Verdyct", "text": "Spy Summary"}, "highlight_boxes": [{"value": "10", "label": "Label"}]}
                    ))
                    
                    mock_financier.return_value = FinancierResponse(financier=Financier(
                        title="Financier", score=80,
                        pricing_model={"title": "Pricing", "tiers": [{"name": "Basic", "price": "$10", "features": ["F1"], "recommended": True, "benchmark_competitor": "C1", "verified_url": "http://url.com"}]},
                        profit_engine={"levers": {"monthly_price": {"value": 10, "min": 1, "max": 100, "step": 1}, "ad_spend": {"value": 10, "min": 1, "max": 100, "step": 1}, "conversion_rate": {"value": 0.1, "min": 0.01, "max": 1.0, "step": 0.01}}, "metrics": {"ltv_cac_ratio": "3:1", "status": "Good", "estimated_cac": "$10", "estimated_ltv": "$30"}},
                        revenue_projection={"projections": [{"year": "2024", "revenue": "$1M"}]},
                        financier_footer={"verdyct_summary": "Financier Summary", "recommendation_text": "Rec"}
                    ))
                    
                    mock_architect.return_value = ArchitectResponse(architect=Architect(
                        title="Architect", score=80,
                        mvp_status={"title": "MVP", "status": "Ready", "subtitle": "Sub"},
                        user_flow={"title": "Flow", "steps": [{"step": 1, "action": "Action"}], "figma_button_text": "Figma"},
                        tech_stack={"title": "Stack", "categories": [{"name": "Frontend", "technologies": ["React"]}]},
                        brand_kit={"title": "Brand", "project_name": "Name", "color_palette": ["#000"], "typography": [{"use": "Header", "font": "Arial"}]},
                        data_moat={"title": "Moat", "status": "High", "features": [{"title": "Feature", "description": "Desc"}]},
                        architect_footer={"verdyct_summary": "Architect Summary", "scoring_breakdown": [{"name": "Tech", "score": 8, "max_score": 10}], "recommendation_text": "Rec"}
                    ))
                    
                    request = IdeaRequest(idea="Good Idea")
                    response = await generate_full_report(request)
                    
                    print(f"Status: {response.status}")
                    print(f"PCS Score: {response.pcs_score}")
                    print(f"Rescue Plan Present: {response.rescue_plan is not None}")
                    print(f"Other Agents Present: {response.agents.spy is not None}")
                    
                    assert response.status == "approved"
                    assert response.pcs_score == 80
                    assert response.rescue_plan is None
                    assert response.agents.spy is not None

if __name__ == "__main__":
    asyncio.run(test_gatekeeper())
