import sys
import os
import asyncio
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

load_dotenv()

from agents.analyst import generate_analysis, search_market_data

async def test_analyst_phase2():
    """
    Test Phase 2 Premium features:
    - Enhanced SEO (keyword difficulty, search volume, top rankers, content gaps)
    - Risk Validation (assumptions, milestones, red flags)
    """
    
    idea = "AI-powered email assistant for busy executives"
    print(f"🔍 Testing Analyst Phase 2 Features for: {idea}\n")
    
    try:
        # Run full pipeline
        market_data = search_market_data(idea)
        analyst_result = generate_analysis(
            idea,
            market_data["context"],
            language="en"
        )
        
        analyst = analyst_result.analyst
        
        print("✅ Analyst Report Generated!")
        print(f"Title: {analyst.title}\n")
        
        # ===== PHASE 2 FEATURE CHECKS =====
        
        print("--- PHASE 2: ENHANCED SEO ---")
        if analyst.seo_opportunity.high_opportunity_keywords:
            print(f"✅ Keywords: {len(analyst.seo_opportunity.high_opportunity_keywords)} found")
            
            # Check if keywords have Phase 2 enhancements
            enhanced_count = 0
            for kw in analyst.seo_opportunity.high_opportunity_keywords[:3]:
                print(f"\n   Keyword: {kw.keyword}")
                print(f"   - Opportunity: {kw.opportunity_level}")
                
                if kw.search_volume:
                    print(f"   - Search Volume: {kw.search_volume} ✅")
                    enhanced_count += 1
                else:
                    print(f"   - Search Volume: MISSING ❌")
                
                if kw.difficulty:
                    print(f"   - Difficulty: {kw.difficulty} ✅")
                else:
                    print(f"   - Difficulty: MISSING ❌")
                
                if kw.top_ranker_1:
                    print(f"   - Top Rankers: {kw.top_ranker_1}, {kw.top_ranker_2 or 'N/A'}, {kw.top_ranker_3 or 'N/A'} ✅")
                else:
                    print(f"   - Top Rankers: MISSING ❌")
            
            if enhanced_count > 0:
                print(f"\n✅ SEO Keywords Enhanced! ({enhanced_count}/{len(analyst.seo_opportunity.high_opportunity_keywords[:3])})")
            else:
                print(f"\n❌ SEO Keywords NOT Enhanced (Phase 2 fields missing)")
            
            # Content Gap & Traffic Potential
            if analyst.seo_opportunity.content_gap_insight:
                print(f"✅ Content Gap Insight: {analyst.seo_opportunity.content_gap_insight[:100]}...")
            else:
                print(f"❌ Content Gap Insight: MISSING")
                
            if analyst.seo_opportunity.organic_traffic_potential:
                print(f"✅ Traffic Potential: {analyst.seo_opportunity.organic_traffic_potential}")
            else:
                print(f"❌ Traffic Potential: MISSING")
        
        print("\n--- PHASE 2: RISK VALIDATION ---")
        if analyst.risk_validation:
            print(f"✅ Risk Validation: PRESENT")
            
            if analyst.risk_validation.critical_assumptions:
                print(f"   - Critical Assumptions: {len(analyst.risk_validation.critical_assumptions)}")
                for i, assumption in enumerate(analyst.risk_validation.critical_assumptions[:2], 1):
                    print(f"      {i}. [{assumption.priority}] {assumption.assumption}")
                    print(f"         Validate: {assumption.validation_method[:60]}...")
            else:
                print(f"   - Critical Assumptions: MISSING ❌")
            
            if analyst.risk_validation.derisking_milestones:
                print(f"   - De-risking Milestones: {len(analyst.risk_validation.derisking_milestones)}")
                for milestone in analyst.risk_validation.derisking_milestones[:2]:
                    print(f"      • {milestone.stage}: {milestone.milestone}")
            else:
                print(f"   - De-risking Milestones: MISSING ❌")
            
            if analyst.risk_validation.red_flags:
                print(f"   - Red Flags: {len(analyst.risk_validation.red_flags)}")
                for flag in analyst.risk_validation.red_flags[:2]:
                    print(f"      ⚠️ {flag.condition} → {flag.action}")
            else:
                print(f"   - Red Flags: MISSING ❌")
        else:
            print(f"❌ Risk Validation: MISSING (CRITICAL BUG!)")
        
        # SUMMARY
        print("\n" + "="*60)
        phase2_complete = (
            analyst.seo_opportunity.content_gap_insight is not None and
            analyst.seo_opportunity.organic_traffic_potential is not None and
            analyst.risk_validation is not None
        )
        
        if phase2_complete:
            print("✅ PHASE 2 COMPLETE - All features generated!")
        else:
            print("❌ PHASE 2 INCOMPLETE - Some features missing")
            
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    try:
        if sys.platform == 'win32':
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        asyncio.run(test_analyst_phase2())
    except Exception as final_e:
        print(f"CRITICAL FAILURE: {final_e}")
