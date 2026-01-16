
const mockTimelineDataEn = {
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

const mockTimelineDataFr = {
    project_name: "EstateFlow",
    current_step: 4,
    steps: [
        {
            id: 1,
            title: "Validation de l'Idée",
            status: "completed",
            date: "12 Oct 2024",
            description: "Valider le problème central : 'Fatigue des Propriétaires'",
            chatHistory: [
                { role: "ai", content: "Validons 'EstateFlow'. J'ai analysé plus de 500 posts de forums.", type: "text" },
                { role: "ai", content: "Insight Clé : 78% des propriétaires indépendants gèrent leurs biens via Excel et détestent ça. Leur principal problème n'est PAS de trouver des locataires, mais de gérer ceux *existants* (collecte des loyers, frais de retard).", type: "insight" },
                { role: "user", content: "Donc je devrais me concentrer sur les fonctionnalités de gestion, pas sur les annonces ?", type: "text" },
                { role: "ai", content: "Exactement. Le marché des annonces est saturé (SeLoger, Leboncoin). Le marché de la 'Gestion' pour les petits acteurs est mal desservi. Pivotez votre MVP pour vous concentrer uniquement sur la 'Collecte Automatisée des Loyers' et le 'Renouvellement de Bail'.", type: "text" }
            ]
        },
        {
            id: 2,
            title: "Cadrage MVP",
            status: "completed",
            date: "15 Oct 2024",
            description: "Définir le Produit Minimum Aimable",
            chatHistory: [
                { role: "ai", content: "Basé sur la validation, voici votre ensemble de fonctionnalités MVP.", type: "text" },
                { role: "ai", content: "1. Intégration Stripe Connect (Collecte des Loyers)\n2. Générateur de Bail PDF (Conformité Légale)\n3. Bot WhatsApp Locataire (Demandes de Maintenance)", type: "list" },
                { role: "user", content: "Le bot WhatsApp semble difficile à construire.", type: "text" },
                { role: "ai", content: "C'est en fait la fonctionnalité à plus fort levier. Les propriétaires détestent les appels tardifs. Un bot simple qui trie 'Urgence' vs 'Peut Attendre' sera votre fonctionnalité tueuse. J'ai mis à jour le Plan de l'Architecte pour inclure l'API Twilio.", type: "text" }
            ]
        },
        {
            id: 3,
            title: "10 Premiers Utilisateurs",
            status: "completed",
            date: "28 Oct 2024",
            description: "Acquérir des bêta-testeurs manuellement",
            chatHistory: [
                { role: "user", content: "Le MVP est prêt. Comment obtenir mes premiers utilisateurs sans publicité ?", type: "text" },
                { role: "ai", content: "Ne faites pas encore de publicité. Allez là où ils se plaignent.", type: "text" },
                { role: "ai", content: "Stratégie : Rejoignez des groupes Facebook d'investisseurs immobiliers. Cherchez 'loyer en retard'. Envoyez un DM aux auteurs : 'J'ai créé un outil qui facture automatiquement les frais de retard pour que vous n'ayez pas à jouer le mauvais rôle. Voulez-vous l'essayer gratuitement ?'", type: "strategy" },
                { role: "user", content: "Ok, j'ai envoyé 20 DM. Déjà 3 réponses !", type: "text" },
                { role: "ai", content: "Superbe conversion. Onboardez-les personnellement via Zoom. Leurs retours valent de l'or en ce moment.", type: "text" }
            ]
        },
        {
            id: 4,
            title: "Stratégie de Prix",
            status: "current",
            date: "05 Nov 2024",
            description: "Déterminer le prix SaaS optimal",
            chatHistory: [
                { role: "ai", content: "J'ai analysé la concurrence (Buildium, TurboTenant). Ils facturent par unité, ce qui punit la croissance.", type: "text" },
                { role: "ai", content: "Recommandation : Facturez un forfait mensuel de 29 $ pour jusqu'à 10 unités. Cela casse les prix et capture le propriétaire 'ambitieux' qui veut grandir.", type: "recommendation" },
                { role: "user", content: "Visualisation du moteur de profit...", type: "text" },
                { role: "ai", content: "À 29 $/mois, vous n'avez besoin que de 180 utilisateurs pour atteindre 5k $ de MRR (Rentabilité Ramen). Avec votre CAC actuel de 12 $, c'est tout à fait réalisable.", type: "text" }
            ]
        },
        {
            id: 5,
            title: "Croissance & Échelle",
            status: "locked",
            date: "Futur",
            description: "De 100 à 1 000 utilisateurs",
            chatHistory: []
        }
    ]
};

export const getMockTimelineData = (locale: string) => {
    return locale === 'fr' ? mockTimelineDataFr : mockTimelineDataEn;
};

// Deprecated: kept for backward compatibility if needed, but prefer getMockTimelineData
export const mockTimelineData = mockTimelineDataEn;
