import json
from typing import Dict
from fastapi import HTTPException
from models import FinancierResponse
from utils import (
    openai_client, 
    tavily_client, 
    extract_tavily_results, 
    format_tavily_context, 
    extract_urls_from_context,
    clean_text_for_json,
    optimize_query
)

def get_pricing_intel(idea: str) -> Dict:
    """
    Effectue la recherche de pricing via Tavily.
    Recherche les prix des concurrents et les modèles de pricing SaaS.
    """
    try:
        # Recherche pour le pricing des concurrents
        pricing_query = f"Pricing for {idea} competitors SaaS pricing models"
        pricing_query = optimize_query(pricing_query)
        
        pricing_response = tavily_client.search(
            query=pricing_query,
            search_depth="advanced",
            max_results=10
        )
        
        pricing_results = extract_tavily_results(pricing_response)
        pricing_context = format_tavily_context(pricing_results)
        
        return {
            "pricing_context": pricing_context,
            "results_count": len(pricing_results)
        }
        
    except Exception as e:
        print(f"Error in pricing intel search: {e}")
        import traceback
        traceback.print_exc()
        return {
            "pricing_context": "",
            "results_count": 0
        }

def calculate_projections(monthly_price: float, ad_spend: float, conversion_rate: float) -> Dict:
    """
    Calcule les projections financières sur 5 ans.
    Cette fonction Python effectue TOUS les calculs mathématiques.
    L'IA ne doit PAS calculer ces projections.
    
    Formules:
    - CAC = Ad Spend / (Ad Spend * Conversion Rate / 100)
    - LTV = Monthly Price * (1 / Churn Rate) * Gross Margin
    - Revenue = Customers * Monthly Price * 12
    """
    # Assumptions basées sur les standards de l'industrie
    churn_rate = 0.05  # 5% churn mensuel (standard SaaS)
    gross_margin = 0.80  # 80% marge brute (standard SaaS)
    
    # Calcul du CAC (Customer Acquisition Cost)
    # Conversion rate est en pourcentage (ex: 2.5%)
    leads_per_month = ad_spend / 10  # Estimation: €10 par lead
    customers_per_month = leads_per_month * (conversion_rate / 100)
    
    if customers_per_month > 0:
        cac = ad_spend / customers_per_month
    else:
        cac = ad_spend  # Fallback si pas de conversions
    
    # Calcul du LTV (Lifetime Value)
    # LTV = Monthly Price * Average Lifetime * Gross Margin
    average_lifetime_months = 1 / churn_rate  # 20 mois en moyenne
    ltv = monthly_price * average_lifetime_months * gross_margin
    
    # Calcul du ratio LTV:CAC
    if cac > 0:
        ltv_cac_ratio = ltv / cac
    else:
        ltv_cac_ratio = 0
    
    # Déterminer le statut
    if ltv_cac_ratio >= 3:
        status = "Excellent"
    elif ltv_cac_ratio >= 2:
        status = "Good"
    elif ltv_cac_ratio >= 1:
        status = "Fair"
    else:
        status = "Poor"
    
    # Projections de revenus sur 5 ans
    # Modèle de croissance: croissance mensuelle des clients
    growth_rate = 0.10  # 10% de croissance mensuelle (agressif mais réaliste)
    projections = []
    
    current_customers = 0
    for year in range(1, 6):
        # Calculer le nombre de clients à la fin de l'année
        # On commence avec quelques clients et on grandit
        if year == 1:
            # Année 1: croissance depuis 0
            customers_end_year = customers_per_month * 12
        else:
            # Années suivantes: croissance composée
            customers_start_year = current_customers
            for month in range(12):
                new_customers = customers_per_month * (1 + growth_rate) ** (year - 1)
                churned = customers_start_year * churn_rate
                customers_start_year = customers_start_year + new_customers - churned
            customers_end_year = customers_start_year
        
        current_customers = customers_end_year
        
        # Revenu annuel = clients moyens * prix mensuel * 12
        # Approximation: moyenne entre début et fin d'année
        avg_customers = customers_end_year * 0.6  # Approximation
        annual_revenue = avg_customers * monthly_price * 12
        
        # Formater en euros
        if annual_revenue >= 1000:
            revenue_str = f"€{annual_revenue:,.0f}".replace(",", " ")
        else:
            revenue_str = f"€{annual_revenue:.0f}"
        
        projections.append({
            "year": f"Year {year}",
            "revenue": revenue_str
        })
    
    return {
        "cac": cac,
        "ltv": ltv,
        "ltv_cac_ratio": ltv_cac_ratio,
        "status": status,
        "projections": projections
    }

def generate_financier_analysis(idea: str, pricing_context: str, language: str = "en", max_retries: int = 3) -> FinancierResponse:
    """Génère l'analyse financière via OpenAI (sans calculer les projections)"""
    
    # Extraire les URLs disponibles depuis le contexte
    pricing_urls = extract_urls_from_context(pricing_context)
    
    if not pricing_urls:
        raise ValueError("No URLs found in Tavily search results. Cannot verify any pricing information.")
    
    # Construire la section de contexte
    if pricing_context:
        pricing_section = f"PRICING DATA FROM TAVILY:\n{pricing_context}"
    else:
        pricing_section = "No pricing data available."
    
    # Liste des URLs disponibles pour référence
    urls_list = "\n".join([f"- {url}" for url in pricing_urls.keys()]) if pricing_urls else "No URLs available"
    
    system_prompt = f"""You are a strategic CFO. Your task is to analyze a startup idea and suggest a pricing model and baseline assumptions.

The startup idea to analyze is: {idea}

{pricing_section}

**STEP 1: DETECT BUSINESS MODEL TYPE**
Analyze the idea and categorize it into one of these types:
1. **SaaS (B2B/B2C):** Recurring revenue (e.g., Slack, Netflix). -> Use 'Monthly Subscription'.
2. **Marketplace:** Connecting buyers/sellers (e.g., Uber, Airbnb). -> Use 'Commission/Take Rate' (Price = 0, Revenue comes from %).
3. **Transactional/E-commerce:** Selling goods (e.g., Shopify store). -> Use 'Unit Margin' or 'Average Cart Value'.
4. **Ad-Supported:** Free for users (e.g., Facebook). -> Use 'CPM/Ad Revenue'.

**STEP 2: ADAPT PRICING TIERS**
- If **SaaS**: Show Tiers with 'Price /mo'.
- If **Marketplace**: Show Tiers based on 'Commission %' (e.g., Standard: 15%, Pro: 25% + Boost). The 'price' field should be the text 'X% Commission'.
- If **Transactional**: Show 'Average Unit Price'.

**CRITICAL:** Do NOT suggest a €199/month subscription for a food delivery app meant for end-users. That is a hallucination.

**CRITICAL RULES:**

1. **Pricing Tiers:**
   - You MUST suggest exactly 3 pricing tiers: "Acquisition", "Profit", and "Scale"
   - Each tier MUST have a verified_url from the pricing data above
   - Use ONLY real competitor names found in the data (e.g., "Expensify", "QuickBooks")
   - NEVER use placeholders like "Competitor X"
   - The benchmark_competitor MUST be a real competitor name from the data
   - Each tier MUST have at least 2-3 features
   - Mark ONE tier as recommended: true (typically the "Profit" tier)

2. **Lever Values (Initial Assumptions):**
   - monthly_price: Set based on the "Profit" tier price.
     * If SaaS: Extract the monthly price (e.g., "€19" -> 19).
     * If Marketplace/Transactional: Estimate the Average Revenue Per User (ARPU) or Average Commission Value per active user per month (e.g., if 15% comm on €100 spend -> 15).
   - ad_spend: Set between 100-5000 based on industry standards (startup: 500, scale: 2000)
   - conversion_rate: Set between 0.5-10% based on industry (SaaS average: 2-3%)
   - Set realistic min/max/step values for each lever

3. **DO NOT CALCULATE - Use Placeholders:**
   - For profit_engine.metrics: Use placeholder values that will be replaced by Python calculations:
     * ltv_cac_ratio: "0:1" (placeholder)
     * status: "Calculating" (placeholder)
     * estimated_cac: "€0" (placeholder)
     * estimated_ltv: "€0" (placeholder)
   - For revenue_projection.projections: Provide a placeholder array with 5 years:
     * [{{"year": "Year 1", "revenue": "€0"}}, {{"year": "Year 2", "revenue": "€0"}}, ...]
   - Python will replace ALL these values with actual calculations
   - Focus on providing accurate pricing_model and profit_engine.levers

**URL VALIDATION REQUIREMENT - ANTI-HALLUCINATION RULE:**
- EVERY pricing tier MUST have a verified_url from the pricing data above
- The verified_url MUST be one of the URLs from the VERIFIED_URL fields in the data
- If you cannot find a URL that contains the pricing, DO NOT include that tier
- The verified_url field is MANDATORY and cannot be empty or placeholder

**LANGUAGE INSTRUCTION:**
- The user has requested the report in: **{language}**
- **CRITICAL:** All textual content in your JSON response (titles, feature names, statuses, summaries, etc.) **MUST** be in **{language}**.
- Do not translate the field names (keys) of the JSON structure, only the values.
- **TECHNICAL TERMS:** Do NOT translate standard technical terms literally (e.g., 'SaaS', 'B2B', 'LTV', 'CAC', 'Margin'). Keep them as standard industry terms or use commonly accepted equivalents in {language}.

**CRITICAL - MINIMUM REQUIREMENTS:**
- You MUST provide AT LEAST ONE pricing tier with a valid verified_url
- You MUST provide all 3 levers (monthly_price, ad_spend, conversion_rate)
- If you cannot meet these minimum requirements, the system will retry automatically
- DO NOT return empty lists - this will cause the system to fail and retry

Available URLs for reference:
{urls_list}

Be data-driven. Use ONLY the actual pricing data provided. NEVER include pricing tiers without a verified_url. ALWAYS ensure you provide at least the minimum required verified data."""

    try:
        response = openai_client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Suggest a pricing model and baseline assumptions for this startup idea: {idea}"}
            ],
            response_format=FinancierResponse,
            temperature=0.7
        )
        
        if not response.choices or len(response.choices) == 0:
            raise ValueError("No response choices returned from OpenAI")
        
        message = response.choices[0].message
        
        if not hasattr(message, 'parsed') or message.parsed is None:
            if hasattr(message, 'content') and message.content:
                import json
                try:
                    content_dict = json.loads(message.content)
                    analysis = FinancierResponse(**content_dict)
                except (json.JSONDecodeError, ValueError) as parse_error:
                    raise ValueError(f"Failed to parse OpenAI response: {parse_error}")
            else:
                raise ValueError("No parsed response and no content available from OpenAI")
        else:
            analysis = message.parsed
        
        # Nettoyer tous les champs texte
        try:
            import json
            analysis_dict = analysis.model_dump()
            def clean_dict_recursive(obj):
                if isinstance(obj, dict):
                    return {k: clean_dict_recursive(v) for k, v in obj.items()}
                elif isinstance(obj, list):
                    return [clean_dict_recursive(item) for item in obj]
                elif isinstance(obj, str):
                    return clean_text_for_json(obj)
                else:
                    return obj
            cleaned_dict = clean_dict_recursive(analysis_dict)
            analysis = FinancierResponse(**cleaned_dict)
        except Exception as e:
            print(f"Warning: Could not clean parsed response: {e}")
        
        if not isinstance(analysis, FinancierResponse):
            raise ValueError("Failed to parse response as FinancierResponse")
        
        # Validation post-processing : vérifier que toutes les URLs sont valides
        valid_urls = set(pricing_urls.keys())
        analysis_dict = analysis.model_dump()
        
        # Valider les URLs des pricing tiers
        if 'financier' in analysis_dict and 'pricing_model' in analysis_dict['financier']:
            if 'tiers' in analysis_dict['financier']['pricing_model']:
                valid_tiers = []
                for tier in analysis_dict['financier']['pricing_model']['tiers']:
                    verified_url = tier.get('verified_url', '')
                    if verified_url and verified_url in valid_urls:
                        valid_tiers.append(tier)
                    else:
                        print(f"Warning: Pricing tier {tier.get('name', 'Unknown')} has invalid or missing URL: {verified_url}")
                analysis_dict['financier']['pricing_model']['tiers'] = valid_tiers
        
        # Validation stricte
        if len(analysis_dict.get('financier', {}).get('pricing_model', {}).get('tiers', [])) == 0:
            raise ValueError("No valid pricing tiers found with verified URLs. All tiers were filtered out.")
        
        # Recréer l'objet avec les données validées
        analysis = FinancierResponse(**analysis_dict)
        
        # POST-PROCESSING: Calculer les projections avec Python
        # Extraire le monthly_price depuis les levers
        monthly_price = analysis.financier.profit_engine.levers.monthly_price.value
        ad_spend = analysis.financier.profit_engine.levers.ad_spend.value
        conversion_rate = analysis.financier.profit_engine.levers.conversion_rate.value
        
        # Calculer les projections
        calculations = calculate_projections(monthly_price, ad_spend, conversion_rate)
        
        # Mettre à jour les métriques calculées
        analysis_dict = analysis.model_dump()
        analysis_dict['financier']['profit_engine']['metrics'] = {
            "ltv_cac_ratio": f"{calculations['ltv_cac_ratio']:.1f}:1",
            "status": calculations['status'],
            "estimated_cac": f"€{calculations['cac']:.0f}",
            "estimated_ltv": f"€{calculations['ltv']:.0f}"
        }
        
        # Mettre à jour les projections de revenus
        analysis_dict['financier']['revenue_projection'] = {
            "projections": calculations['projections']
        }
        
        # Recréer l'objet final avec les calculs
        analysis = FinancierResponse(**analysis_dict)
        
        return analysis
        
    except HTTPException:
        raise
    except ValueError as ve:
        # Les ValueError sont relancés pour permettre le retry
        raise ve
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error generating financier analysis: {error_details}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating financier analysis: {str(e)}"
        )
