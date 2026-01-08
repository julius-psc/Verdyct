
export const mockTimelineData = {
    project_name: "EstateFlow",
    current_step: 4,
    steps: [
        {
            id: 1,
            title: "Idea Validation",
            status: "completed",
            date: "Oct 12, 2024",
            description: "Validate the core problem: 'Landlord Fatigue'",
            chatHistory: [
                { role: "ai", content: "Let's validate 'EstateFlow'. I've analyzed 500+ forum posts.", type: "text" },
                { role: "ai", content: "Key Insight: 78% of independent landlords manage properties via Excel and hate it. Their top pain point is NOT finding tenants, but managing *existing* ones (rent collection, late fees).", type: "insight" },
                { role: "user", content: "So I should focus on management features first, not listing features?", type: "text" },
                { role: "ai", content: "Exactly. The listing market is saturated (Zillow, Facebook). The 'Management' market for small players is underserved. Pivot your MVP to focus purely on 'Automated Rent Collection' and 'Lease Renewal'.", type: "text" }
            ]
        },
        {
            id: 2,
            title: "MVP Scoping",
            status: "completed",
            date: "Oct 15, 2024",
            description: "Define the Minimum Lovable Product",
            chatHistory: [
                { role: "ai", content: "Based on the validation, here is your MVP feature set.", type: "text" },
                { role: "ai", content: "1. Stripe Connect Integration (Rent Collection)\n2. PDF Lease Generator (Legal Compliance)\n3. WhatsApp Tenant Bot (Maintenance Requests)", type: "list" },
                { role: "user", content: "WhatsApp bot sounds hard to build.", type: "text" },
                { role: "ai", content: "It's actually the highest leverage feature. Landlords hate late night calls. A simple bot that triages 'Emergency' vs 'Can Wait' will be your killer feature. I've updated the Architect Blueprint to include Twilio API.", type: "text" }
            ]
        },
        {
            id: 3,
            title: "First 10 Users",
            status: "completed",
            date: "Oct 28, 2024",
            description: "Acquire beta testers manually",
            chatHistory: [
                { role: "user", content: "MVP is ready. How do I get my first users without ads?", type: "text" },
                { role: "ai", content: "Do not run ads yet. Go where they complain.", type: "text" },
                { role: "ai", content: "Strategy: Join 'Real Estate Investor' Facebook groups. Search for 'tenant late rent'. DM the posters with: 'I built a tool that auto-charges late fees so you don't have to be the bad guy. Want to try it for free?'", type: "strategy" },
                { role: "user", content: "Okay, I sent 20 DMs. Got 3 replies already!", type: "text" },
                { role: "ai", content: "Great conversion. Onboard them personally via Zoom. Their feedback is worth more than gold right now.", type: "text" }
            ]
        },
        {
            id: 4,
            title: "Pricing Strategy",
            status: "current",
            date: "Nov 05, 2024",
            description: "Determine optimal SaaS pricing",
            chatHistory: [
                { role: "ai", content: "I've analyzed the competition (Buildium, TurboTenant). They charge per unit, which punishes growth.", type: "text" },
                { role: "ai", content: "Recommendation: Charge a flat monthly fee of $29 for up to 10 units. This undercuts everyone and captures the 'aspirational' landlord who wants to grow.", type: "recommendation" },
                { role: "user", content: "Visualizing the profit engine...", type: "text" },
                { role: "ai", content: "At $29/mo, you only need 180 users to hit $5k MRR (Ramen Profitability). With your current CAC of $12, this is highly achievable.", type: "text" }
            ]
        },
        {
            id: 5,
            title: "Growth & Scale",
            status: "locked",
            date: "Future",
            description: "From 100 to 1,000 users",
            chatHistory: []
        }
    ]
};
