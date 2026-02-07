import sys
import os
import asyncio
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

load_dotenv()

from agents.spy import generate_spy_analysis, get_competitor_intel

async def test_ruthless_spy():
    """
    Test the Spy agent with highly competitive/saturated ideas.
    Verify that it now gives LOW scores and harsh verdicts.
    """
    
    # Test 1: Saturated Market (Dating App)
    print("=" * 60)
    print("TEST 1: Dating App (Should get HAMMERED)")
    print("=" * 60)
    idea = "A new dating app with swipe feature"
    
    try:
        intel = get_competitor_intel(idea)
        spy_result = generate_spy_analysis(
            idea, 
            intel["landscape_context"], 
            intel["pain_context"],
            feature_context=intel.get("feature_context", ""),
            pricing_context=intel.get("pricing_context", ""),
            language="en"
        )
        
        print(f"\n✅ Spy Analysis Complete!")
        print(f"Strategic Opening: {spy_result.spy.strategic_opening.strategic_score}/100")
        print(f"Verdict: {spy_result.spy.strategic_opening.verdict}")
        
        # Check if score is appropriately LOW
        if spy_result.spy.strategic_opening.strategic_score > 30:
            print(f"⚠️ WARNING: Score is TOO HIGH for a saturated market!")
        else:
            print(f"✅ PASS: Score correctly reflects market saturation.")
            
    except Exception as e:
        print(f"❌ Test 1 FAILED: {e}")
    
    # Test 2: Wrapper Idea (ChatGPT for X)
    print("\n" + "=" * 60)
    print("TEST 2: AI Writing Assistant (Wrapper - Should score low)")
    print("=" * 60)
    idea2 = "An AI writing assistant powered by GPT-4"
    
    try:
        intel2 = get_competitor_intel(idea2)
        spy_result2 = generate_spy_analysis(
            idea2,
            intel2["landscape_context"],
            intel2["pain_context"],
            feature_context=intel2.get("feature_context", ""),
            pricing_context=intel2.get("pricing_context", ""),
            language="en"
        )
        
        print(f"\n✅ Spy Analysis Complete!")
        print(f"Strategic Opening: {spy_result2.spy.strategic_opening.strategic_score}/100")
        print(f"Verdict: {spy_result2.spy.strategic_opening.verdict}")
        
        if spy_result2.spy.strategic_opening.strategic_score > 35:
            print(f"⚠️ WARNING: Wrapper idea scored TOO HIGH!")
        else:
            print(f"✅ PASS: Correctly identified as low-defensibility wrapper.")
            
    except Exception as e:
        print(f"❌ Test 2 FAILED: {e}")

if __name__ == "__main__":
    try:
        if sys.platform == 'win32':
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        asyncio.run(test_ruthless_spy())
    except Exception as final_e:
        print(f"CRITICAL FAILURE: {final_e}")
