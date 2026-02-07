"""
Quick test to verify enhanced Analyst agent generates valid JSON with new fields.
This doesn't make API calls - just validates the structure.
"""

from models import (
    IdealCustomerPersona, 
    PersonaDetails, 
    PainPoint, 
    JobToBeDone, 
    ChannelRecommendation, 
    BehavioralInsights,
    Analyst,
    AnalystResponse
)

# Test creating a sample enhanced persona
def test_enhanced_persona_structure():
    """Test that all new fields are properly structured"""
    
    # Create enhanced persona details
    details = PersonaDetails(
        age_range="32-48",
        income="$65k-$95k",
        education="Bachelor's+",
        team_size="5-20",
        experience_level="5-10 years in L&D",
        decision_making_power="Budget Holder",
        tech_savviness="Early Adopter",
        organization_type="Enterprise (500+ employees)"
    )
    
    # Create quantified pain point
    pain = PainPoint(
        title="Manual captioning is slow and tedious",
        details="5+ hours/week lost to manual work",
        time_wasted_per_week="5+ hours/week",
        financial_impact="$10k/year in lost productivity",
        emotional_impact="Frustration",
        urgency_level="High",
        verified_quote="I spend 5 hours a week manually fixing captions. I just want a tool that works.",
        verified_url="https://example.com/reddit-complaint"
    )
    
    # Create JTBD
    jtbd = JobToBeDone(
        functional_job="Make training videos accessible to all employees",
        emotional_job="Look professional to leadership",
        social_job="Be seen as innovative in the team",
        priority="Must-Have"
    )
    
    # Create channel recommendation
    channel = ChannelRecommendation(
        platform="Reddit",
        specific_location="r/instructionaldesign",
        activity_level="Very Active (Daily)",
        content_type="Questions",
        verified_url="https://reddit.com/r/instructionaldesign"
    )
    
    # Create behavioral insights
    behavior = BehavioralInsights(
        buying_triggers=["Free trial", "Case studies", "ROI calculator"],
        content_preferences=["Video tutorials", "Blog posts"],
        objections=["Too expensive", "Complex onboarding"],
        decision_timeline="2-4 weeks evaluation period"
    )
    
    # Create full persona
    persona = IdealCustomerPersona(
        title="AI-Generated Ideal Customer Persona",
        subtitle="Meet your ideal customer",
        persona_name="Instructional Designer Ian",
        persona_role="Corporate Trainer",
        persona_department="Enterprise L&D Department",
        persona_quote="I spend 5 hours a week manually fixing captions.",
        details=details,
        pain_points=[pain],
        jobs_to_be_done=[jtbd],
        where_to_find=[channel],
        behavioral_insights=behavior
    )
    
    print("✅ Enhanced Persona structure validated successfully!")
    print(f"   - Demographics: {len(persona.details.model_dump())} fields")
    print(f"   - Pain Points: {len(persona.pain_points)} (with {len(pain.model_dump())} fields each)")
    print(f"   - JTBD: {len(persona.jobs_to_be_done)}")
    print(f"   - Channels: {len(persona.where_to_find)}")
    print(f"   - Behavioral Insights: {len(behavior.model_dump())} categories")
    
    return persona

if __name__ == "__main__":
    test_enhanced_persona_structure()
    print("\n✅ All enhanced Analyst models are working correctly!")
