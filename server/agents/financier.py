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

def get_financial_intel(idea: str) -> Dict:
    """
    Effectue la recherche financière globale (Pricing + Costs).
    1. Concurrent Pricing Models
    2. Operational Cost Benchmarks (Server, Team, Tools) for this industry
    """
    try:
        results = {}
        
        # 1. Pricing Search
        pricing_query = optimize_query(f"Pricing for {idea} competitors SaaS pricing models")
        print(f"   💰 Searching Pricing: {pricing_query}...")
        r_pricing = tavily_client.search(query=pricing_query, search_depth="advanced", max_results=6)
        pricing_res = extract_tavily_results(r_pricing)
        results["pricing_context"] = format_tavily_context(pricing_res)
        
        # 2. Cost/Operating Benchmarks Search (LEAN/BOOTSTRAP FOCUSED)
        cost_query = optimize_query(f"Bootstrapped operating costs for {idea} solopreneur indie hacker tech stack")
        print(f"   📉 Searching Costs (Lean): {cost_query}...")
        r_costs = tavily_client.search(query=cost_query, search_depth="advanced", max_results=4)
        cost_res = extract_tavily_results(r_costs)
        results["cost_context"] = format_tavily_context(cost_res)
        
        results["results_count"] = len(pricing_res) + len(cost_res)
        return results
        
    except Exception as e:
        print(f"Error in financial intel search: {e}")
        return {
            "pricing_context": "",
            "cost_context": "",
            "results_count": 0
        }

def calculate_projections(monthly_price: float, ad_spend: float, conversion_rate: float, cost_structure: list = []) -> Dict:
    """
    Calcule les projections financières (Revenue, Profit, Break-Even, Runway).
    Now includes Fixed Cost analysis from LLM data.
    """
    # 1. Analyze Costs
    fixed_costs = 0
    variable_costs_per_user = 0
    
    # Defaults if no structure provided
    if not cost_structure:
        fixed_costs = 100 # Low default for lean startups (Domains, minimal hosting)
    else:
        for cost in cost_structure:
            # Handle both dict and Pydantic object
            c_amount = cost.get('monthly_amount', 0) if isinstance(cost, dict) else cost.monthly_amount
            c_var = cost.get('is_variable', False) if isinstance(cost, dict) else cost.is_variable
            
            if c_var:
                variable_costs_per_user += c_amount # Assuming 'variable' costs are entered as unit costs by LLM
            else:
                fixed_costs += c_amount

    # Gross Margin (Unit Economics)
    # Revenue per user - Variable Cost
    gross_profit_per_user = monthly_price - variable_costs_per_user
    if gross_profit_per_user <= 0: gross_profit_per_user = monthly_price * 0.2 # Fallback to 20% if costs > price

    # 2. Key Metrics
    churn_rate = 0.05
    
    # LEAN VISIBILITY ALGORITHM
    # 1. Base Organic Traffic (SEO/Social/Communities) - Every founder does some manual work
    base_organic_traffic = 300 # Visitors per month (Sweat Equity)
    
    # 2. Paid Traffic
    paid_leads = ad_spend / 1.5 if ad_spend > 0 else 0
    
    # Total Leads
    total_leads = base_organic_traffic + paid_leads
    
    customers_per_month = total_leads * (conversion_rate / 100)
    
    cac = ad_spend / customers_per_month if customers_per_month > 0 else ad_spend
    ltv = gross_profit_per_user / churn_rate
    ltv_cac_ratio = ltv / cac if cac > 0 else 0

    # 3. Break-Even Analysis
    # Breakeven Users = Fixed Costs / Gross Profit per User
    break_even_users = fixed_costs / gross_profit_per_user if gross_profit_per_user > 0 else 0
    break_even_users = int(break_even_users)

    # 4. Burn Rate & Runway
    seed_money = 50000 # Assumption: Friends & Family / Pre-seed
    # Runway = Seed / Net Burn (Fixed Costs - Revenue) -> Simplified to (Seed / Fixed Costs) for Day 0
    runway_months = seed_money / fixed_costs if fixed_costs > 0 else 99
    
    # Status
    if ltv_cac_ratio >= 3 and runway_months > 12: status = "Excellent"
    elif ltv_cac_ratio >= 1.5: status = "Good"
    elif ltv_cac_ratio >= 1: status = "Fair"
    else: status = "Risk"

    # 5. Projections (5 Years)
    growth_rate = 0.15 # 15% MoM early stage
    projections = []
    current_customers = 0
    
    # Track when we hit breakeven
    months_to_breakeven = None
    accumulated_cash = seed_money

    for year in range(1, 6):
        customers_end_year = 0
        annual_revenue = 0
        annual_profit = 0
        
        # Monthly simulation for precision
        for m in range(12):
            if year == 1 and m == 0:
                new = customers_per_month
            else:
                new = customers_per_month * ((1 + growth_rate) if current_customers < 1000 else 1.05)
            
            churn = current_customers * churn_rate
            current_customers += (new - churn)
            
            # Monthly Financials
            m_revenue = current_customers * monthly_price
            m_costs = fixed_costs + (current_customers * variable_costs_per_user) + ad_spend
            m_profit = m_revenue - m_costs
            
            annual_revenue += m_revenue
            annual_profit += m_profit
            accumulated_cash += m_profit

            if m_profit > 0 and months_to_breakeven is None:
                months_to_breakeven = ((year - 1) * 12) + m

        # Format
        fmt = lambda x: f"€{x:,.0f}".replace(",", " ")
        projections.append({
            "year": f"Year {year}",
            "revenue": fmt(annual_revenue),
            "profit": fmt(annual_profit),
            "customers": f"{int(current_customers)}"
        })

    return {
        "cac": cac,
        "ltv": ltv,
        "ltv_cac_ratio": ltv_cac_ratio,
        "status": status,
        "projections": projections,
        "break_even_users": f"{break_even_users:,}".replace(",", " "),
        "projected_runway_months": f"{int(runway_months)} months" if accumulated_cash > 0 else "0 months"
    }

def generate_financier_analysis(idea: str, pricing_context: str, cost_context: str = "", language: str = "en", max_retries: int = 3) -> FinancierResponse:
    """Génère l'analyse financière via OpenAI (sans calculer les projections)"""
    
    # Extraire les URLs disponibles depuis le contexte
    pricing_urls = extract_urls_from_context(pricing_context)
    cost_urls = extract_urls_from_context(cost_context)
    all_urls = {**pricing_urls, **cost_urls}
    
    if not all_urls:
         # Warn but don't crash, allowing inference if possible (similar to Spy)
         print("Warning: No financial URLs found. Proceeding with inference.")
    
    # Construire la section de contexte
    pricing_section = f"PRICING DATA:\n{pricing_context}" if pricing_context else "No pricing data available."
    cost_section = f"OPERATING COST BENCHMARKS:\n{cost_context}" if cost_context else "No specific cost benchmarks available."
    
    # Liste des URLs disponibles pour référence
    urls_list = "\n".join([f"- {url}" for url in all_urls.keys()]) if all_urls else "No URLs available"
    
    system_prompt = f"""You are a Bootstrapped Founder Advisor. Your task is to analyze a startup idea and suggest a lean pricing model, low-cost operating structure, and realistic roadmap for a solopreneur.

The startup idea to analyze is: {idea}

{pricing_section}

{cost_section}

**STEP 1: DETECT BUSINESS MODEL TYPE**
Analyze the idea and categorize it into one of these types:
1. **SaaS (B2B/B2C):** Recurring revenue -> Use 'Monthly Subscription'.
2. **Marketplace:** Connecting buyers/sellers -> Use 'Commission/Take Rate'.
3. **Transactional/E-commerce:** Selling goods -> Use 'Unit Margin'.

**STEP 2: ADAPT PRICING TIERS (LEAN)**
- Suggest exactly 3 tiers ("Early Bird/Starter", "Pro", "Scale").
- **CRITICAL:** Each tier MUST have a verified_url from the pricing data if available.

**STEP 3: ESTIMATE OPERATING COSTS (BOOTSTRAP MODE)**
- Estimate 4-6 categories of monthly operating costs for a SOLOPRENEUR.
- **MINDSET:** Prioritize FREE TIERS (Vercel, Supabase, Stripe, Gmail). 
- Assume the founder does NOT take a salary initially (Sweat Equity).
- Include: Domain Name (~€1-2/mo), Hosting (Free/Low), Email Marketing (Free tier), Legal/Admin.
- Mark costs that scale with users as `is_variable: true`, fixed costs as `is_variable: false`.
- **REALISM:** Total MVP fixed costs should often be under €100-200/mo.

**STEP 4: FINANCIAL ROADMAP (INDIE HACKER)**
- Outline 3 phases: "Bootstrap (MVP)", "Validation (First Customers)", "Scale (Revenue Funded)".
- **Phase 1 (Bootstrap):** Budget €0-€500. Goal: Launch MVP using sweat equity.
- **Phase 2 (Validation):** Focus on first 100 paying customers via manual outreach/SEO.
- **Phase 3 (Scale):** Reinvest revenue into ads/better tools.

**CRITICAL RULES:**
1. **Pricing Tiers:**
   - Use ONLY real competitor names found in the data.
   - The verified_url field is MANDATORY where possible.

2. **Lever Values:**
   - monthly_price: Set based on the "Pro" tier.
   - ad_spend: Set a realistic monthly budget for a starter (e.g., €0-€500).
   - conversion_rate: 1-5%.

3. **DO NOT CALCULATE METRICS:**
   - For profit_engine.metrics and revenue_projection.projections, use PLACEHOLDERS.
   - Python will calculate standard metrics AND Break-Even/Runway based on your Cost Structure.

**LANGUAGE INSTRUCTION:**
- The user has requested the report in: **{language}**
- **CRITICAL:** All textual content (titles, names, summaries) **MUST** be in **{language}**. Do not translate JSON keys/fields, only values.

Available URLs for reference:
{urls_list}
"""

    try:
        response = openai_client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Generate detailed financial analysis including cost structure for: {idea}"}
            ],
            response_format=FinancierResponse,
            temperature=0.7
        )
        
        if not response.choices or len(response.choices) == 0:
            raise ValueError("No response choices returned from OpenAI")
        
        message = response.choices[0].message
        
        if not hasattr(message, 'parsed') or message.parsed is None:
             # Fallback parsing logic (same as before)
             if hasattr(message, 'content') and message.content:
                import json
                try:
                    content_dict = json.loads(message.content)
                    analysis = FinancierResponse(**content_dict)
                except Exception as e:
                    raise ValueError(f"Failed to parse OpenAI response: {e}")
             else:
                raise ValueError("No parsed response available")
        else:
            analysis = message.parsed
        
        # Clean text
        try:
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
            print(f"Warning: Cleaning failed: {e}")

        # Post-Processing: Calculations
        analysis_dict = analysis.model_dump()
        
        monthly_price = analysis.financier.profit_engine.levers.monthly_price.value
        ad_spend = analysis.financier.profit_engine.levers.ad_spend.value
        conversion_rate = analysis.financier.profit_engine.levers.conversion_rate.value
        cost_structure = analysis.financier.cost_structure or []
        
        # PASS COST STRUCTURE TO CALCULATIONS
        calculations = calculate_projections(monthly_price, ad_spend, conversion_rate, cost_structure)
        
        # Update metrics
        analysis_dict['financier']['profit_engine']['metrics'] = {
            "ltv_cac_ratio": f"{calculations['ltv_cac_ratio']:.1f}:1",
            "status": calculations['status'],
            "estimated_cac": f"€{calculations['cac']:.0f}",
            "estimated_ltv": f"€{calculations['ltv']:.0f}",
            "break_even_users": calculations['break_even_users'], # NEW
            "projected_runway_months": calculations['projected_runway_months'] # NEW
        }
        
        # Update projections
        analysis_dict['financier']['revenue_projection'] = {
            "projections": calculations['projections']
        }
        
        return FinancierResponse(**analysis_dict)
        
    except HTTPException:
        raise
    except ValueError as ve:
        raise ve
    except Exception as e:
        import traceback
        print(f"Error generating financier analysis: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
