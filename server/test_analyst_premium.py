import sys
import os
import asyncio
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

load_dotenv()

from agents.analyst import generate_analysis, search_market_data

async def test_analyst_premium():
    """
    Test that the Analyst agent ALWAYS generates Premium features:
    - GTM Action Plan
    - Market Segments
    - Competitors Preview
    - Unit Economics Preview
    """
    
    idea = "A B2B SaaS for HR onboarding automation"
    print(f"🔍 Testing Analyst Premium Features for: {idea}")
    
    try:
        # Run full pipeline
        market_data = search_market_data(idea)
        analyst_result = generate_analysis(
            idea,
            market_data["context"],
            language="en"
        )
        
        analyst = analyst_result.analyst
        
        print("\n✅ Analyst Report Generated!")
        print(f"Title: {analyst.title}")
        
        # Check Premium Features
        print("\n--- PREMIUM FEATURES CHECK ---")
        
        # 1. GTM Action Plan
        if analyst.gtm_action_plan:
            print(f"✅ GTM Action Plan: PRESENT")
            print(f"   - Channels: {len(analyst.gtm_action_plan.recommended_channels)}")
            print(f"   - Budget Min: {analyst.gtm_action_plan.budget_minimum}")
        else:
            print(f"❌ GTM Action Plan: MISSING (BUG!)")
        
        # 2. Market Segments
        if analyst.market_segments and len(analyst.market_segments) > 0:
            print(f"✅ Market Segments: PRESENT ({len(analyst.market_segments)} segments)")
            for seg in analyst.market_segments:
                print(f"   - {seg.segment_name}: {seg.market_size}")
        else:
            print(f"❌ Market Segments: MISSING (BUG!)")
        
        # 3. Competitors Preview
        if analyst.competitors_preview and len(analyst.competitors_preview) > 0:
            print(f"✅ Competitors Preview: PRESENT ({len(analyst.competitors_preview)} competitors)")
        else:
            print(f"⚠️ Competitors Preview: MISSING (Optional but recommended)")
        
        # 4. Unit Economics Preview
        if analyst.unit_economics_preview:
            print(f"✅ Unit Economics Preview: PRESENT")
            print(f"   - LTV/CAC Ratio: {analyst.unit_economics_preview.ltv_cac_ratio}")
        else:
            print(f"⚠️ Unit Economics Preview: MISSING (Optional but recommended)")
        
        # CRITICAL CHECK
        if not analyst.gtm_action_plan or not analyst.market_segments:
            print("\n❌ CRITICAL: Pro version will appear 'missing' to user!")
            print("   The Analyst MUST generate GTM Plan and Market Segments.")
        else:
            print("\n✅ ALL CRITICAL PREMIUM FEATURES PRESENT!")
            
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    try:
        if sys.platform == 'win32':
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        asyncio.run(test_analyst_premium())
    except Exception as final_e:
        print(f"CRITICAL FAILURE: {final_e}")
