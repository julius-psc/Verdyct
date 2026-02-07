import sys
import os
import asyncio
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

load_dotenv()

from agents.analyst import generate_analysis, search_market_data

async def test_analyst_phase3():
    """
    Test Phase 3 Premium features:
    - JTBD Deep Dive (functional/emotional/social jobs with success metrics)
    - Marketing Playbook (buying triggers, content strategy, objection handling)
    """
    
    idea = "Project management tool for remote creative teams"
    print(f"🔍 Testing Analyst Phase 3 Features for: {idea}\n")
    
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
        
        # ===== PHASE 3 FEATURE CHECKS =====
        
        print("--- PHASE 3: JTBD DEEP DIVE ---")
        if analyst.jtbd_deep_dive:
            print(f"✅ JTBD Deep Dive: PRESENT")
            
            # Functional Job
            if analyst.jtbd_deep_dive.functional_job:
                fj = analyst.jtbd_deep_dive.functional_job
                print(f"\n📋 Functional Job:")
                print(f"   Job: {fj.job}")
                print(f"   Success Metrics: {len(fj.success_metrics)} metrics")
                for metric in fj.success_metrics[:2]:
                    print(f"      • {metric}")
                print(f"   Current Alternatives: {', '.join(fj.current_alternatives[:3])}")
                print(f"   Switching Cost: {fj.switching_cost}")
            else:
                print(f"❌ Functional Job: MISSING")
            
            # Emotional Job
            if analyst.jtbd_deep_dive.emotional_job:
                ej = analyst.jtbd_deep_dive.emotional_job
                print(f"\n❤️ Emotional Job:")
                print(f"   Job: {ej.job}")
                print(f"   Messaging Angle: {ej.messaging_angle[:80]}...")
            else:
                print(f"❌ Emotional Job: MISSING")
            
            # Social Job
            if analyst.jtbd_deep_dive.social_job:
                sj = analyst.jtbd_deep_dive.social_job
                print(f"\n👥 Social Job:")
                print(f"   Job: {sj.job}")
                print(f"   WOM Trigger: {sj.word_of_mouth_trigger[:80]}...")
            else:
                print(f"❌ Social Job: MISSING")
        else:
            print(f"❌ JTBD Deep Dive: MISSING (CRITICAL BUG!)")
        
        print("\n--- PHASE 3: MARKETING PLAYBOOK ---")
        if analyst.marketing_playbook:
            print(f"✅ Marketing Playbook: PRESENT")
            
            # Buying Triggers
            if analyst.marketing_playbook.buying_triggers:
                print(f"\n🎯 Buying Triggers: {len(analyst.marketing_playbook.buying_triggers)}")
                for i, trigger in enumerate(analyst.marketing_playbook.buying_triggers[:3], 1):
                    print(f"   {i}. Trigger: {trigger.trigger}")
                    print(f"      Campaign: {trigger.campaign_idea[:60]}...")
            else:
                print(f"❌ Buying Triggers: MISSING")
            
            # Content Strategy
            if analyst.marketing_playbook.content_strategy:
                print(f"\n📝 Content Strategy: {len(analyst.marketing_playbook.content_strategy)}")
                for i, content in enumerate(analyst.marketing_playbook.content_strategy[:3], 1):
                    print(f"   {i}. Preference: {content.preference}")
                    print(f"      Strategy: {content.strategy[:60]}...")
            else:
                print(f"❌ Content Strategy: MISSING")
            
            # Objection Handling
            if analyst.marketing_playbook.objection_handling:
                print(f"\n❓ Objection Handling: {len(analyst.marketing_playbook.objection_handling)}")
                for i, objection in enumerate(analyst.marketing_playbook.objection_handling[:3], 1):
                    print(f"   {i}. Objection: \"{objection.objection}\"")
                    print(f"      Response: {objection.response[:60]}...")
            else:
                print(f"❌ Objection Handling: MISSING")
        else:
            print(f"❌ Marketing Playbook: MISSING (CRITICAL BUG!)")
        
        # SUMMARY
        print("\n" + "="*60)
        phase3_complete = (
            analyst.jtbd_deep_dive is not None and
            analyst.marketing_playbook is not None
        )
        
        if phase3_complete:
            print("✅ PHASE 3 COMPLETE - All features generated!")
        else:
            print("❌ PHASE 3 INCOMPLETE - Some features missing")
            
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    try:
        if sys.platform == 'win32':
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        asyncio.run(test_analyst_phase3())
    except Exception as final_e:
        print(f"CRITICAL FAILURE: {final_e}")
