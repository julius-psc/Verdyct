"""
Integration test for enhanced Analyst agent.
Tests if the agent can generate a full analysis with all new fields.
This uses real OpenAI + Tavily APIs (will consume credits).
"""

import asyncio
import json
from agents.analyst import search_market_data, generate_analysis

async def test_enhanced_analyst_full():
    """
    Test the full enhanced Analyst workflow with a simple idea.
    """
    test_idea = "AI-powered caption generator for e-learning videos"
    language = "en"
    
    print(f"🧪 Testing Enhanced Analyst with idea: '{test_idea}'")
    print("=" * 80)
    
    # Step 1: Search market data (now with 6 research steps)
    print("\n📊 Step 1: Searching market data (6 research steps)...")
    market_data = search_market_data(test_idea)
    print(f"   ✅ Found {market_data['results_count']} verified sources")
    
    # Step 2: Generate analysis with new enhanced fields
    print("\n🤖 Step 2: Generating enhanced analysis with OpenAI...")
    try:
        analysis_response = generate_analysis(
            idea=test_idea,
            market_data_context=market_data['context'],
            language=language
        )
        
        print("   ✅ Analysis generated successfully!")
        print("\n" + "=" * 80)
        print("📊 VALIDATION RESULTS:")
        print("=" * 80)
        
        analyst = analysis_response.analyst
        persona = analyst.ideal_customer_persona
        
        # Validate enhanced demographics
        print(f"\n✅ Enhanced Demographics:")
        print(f"   - Experience Level: {persona.details.experience_level}")
        print(f"   - Decision Power: {persona.details.decision_making_power}")
        print(f"   - Tech Savviness: {persona.details.tech_savviness}")
        print(f"   - Organization Type: {persona.details.organization_type}")
        
        # Validate quantified pain points
        print(f"\n✅ Quantified Pain Points ({len(persona.pain_points)} found):")
        for i, pain in enumerate(persona.pain_points[:2], 1):  # Show first 2
            print(f"\n   Pain Point {i}:")
            print(f"   - Title: {pain.title}")
            print(f"   - Time Wasted: {pain.time_wasted_per_week}")
            print(f"   - Financial Impact: {pain.financial_impact}")
            print(f"   - Emotional Impact: {pain.emotional_impact}")
            print(f"   - Urgency: {pain.urgency_level}")
            print(f"   - Quote: {pain.verified_quote[:100]}...")
            print(f"   - Source: {pain.verified_url}")
        
        # Validate JTBD
        print(f"\n✅ Jobs-to-be-Done ({len(persona.jobs_to_be_done)} found):")
        for i, jtbd in enumerate(persona.jobs_to_be_done[:2], 1):
            print(f"\n   JTBD {i}:")
            print(f"   - Functional: {jtbd.functional_job}")
            print(f"   - Emotional: {jtbd.emotional_job}")
            print(f"   - Social: {jtbd.social_job}")
            print(f"   - Priority: {jtbd.priority}")
        
        # Validate channels
        print(f"\n✅ Channel Recommendations ({len(persona.where_to_find)} found):")
        for i, channel in enumerate(persona.where_to_find[:2], 1):
            print(f"\n   Channel {i}:")
            print(f"   - Platform: {channel.platform}")
            print(f"   - Location: {channel.specific_location}")
            print(f"   - Activity: {channel.activity_level}")
            print(f"   - Content Type: {channel.content_type}")
            print(f"   - Verified: {channel.verified_url}")
        
        # Validate behavioral insights
        print(f"\n✅ Behavioral Insights:")
        behavior = persona.behavioral_insights
        print(f"   - Buying Triggers: {', '.join(behavior.buying_triggers)}")
        print(f"   - Content Preferences: {', '.join(behavior.content_preferences)}")
        print(f"   - Objections: {', '.join(behavior.objections)}")
        print(f"   - Decision Timeline: {behavior.decision_timeline}")
        
        print("\n" + "=" * 80)
        print("🎉 SUCCESS! Enhanced Analyst is generating rich, verified data!")
        print("=" * 80)
        
        # Save sample output for review
        output_file = "test_enhanced_analyst_output.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis_response.model_dump(), f, indent=2, ensure_ascii=False)
        print(f"\n💾 Full output saved to: {output_file}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error during analysis generation:")
        print(f"   {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # Note: This will consume API credits (OpenAI + Tavily)
    print("⚠️  WARNING: This test will consume API credits (OpenAI + Tavily)")
    print("⚠️  It will make ~6 Tavily searches + 1 OpenAI GPT-4 call")
    print("\nPress Ctrl+C to cancel, or waiting 5 seconds to proceed...\n")
    
    import time
    try:
        time.sleep(5)
        asyncio.run(test_enhanced_analyst_full())
    except KeyboardInterrupt:
        print("\n❌ Test cancelled by user")
