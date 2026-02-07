
const mockFullReportEn = {
    project_id: "demo-estateflow",
    analysis_type: "full",
    created_at: new Date().toISOString(),
    // Analyst Data
    analyst: {
        title: "EstateFlow Analysis",
        analysis_for: "EstateFlow AI",
        score: 94,
        pcs_score: 94,
        score_card: {
            title: "Unicorn Potential",
            level: "Unicorn",
            description: "Exceptional market fit. High-income user base with critical pain points.",
            level_description: "Top 1% of analyzed ideas."
        },
        market_metrics: [
            { name: "Global PropTech Market", value: "$58B by 2030", change_percentage: "+14% CAGR", note: "Massive growth trajectory in automation." },
            { name: "Target Addressable Market", value: "$4.2B", change_percentage: "Immediate", note: "US & EU Independent Landlords." },
            { name: "Search Volume", value: "450k/mo", change_percentage: "+220% YoY", note: "Surge in 'AI property management' queries." },
            { name: "Cost Per Acquisition", value: "$12", change_percentage: "-40% vs Avg", note: "Organic demand drives low CAC." }
        ],
        seo_opportunity: {
            title: "SEO Goldmine",
            subtitle: "Low difficulty, high value keywords identified.",
            high_opportunity_keywords: [
                { keyword: "AI tenant screening", opportunity_level: "High (22k)", difficulty: "Low" },
                { keyword: "Automated rent collection app", opportunity_level: "Very High (45k)", difficulty: "Medium" },
                { keyword: "Landlord tax deduction AI", opportunity_level: "Medium (12k)", difficulty: "Very Low" },
                { keyword: "Property management automation", opportunity_level: "High (33k)", difficulty: "Medium" },
                { keyword: "Best software for small landlords", opportunity_level: "Huge (60k)", difficulty: "Medium" }
            ]
        },
        ideal_customer_persona: {
            title: "Sarah, The Modern Landlord",
            subtitle: "Tech-savvy real estate investor",
            persona_name: "Sarah (34)",
            persona_role: "Independent Investor",
            persona_department: "Portfolio Owner",
            persona_quote: "I want to grow my portfolio, not spend my weekends chasing late rent payments.",
            details: {
                age_range: "30-45",
                income: "$150k+",
                education: "Masters",
                team_size: "Solo + Contractors"
            },
            pain_points: [
                { title: "Fear of bad tenants & eviction costs", details: "" },
                { title: "Manual paperwork & tax compliance chaos", details: "" },
                { title: "Late night maintenance calls", details: "" }
            ],
            jobs_to_be_done: [],
            where_to_find: []
        },
        analyst_footer: {
            verdyct_summary: "EstateFlow solves a burning pain for a wealthy demographic. The 'set it and forget it' promise for landlords justifies a high premium subscription. Competition is clunky and outdated.",
            scoring_breakdown: [
                { name: "Market Demand", score: 98, max_score: 100 },
                { name: "Monetization", score: 95, max_score: 100 },
                { name: "Competition", score: 88, max_score: 100 }
            ],
            data_confidence_level: "High",
            risk_flags: ["Regulatory changes in housing"],
            recommendation_title: "Build immediately",
            recommendation_text: ""
        }
    },
    // Spy Data
    spy: {
        title: "Competitive Landscape",
        score: 85,
        market_quadrant: {
            competitors: [
                { name: "Buildium", x_value: 80, y_value: 60, quadrant_label: "Legacy Giant", verified_url: "https://buildium.com" },
                { name: "TurboTenant", x_value: 60, y_value: 70, quadrant_label: "Established", verified_url: "https://turbotenant.com" },
                { name: "DoorLoop", x_value: 50, y_value: 50, quadrant_label: "Challenger", verified_url: "https://doorloop.com" },
                { name: "Spreadsheets", x_value: 20, y_value: 20, quadrant_label: "Direct Substitute", verified_url: "" }
            ],
            strategic_opening: {
                label: "AI Automation",
                quadrant_label: "Blue Ocean"
            }
        },
        customer_intel: {
            top_complaints: [
                { quote: "Their interface feels like Windows 98. It takes 10 clicks to log a payment.", source: "G2 Review", competitor: "Legacy Giant" },
                { quote: "Way too expensive for someone with just 5 units. I don't need enterprise features.", source: "Reddit", competitor: "Buildium" },
                { quote: "Customer support takes 3 days to reply. My tenant is waiting.", source: "Capterra", competitor: "TurboTenant" }
            ],
            pain_word_cloud: [
                { term: "Clunky UI", mentions: 145 },
                { term: "Expensive", mentions: 120 },
                { term: "Slow Support", mentions: 98 },
                { term: "Hard to learn", mentions: 85 },
                { term: "Mobile app sucks", mentions: 76 }
            ]
        },
        spy_footer: {
            verdyct_summary: {
                title: "Wide Open Opportunity",
                text: "Incumbents are expensive and have terrible UX. There is a massive gap for a 'Mobile-First', AI-driven solution that simplifies simple tasks for smaller landlords."
            },
            highlight_boxes: [
                { value: "High", label: "Disruption Potential" },
                { value: "Weak", label: "Competitor UI/UX" }
            ]
        }
    },
    // Financier Data
    financier: {
        title: "Financial Projections",
        score: 92,
        pricing_model: {
            title: "SaaS Subscription",
            tiers: [
                { name: "Starter", price: "Free", features: ["1 Property", "Basic Screening", "Manual Rent Log"], recommended: false, benchmark_competitor: "", verified_url: "" },
                { name: "Landlord Pro", price: "$29/mo", features: ["Up to 10 Units", "AI Auto-Screening", "Auto-Rent Collection", "Legal Docs"], recommended: true, benchmark_competitor: "TurboTenant ($35)", verified_url: "" },
                { name: "Portfolio", price: "$99/mo", features: ["Unlimited Units", "API Access", "Tax Automation", "Dedicated Support"], recommended: false, benchmark_competitor: "", verified_url: "" }
            ]
        },
        profit_engine: {
            levers: {
                monthly_price: { value: 29, min: 9, max: 99, step: 1 },
                ad_spend: { value: 1000, min: 100, max: 5000, step: 100 },
                conversion_rate: { value: 3.5, min: 0.5, max: 10, step: 0.5 }
            },
            metrics: {
                ltv_cac_ratio: "8.5",
                status: "Healthy",
                estimated_cac: "$45",
                estimated_ltv: "$380",
                break_even_users: "150",
                projected_runway_months: "18"
            }
        },
        revenue_projection: {
            projections: [
                { year: "Year 1", revenue: "$145,000" },
                { year: "Year 2", revenue: "$850,000" },
                { year: "Year 3", revenue: "$2,400,000" },
                { year: "Year 4", revenue: "$5,200,000" },
                { year: "Year 5", revenue: "$12,000,000" }
            ]
        },
        financier_footer: {
            verdyct_summary: "With a $29 price point and low churn (landlords stick for years), the LTV is exceptional. Profitability is achievable within Month 5.",
            recommendation_text: "Price at $29 to undercut legacy tools while offering superior AI value."
        }
    },
    // Architect Data
    architect: {
        title: "Technical Stack",
        score: 96,
        mvp_status: {
            title: "Ready to Deploy",
            status: "Generated",
            subtitle: "A modern Dashboard for landlords with property cards and tenant lists.",
            mvp_screenshot_url: "",
            mvp_live_link: "https://lovable.dev?prompt=Create%20a%20comprehensive%20SaaS%20dashboard%20for%20'EstateFlow'%2C%20an%20AI-powered%20property%20management%20platform%20for%20independent%20landlords.%0A%0A1.%20Visual%20Identity%20%26%20Theme%3A%0A-%20Primary%20Color%3A%20Emerald%20Green%20(%2310B981)%20evoking%20growth%20and%20stability.%0A-%20Secondary%20Color%3A%20Deep%20Navy%20(%230F172A)%20for%20trust%20and%20professionalism.%0A-%20Background%3A%20Clean%20white/gray%20for%20content%20areas%2C%20dark%20sidebar.%0A-%20Typography%3A%20Inter%20for%20UI%20elements%2C%20Playfair%20Display%20for%20hero%20headings%20to%20add%20a%20touch%20of%20prestige.%0A-%20Style%3A%20Modern%2C%20clean%2C%20with%20subtle%20glassmorphism%20on%20overlay%20cards%20and%20smooth%20shadows.%0A%0A2.%20Core%20Layout%20Structure%3A%0A-%20Left%20Sidebar%20(Fixed)%3A%20Logo%20top%2C%20Navigation%20(Dashboard%2C%20My%20Properties%2C%20Tenant%20CRM%2C%20Financials%2C%20Documents%2C%20Settings)%2C%20User%20Profile%20bottom.%0A-%20Top%20Bar%3A%20Search%20Global%2C%20Notifications%20(Bell)%2C%20Quick%20Actions%20Dropdown.%0A-%20Main%20Content%20Area%3A%20Spacious%20grid%20layout.%0A%0A3.%20Dashboard%20Widgets%20(The%20View)%3A%0A-%20'Financial%20Health'%20Row%3A%20Total%20Revenue%20(Monthly/YTD)%20with%20mini%20line%20chart%2C%20Occupancy%20Rate%20(Circular%20progress)%2C%20Outstanding%20Rent%20(Red%20alert).%0A-%20'Property%20Overview'%20Grid%3A%20Cards%20representing%20buildings.%20Each%20card%20shows%20photo%2C%20address%2C%20units%20occupied/total%2C%20and%20status%20badge.%0A-%20'Tenant%20Requests'%20List%3A%20Recent%20maintenance%20tickets%20(e.g.%20'Leaky%20faucet%20-%20Unit%204B')%20with%20priority%20tags.%0A-%20'AI%20Insights'%20Box%3A%20A%20special%20card%20showing%20a%20tip%20like%20'Rent%20for%20Unit%203A%20is%205%25%20below%20market%20average.%20Suggest%20increase%20at%20renewal.'%0A%0A4.%20Interactive%20Elements%3A%0A-%20Clicking%20a%20property%20card%20opens%20a%20detailed%20view.%0A-%20Hover%20states%20on%20all%20buttons.%0A-%20'Add%20Property'%20modal%20wizard.",
            mvp_button_text: "View Live MVP",
            build_stats: []
        },
        user_flow: {
            title: "Onboarding Flow",
            steps: [],
            figma_button_text: ""
        },
        tech_stack: {
            title: "Modern Stack",
            categories: [
                { name: "Frontend", technologies: ["React", "Tailwind CSS", "Framer Motion"] },
                { name: "Backend", technologies: ["Python FastAPI", "OpenAI GPT-4o", "Stripe API"] },
                { name: "Database", technologies: ["Supabase (PostgreSQL)", "Redis"] },
                { name: "Infrastructure", technologies: ["Vercel", "Railway"] }
            ]
        },
        brand_kit: {
            title: "Trust & Growth",
            project_name: "EstateFlow",
            color_palette: ["#10B981", "#064E3B", "#ffffff"],
            typography: [{ use: "Headings", font: "Inter" }]
        },
        data_moat: {
            title: "Rental Data Lake",
            status: "Active",
            features: []
        },
        architect_footer: {
            verdyct_summary: "A robust, scalable architecture using proven technologies. The AI integration via OpenAI API is straightforward but high value.",
            scoring_breakdown: [],
            recommendation_text: ""
        }
    }
};

const mockFullReportFr = {
    project_id: "demo-estateflow",
    analysis_type: "full",
    created_at: new Date().toISOString(),
    // Analyst Data
    analyst: {
        title: "Analyse EstateFlow",
        analysis_for: "EstateFlow AI",
        score: 94,
        pcs_score: 94,
        score_card: {
            title: "Potentiel Licorne",
            level: "Licorne",
            description: "Fit marché exceptionnel. Base d'utilisateurs à haut revenu avec points de douleur critiques.",
            level_description: "Top 1% des idées analysées."
        },
        market_metrics: [
            { name: "Marché PropTech Global", value: "$58Mds d'ici 2030", change_percentage: "+14% CAGR", note: "Trajectoire de croissance massive dans l'automatisation." },
            { name: "Marché Adressable Cible", value: "$4.2Mds", change_percentage: "Immédiat", note: "Propriétaires Indépendants US & UE." },
            { name: "Volume de Recherche", value: "450k/mois", change_percentage: "+220% YoY", note: "Hausse des requêtes 'gestion locative IA'." },
            { name: "Coût par Acquisition", value: "$12", change_percentage: "-40% vs Moy", note: "La demande organique réduit le CAC." }
        ],
        seo_opportunity: {
            title: "Mine d'Or SEO",
            subtitle: "Mots-clés à faible difficulté et haute valeur identifiés.",
            high_opportunity_keywords: [
                { keyword: "AI tenant screening", opportunity_level: "High (22k)", difficulty: "Low" },
                { keyword: "Automated rent collection app", opportunity_level: "Very High (45k)", difficulty: "Medium" },
                { keyword: "Landlord tax deduction AI", opportunity_level: "Medium (12k)", difficulty: "Very Low" },
                { keyword: "Property management automation", opportunity_level: "High (33k)", difficulty: "Medium" },
                { keyword: "Best software for small landlords", opportunity_level: "Huge (60k)", difficulty: "Medium" }
            ]
        },
        ideal_customer_persona: {
            title: "Sarah, La Propriétaire Moderne",
            subtitle: "Investisseuse immo tech-savvy",
            persona_name: "Sarah (34)",
            persona_role: "Investisseuse Indépendante",
            persona_department: "Propriétaire de Portefeuille",
            persona_quote: "Je veux faire grandir mon portefeuille, pas passer mes weekends à courir après les loyers en retard.",
            details: {
                age_range: "30-45",
                income: "$150k+",
                education: "Master",
                team_size: "Solo + Prestataires"
            },
            pain_points: [
                { title: "Peur des mauvais locataires & coûts d'expulsion", details: "" },
                { title: "Chaos administratif manuel & conformité fiscale", details: "" },
                { title: "Appels de maintenance tardifs", details: "" }
            ],
            jobs_to_be_done: [],
            where_to_find: []
        },
        analyst_footer: {
            verdyct_summary: "EstateFlow résout une douleur brûlante pour une démographique aisée. La promesse 'réglez-le et oubliez-le' pour les propriétaires justifie un abonnement premium élevé. La concurrence est lourde et dépassée.",
            scoring_breakdown: [
                { name: "Demande Marché", score: 98, max_score: 100 },
                { name: "Monétisation", score: 95, max_score: 100 },
                { name: "Concurrence", score: 88, max_score: 100 }
            ],
            data_confidence_level: "Élevée",
            risk_flags: ["Changements réglementaires dans le logement"],
            recommendation_title: "Construire immédiatement",
            recommendation_text: ""
        }
    },
    // Spy Data
    spy: {
        title: "Paysage Concurrentiel",
        score: 85,
        market_quadrant: {
            competitors: [
                { name: "Buildium", x_value: 80, y_value: 60, quadrant_label: "Géant Historique", verified_url: "https://buildium.com" },
                { name: "TurboTenant", x_value: 60, y_value: 70, quadrant_label: "Établi", verified_url: "https://turbotenant.com" },
                { name: "DoorLoop", x_value: 50, y_value: 50, quadrant_label: "Challenger", verified_url: "https://doorloop.com" },
                { name: "Tableurs", x_value: 20, y_value: 20, quadrant_label: "Substitut Direct", verified_url: "" }
            ],
            strategic_opening: {
                label: "Automatisation IA",
                quadrant_label: "Océan Bleu"
            }
        },
        customer_intel: {
            top_complaints: [
                { quote: "Leur interface ressemble à Windows 98. Il faut 10 clics pour enregistrer un paiement.", source: "Avis G2", competitor: "Géant Historique" },
                { quote: "Trop cher pour quelqu'un avec juste 5 unités. Je n'ai pas besoin de fonctions entreprise.", source: "Reddit", competitor: "Buildium" },
                { quote: "Le support met 3 jours à répondre. Mon locataire attend.", source: "Capterra", competitor: "TurboTenant" }
            ],
            pain_word_cloud: [
                { term: "Interface Lourde", mentions: 145 },
                { term: "Cher", mentions: 120 },
                { term: "Support Lent", mentions: 98 },
                { term: "Difficile à apprendre", mentions: 85 },
                { term: "App mobile nulle", mentions: 76 }
            ]
        },
        spy_footer: {
            verdyct_summary: {
                title: "Opportunité Grande Ouverte",
                text: "Les acteurs en place sont chers et ont une UX terrible. Il y a un vide massif pour une solution 'Mobile-First', pilotée par l'IA qui simplifie les tâches simples pour les petits propriétaires."
            },
            highlight_boxes: [
                { value: "Élevé", label: "Potentiel de Disruption" },
                { value: "Faible", label: "UI/UX Concurrents" }
            ]
        }
    },
    // Financier Data
    financier: {
        title: "Projections Financières",
        score: 92,
        pricing_model: {
            title: "Abonnement SaaS",
            tiers: [
                { name: "Starter", price: "Gratuit", features: ["1 Propriété", "Screening de base", "Journal Loyer Manuel"], recommended: false, benchmark_competitor: "", verified_url: "" },
                { name: "Proprio Pro", price: "$29/mois", features: ["Jusqu'à 10 Unités", "Screening Auto IA", "Collecte Loyer Auto", "Docs Légaux"], recommended: true, benchmark_competitor: "TurboTenant ($35)", verified_url: "" },
                { name: "Portefeuille", price: "$99/mois", features: ["Unités Illimitées", "Accès API", "Automatisation Fiscale", "Support Dédié"], recommended: false, benchmark_competitor: "", verified_url: "" }
            ]
        },
        profit_engine: {
            levers: {
                monthly_price: { value: 29, min: 9, max: 99, step: 1 },
                ad_spend: { value: 1000, min: 100, max: 5000, step: 100 },
                conversion_rate: { value: 3.5, min: 0.5, max: 10, step: 0.5 }
            },
            metrics: {
                ltv_cac_ratio: "8.5",
                status: "Sain",
                estimated_cac: "$45",
                estimated_ltv: "$380",
                break_even_users: "150",
                projected_runway_months: "18"
            }
        },
        revenue_projection: {
            projections: [
                { year: "Année 1", revenue: "$145,000" },
                { year: "Année 2", revenue: "$850,000" },
                { year: "Année 3", revenue: "$2,400,000" },
                { year: "Année 4", revenue: "$5,200,000" },
                { year: "Année 5", revenue: "$12,000,000" }
            ]
        },
        financier_footer: {
            verdyct_summary: "Avec un prix de 29 $ et un faible churn (les propriétaires restent des années), la LTV est exceptionnelle. La rentabilité est atteignable dès le Mois 5.",
            recommendation_text: "Fixez le prix à 29 $ pour casser les outils historiques tout en offrant une valeur IA supérieure."
        }
    },
    // Architect Data
    architect: {
        title: "Stack Technique",
        score: 96,
        mvp_status: {
            title: "Prêt à Déployer",
            status: "Généré",
            subtitle: "Un tableau de bord moderne pour propriétaires avec cartes de propriétés et listes de locataires.",
            mvp_screenshot_url: "",
            mvp_live_link: "https://lovable.dev?prompt=Create%20a%20comprehensive%20SaaS%20dashboard%20for%20'EstateFlow'%2C%20an%20AI-powered%20property%20management%20platform%20for%20independent%20landlords.%0A%0A1.%20Visual%20Identity%20%26%20Theme%3A%0A-%20Primary%20Color%3A%20Emerald%20Green%20(%2310B981)%20evoking%20growth%20and%20stability.%0A-%20Secondary%20Color%3A%20Deep%20Navy%20(%230F172A)%20for%20trust%20and%20professionalism.%0A-%20Background%3A%20Clean%20white/gray%20for%20content%20areas%2C%20dark%20sidebar.%0A-%20Typography%3A%20Inter%20for%20UI%20elements%2C%20Playfair%20Display%20for%20hero%20headings%20to%20add%20a%20touch%20of%20prestige.%0A-%20Style%3A%20Modern%2C%20clean%2C%20with%20subtle%20glassmorphism%20on%20overlay%20cards%20and%20smooth%20shadows.%0A%0A2.%20Core%20Layout%20Structure%3A%0A-%20Left%20Sidebar%20(Fixed)%3A%20Logo%20top%2C%20Navigation%20(Dashboard%2C%20My%20Properties%2C%20Tenant%20CRM%2C%20Financials%2C%20Documents%2C%20Settings)%2C%20User%20Profile%20bottom.%0A-%20Top%20Bar%3A%20Search%20Global%2C%20Notifications%20(Bell)%2C%20Quick%20Actions%20Dropdown.%0A-%20Main%20Content%20Area%3A%20Spacious%20grid%20layout.%0A%0A3.%20Dashboard%20Widgets%20(The%20View)%3A%0A-%20'Financial%20Health'%20Row%3A%20Total%20Revenue%20(Monthly/YTD)%20with%20mini%20line%20chart%2C%20Occupancy%20Rate%20(Circular%20progress)%2C%20Outstanding%20Rent%20(Red%20alert).%0A-%20'Property%20Overview'%20Grid%3A%20Cards%20representing%20buildings.%20Each%20card%20shows%20photo%2C%20address%2C%20units%20occupied/total%2C%20and%20status%20badge.%0A-%20'Tenant%20Requests'%20List%3A%20Recent%20maintenance%20tickets%20(e.g.%20'Leaky%20faucet%20-%20Unit%204B')%20with%20priority%20tags.%0A-%20'AI%20Insights'%20Box%3A%20A%20special%20card%20showing%20a%20tip%20like%20'Rent%20for%20Unit%203A%20is%205%25%20below%20market%20average.%20Suggest%20increase%20at%20renewal.'%0A%0A4.%20Interactive%20Elements%3A%0A-%20Clicking%20a%20property%20card%20opens%20a%20detailed%20view.%0A-%20Hover%20states%20on%20all%20buttons.%0A-%20'Add%20Property'%20modal%20wizard.",
            mvp_button_text: "Voir MVP Live",
            build_stats: []
        },
        user_flow: {
            title: "Flux d'Onboarding",
            steps: [],
            figma_button_text: ""
        },
        tech_stack: {
            title: "Stack Moderne",
            categories: [
                { name: "Frontend", technologies: ["React", "Tailwind CSS", "Framer Motion"] },
                { name: "Backend", technologies: ["Python FastAPI", "OpenAI GPT-4o", "Stripe API"] },
                { name: "Base de données", technologies: ["Supabase (PostgreSQL)", "Redis"] },
                { name: "Infrastructure", technologies: ["Vercel", "Railway"] }
            ]
        },
        brand_kit: {
            title: "Confiance & Croissance",
            project_name: "EstateFlow",
            color_palette: ["#10B981", "#064E3B", "#ffffff"],
            typography: [{ use: "Titres", font: "Inter" }]
        },
        data_moat: {
            title: "Lac de Données Location",
            status: "Actif",
            features: []
        },
        architect_footer: {
            verdyct_summary: "Une architecture robuste et évolutive utilisant des technologies éprouvées. L'intégration IA via l'API OpenAI est simple mais à haute valeur ajoutée.",
            scoring_breakdown: [],
            recommendation_text: ""
        }
    }
};

export const getMockFullReport = (locale: string) => {
    return locale === 'fr' ? mockFullReportFr : mockFullReportEn;
};

// Deprecated
export const mockFullReport = mockFullReportEn;
