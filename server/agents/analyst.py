import json
from typing import Dict
from fastapi import HTTPException
from models import AnalystResponse, RescuePlan, Analyst
from utils import (
    openai_client, 
    tavily_client, 
    extract_tavily_results, 
    format_tavily_context, 
    clean_text_for_json,
    optimize_query
)

def calculate_pos(breakdown: list, confidence_level: str = "Medium") -> int:
    """
    Calcule le Predictive Opportunity Score (POS) 2.0.
    Based on 7 dimensions, Kill Switches, and Data Confidence.
    """
    scores = {}
    for item in breakdown:
        key = item.name.lower()
        scores[key] = item.score
        
    # 1. Extract Scores (Default to 5 if missing to avoid crash, but prompt should enforce)
    # Mapping flexible names to 7 dimensions
    s_magnitude = 0
    s_momentum = 0
    s_urgency = 0
    s_void = 0
    s_uniqueness = 0
    s_feasibility = 0
    s_macro = 0
    
    for name, score in scores.items():
        if "magnitude" in name or "size" in name or "tam" in name:
            s_magnitude = score
        elif "momentum" in name or "growth" in name or "cagr" in name:
            s_momentum = score
        elif "urgency" in name or "need" in name or "pain" in name:
            s_urgency = score
        elif "void" in name or "competition" in name or "entry" in name:
            s_void = score
        elif "uniqueness" in name or "moat" in name:
            s_uniqueness = score
        elif "feasibility" in name or "tech" in name:
            s_feasibility = score
        elif "macro" in name or "risk" in name:
            s_macro = score

    # 2. Weighted Sum (Total weights = 10.0)
    # Market Magnitude: 15% (1.5)
    # Market Momentum: 15% (1.5)
    # Problem Urgency: 25% (2.5)
    # Competitive Void: 20% (2.0)
    # Solution Uniqueness: 10% (1.0)
    # Tech Feasibility: 10% (1.0)
    # Macro Risk: 5% (0.5)
    
    base_score = (
        (s_magnitude * 1.5) +
        (s_momentum * 1.5) +
        (s_urgency * 2.5) +
        (s_void * 2.0) +
        (s_uniqueness * 1.0) +
        (s_feasibility * 1.0) +
        (s_macro * 0.5)
    )
    
    # 3. Kill Switches (Multiplicative Penalties)
    
    # Red Ocean Penalty: If Competitive Void < 3 (Saturated)
    if s_void < 3.0:
        base_score *= 0.6
        
    # Dying Market Penalty: If Momentum < 2 (Stagnant/Declining)
    if s_momentum < 2.0:
        base_score *= 0.7
        
    # Regulatory Wall Penalty: If Macro Risk < 3 (High Danger)
    if s_macro < 3.0:
        base_score *= 0.8

    # 4. Data Confidence Adjustment
    if confidence_level == "Low":
        base_score *= 0.7
    elif confidence_level == "Medium":
        base_score *= 0.9
    # High confidence = no penalty (x1.0)
    
    return int(min(100, max(0, base_score)))

def search_market_data(idea: str) -> Dict:
    """
    Effectue une recherche approfondie (Deep Research) en plusieurs étapes.
    1. Market Size & Growth (TAM, CAGR)
    2. Trends & Drivers
    3. Audience & Demographics
    Combines results for a richer context.
    """
    try:
        all_results = []
        
        # Step 1: Market Size & Growth
        query_size = optimize_query(f"Total addressable market size TAM SAM CAGR statistics for {idea} 2024 2025")
        try:
            r1 = tavily_client.search(query=query_size, search_depth="advanced", max_results=5, include_answer=True)
            all_results.extend(extract_tavily_results(r1))
        except Exception as e:
            print(f"Error in Step 1 (Size): {e}")

        # Step 2: Trends & Drivers
        query_trends = optimize_query(f"Key market trends growth drivers and challenges for {idea} industry")
        try:
            r2 = tavily_client.search(query=query_trends, search_depth="advanced", max_results=5)
            all_results.extend(extract_tavily_results(r2))
        except Exception as e:
            print(f"Error in Step 2 (Trends): {e}")

        # Step 3: Customer Segments
        query_users = optimize_query(f"Target audience customer demographics and psychographics for {idea} users")
        try:
            r3 = tavily_client.search(query=query_users, search_depth="advanced", max_results=4)
            all_results.extend(extract_tavily_results(r3))
        except Exception as e:
            print(f"Error in Step 3 (Users): {e}")
        
        # Deduplicate based on URL
        unique_results = {}
        for res in all_results:
            if res['url'] not in unique_results:
                unique_results[res['url']] = res
        
        final_results_list = list(unique_results.values())
        context = format_tavily_context(final_results_list)
        
        return {
            "context": context,
            "results_count": len(final_results_list)
        }
        
    except Exception as e:
        print(f"Error in market data search: {e}")
        return {
            "context": "",
            "results_count": 0
        }

def generate_analysis(idea: str, market_data_context: str, language: str = "en", max_retries: int = 3) -> AnalystResponse:
    """
    Génère l'analyse structurée via OpenAI en utilisant le contexte de marché.
    Inclut la logique de validation et de retry.
    """
    
    # Extraire les URLs disponibles depuis le contexte pour la validation
    # On parse le contexte texte pour récupérer les URLs
    market_urls = {}
    if market_data_context:
        import re
        # Pattern pour extraire [SOURCE X] ... VERIFIED_URL: <url>
        pattern = r'\[SOURCE \d+\](.*?)VERIFIED_URL: ([^\n]+)'
        matches = re.finditer(pattern, market_data_context, re.DOTALL)
        for match in matches:
            content = match.group(1).strip()
            url = match.group(2).strip()
            if url and url not in market_urls:
                market_urls[url] = content
    
    # Determine Data Confidence Level
    num_verified_sources = len(market_urls)
    if num_verified_sources == 0:
        confidence_level = "Low"
    elif num_verified_sources < 3:
        confidence_level = "Medium"
    else:
        confidence_level = "High"
    
    if not market_urls:
        # Si aucune URL n'est trouvée (Tavily a échoué ou pas de résultats), on ne peut pas valider
        # On lève une erreur pour déclencher le retry ou l'échec
        raise ValueError("No URLs found in Tavily search results. Cannot verify any information.")

    # Construire la section de contexte pour le prompt
    if market_data_context:
        market_data_section = f"REAL MARKET DATA FROM TAVILY:\n{market_data_context}"
    else:
        market_data_section = "No market research data available."
    
    # Liste des URLs disponibles pour référence
    urls_list = "\n".join([f"- {url}" for url in market_urls.keys()]) if market_urls else "No URLs available"
    
    system_prompt = f"""You are an expert market analyst. Your task is to analyze a startup idea and generate a comprehensive market analysis report.

The idea to analyze is: {idea}

{market_data_section}

**URL VALIDATION REQUIREMENT - ANTI-HALLUCINATION RULE:**
- EVERY market metric (TAM, SAM, CAGR) MUST have a verified_url from the Tavily search results above
- The verified_url MUST be one of the URLs from the VERIFIED_URL fields in the market data above
- If you cannot find a URL that contains the metric data, DO NOT include that metric
- The verified_url field is MANDATORY and cannot be empty or placeholder

**LANGUAGE INSTRUCTION:**
- The user has requested the report in: **{language}**
- **CRITICAL:** All textual content in your JSON response (titles, descriptions, summaries, recommendations, etc.) **MUST** be in **{language}**.
- Do not translate the field names (keys) of the JSON structure, only the values.
- **TECHNICAL TERMS:** Do NOT translate standard technical terms literally (e.g., 'TAM', 'SAM', 'CAGR', 'Churn Rate', 'Burn Rate', 'Moat'). Keep them as standard industry terms or use commonly accepted equivalents in {language}.

**CRITICAL: INPUT VALIDATION (ANTI-NONSENSE RULE)**
- You must first evaluate if the input `{idea}` is a legitimate business idea or just a test/nonsense input.
- If the input is:
    - A single word like "test", "hello", "asdf", "foo"
    - A random string of characters
    - A greeting without business context
    - Clearly NOT a startup idea
- THEN you **MUST** enforce the following scoring to trigger the "Kill Switches":
    - **Competitive Void = 0** (Triggers Red Ocean Penalty)
    - **Market Momentum = 0** (Triggers Dying Market Penalty)
    - **Macro Risk = 0** (Triggers Regulatory Wall Penalty)
    - **Problem Urgency = 0**
- This will ensure the final POS score is near zero.
- DO NOT try to "invent" a business meaning for nonsense inputs.


**CRITICAL: "ANTI-GENERIC" SCORING RULE**
- If the idea is extremely vague, generic, or lacks a specific value proposition (e.g., "A sport app", "A CRM", "Fashion brand", "A social network"), you **MUST** apply the following penalties to ensure the score drops below 10:
    - **Market Magnitude = 1** (No defined target = No market)
    - **Competitive Void = 1** (Triggers Red Ocean Penalty)
    - **Solution Uniqueness = 1**
    - **Market Momentum = 1** (Triggers Dying Market Penalty) 
    - **Problem Urgency = 1** (No specific problem = Low urgency)
- Do NOT give benefit of difference to vague inputs. Treat them as non-viable until proven otherwise by specific details.

**CRITICAL - MINIMUM REQUIREMENTS:**
- You MUST provide AT LEAST ONE market metric (TAM, SAM, or CAGR) with a valid verified_url
- You MUST provide AT LEAST ONE keyword in the SEO opportunity section
- If you cannot meet these minimum requirements, the system will retry automatically
- DO NOT return empty lists - this will cause the system to fail and retry

Generate a detailed analysis report following this structure:
- Calculate a score (0-100) based on 7 specific dimensions.
- Provide market metrics (TAM, SAM, CAGR) with realistic values based on the research data
  * For EACH metric, you MUST provide a verified_url from the data above
  * The metric value MUST be based on actual data found in the URL content
- Identify SEO opportunities with high-opportunity keywords.
- Create a detailed ideal customer persona.
- Provide a comprehensive analyst footer with summary, scoring breakdown, and recommendation.

**SCORING RULE: COMPETITION (The most critical score)**
You must score this from 0 to 10 based on **WINNABILITY**, not just activity.

* **0-2 (SUICIDE MISSION):** The market has dominant monopolies with strong Network Effects (e.g., Social Networks vs Facebook, Marketplaces vs Amazon/eBay/Airbnb). A new entrant has near-zero chance without a massive differentiator.
    * *Example:* "Another Dating App", "Phone Selling Marketplace", "YouTube competitor".
* **3-5 (RED OCEAN):** Crowded with many established players. Requires 10x better product to survive.
* **6-8 (OPEN MARKET):** Fragmented market, no clear winner, or sleepy incumbents. Good opportunity.
* **9-10 (BLUE OCEAN):** Brand new category or solving a problem nobody else is solving.

**CRITICAL INSTRUCTION:** If the user suggests a **Marketplace** (connecting buyers and sellers) in a sector already dominated by a giant (like Food Delivery, Second-hand goods, Taxi), you **MUST** give a Competition score between **0 and 2**. Do not be optimistic.

**SCORING RULE: UNIQUENESS (The "Wrapper" Detector)**
You must score this from 0 to 10 based on **DEFENSIBILITY** and **INNOVATION**.

* **0-2 (GENERIC WRAPPER):** A simple UI wrapper around an existing API (e.g., "ChatGPT for X", "DALL-E for Y"). No proprietary data, no technical moat. Can be cloned in a weekend.
* **3-5 (INCREMENTAL):** Better UX/UI or niche focus, but relies entirely on third-party tech. Low barrier to entry.
* **6-8 (DEFENSIBLE):** Proprietary data, complex integration, or strong network effect starting to form. Hard to replicate.
* **9-10 (DEEP TECH/MOAT):** Patentable technology, exclusive partnerships, or massive proprietary dataset. True innovation.

**SCORING BREAKDOWN (7 DIMENSIONS):**
The `scoring_breakdown` list MUST contain EXACTLY these 7 items (each scored 0-10):
1. "Market Magnitude" (Size/TAM)
2. "Market Momentum" (Growth/CAGR)
3. "Problem Urgency" (Pain level)
4. "Competitive Void" (Follow the STRICT SCORING RULE above - High score = Empty market, Low score = Saturated)
5. "Solution Uniqueness" (Follow the STRICT SCORING RULE above - High score = Deep Tech, Low score = Wrapper)
6. "Technical Feasibility" (Ease of Build)
7. "Macro Risk" (Regulatory/Economic - High score = Low Risk, Low score = High Risk)

**RISK FLAGS:**
Populate the `risk_flags` list with any critical risks identified, such as:
- "Saturated Market" (if Competitive Void < 3)
- "Declining Market" (if Market Momentum < 2)
- "Regulatory Risk" (if Macro Risk < 3)
- "Low Data Confidence" (if few sources found)

**DATA CONFIDENCE:**
Set `data_confidence_level` to "{confidence_level}" based on the number of verified sources found ({len(market_urls)}).

Available URLs for reference:
{urls_list}

Be realistic and data-driven. Use ONLY the actual research data provided. NEVER include market metrics without a verified_url. ALWAYS ensure you provide at least the minimum required verified data."""
    try:
        # Utiliser structured output avec parse
        response = openai_client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze this startup idea: {idea}"}
            ],
            response_format=AnalystResponse,
            temperature=0.7
        )
        
        # Extraire le résultat parsé
        if not response.choices or len(response.choices) == 0:
            raise ValueError("No response choices returned from OpenAI")
        
        message = response.choices[0].message
        
        # Vérifier si le parsing a réussi
        if not hasattr(message, 'parsed') or message.parsed is None:
            # Essayer de parser manuellement depuis le contenu
            if hasattr(message, 'content') and message.content:
                import json
                try:
                    content_dict = json.loads(message.content)
                    analysis = AnalystResponse(**content_dict)
                except (json.JSONDecodeError, ValueError) as parse_error:
                    raise ValueError(f"Failed to parse OpenAI response: {parse_error}")
            else:
                raise ValueError("No parsed response and no content available from OpenAI")
        else:
            analysis = message.parsed
        
        if not isinstance(analysis, AnalystResponse):
            raise ValueError("Failed to parse response as AnalystResponse")
        
        # Nettoyer tous les champs texte même si le parsing a réussi
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
            analysis = AnalystResponse(**cleaned_dict)
        except Exception as e:
            print(f"Warning: Could not clean parsed response: {e}")
        
        # Validation post-processing : vérifier que toutes les URLs sont valides
        valid_urls = set(market_urls.keys())
        
        # Convertir en dict pour validation et recréation
        analysis_dict = analysis.model_dump()
        
        # Valider les URLs des métriques de marché
        if 'analyst' in analysis_dict and 'market_metrics' in analysis_dict['analyst']:
            valid_metrics = []
            for metric in analysis_dict['analyst']['market_metrics']:
                verified_url = metric.get('verified_url', '')
                if verified_url and verified_url in valid_urls:
                    valid_metrics.append(metric)
                else:
                    print(f"Warning: Market metric {metric.get('name', 'Unknown')} has invalid or missing URL: {verified_url}")
            analysis_dict['analyst']['market_metrics'] = valid_metrics
        
        # Valider les keywords (doit avoir au moins 1 élément)
        if 'analyst' in analysis_dict and 'seo_opportunity' in analysis_dict['analyst']:
            if 'high_opportunity_keywords' in analysis_dict['analyst']['seo_opportunity']:
                if not analysis_dict['analyst']['seo_opportunity']['high_opportunity_keywords'] or len(analysis_dict['analyst']['seo_opportunity']['high_opportunity_keywords']) == 0:
                    raise ValueError("high_opportunity_keywords cannot be empty")
        
        # Validation stricte : vérifier que les listes critiques ne sont pas vides
        if len(analysis_dict.get('analyst', {}).get('market_metrics', [])) == 0:
            raise ValueError("No valid market metrics found with verified URLs. All metrics were filtered out.")
        
        # Recréer l'objet avec les données validées
        analysis = AnalystResponse(**analysis_dict)
        
        # CALCUL DU POS (Predictive Opportunity Score)
        # On le fait en Python pour être déterministe
        if analysis.analyst.analyst_footer.scoring_breakdown:
            pcs = calculate_pos(
                analysis.analyst.analyst_footer.scoring_breakdown, 
                confidence_level=confidence_level
            )
            analysis.analyst.pcs_score = pcs
            # On met aussi à jour le score global pour qu'il soit cohérent
            analysis.analyst.score = pcs
            
            # Ensure confidence level in response matches our calculation
            analysis.analyst.analyst_footer.data_confidence_level = confidence_level
        
        return analysis
        
    except HTTPException:
        raise
    except ValueError as ve:
        # Les ValueError sont relancés pour permettre le retry
        raise ve
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error generating analysis: {error_details}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating analysis: {str(e)}"
        )

def generate_rescue_plan(idea: str, analyst_data: Analyst, language: str = "en") -> RescuePlan:
    """
    Generates a rescue plan (Improve & Pivot) when the idea has a low PCS score.
    """
    # Extract scores safely from the 7 dimensions
    scores = {item.name.lower(): item.score for item in analyst_data.analyst_footer.scoring_breakdown}
    
    s_magnitude = next((v for k, v in scores.items() if "magnitude" in k or "size" in k), 0)
    s_void = next((v for k, v in scores.items() if "void" in k or "competition" in k), 0)
    s_urgency = next((v for k, v in scores.items() if "urgency" in k or "need" in k), 0)
    
    system_prompt = (
        f"You are a strategic startup advisor. A startup idea has been analyzed and received a LOW viability score (POS < 60).\n\n"
        f"The Idea: {idea}\n\n"
        f"Key Weaknesses Identified:\n"
        f"- Market Magnitude: {s_magnitude}/10\n"
        f"- Competitive Void: {s_void}/10\n"
        f"- Problem Urgency: {s_urgency}/10\n\n"
        f"Your task is to generate a 'Rescue Plan' with two distinct paths:\n\n"
        f"1. IMPROVE (The Fighters Path):\n"
        f"   - Give specific, actionable advice on how to tweak the CURRENT idea to make it viable.\n"
        f"   - Focus on fixing the weaknesses (e.g., niche down, change revenue model, target different persona).\n"
        f"   - **ai_suggested_prompt**: Generate a short, punchy phrase (5-10 words max) that represents this improved version. The user will click this to re-run the analysis. Example: 'AI captioning for true-crime podcasters'.\n\n"
        f"2. PIVOT (The Explorers Path):\n"
        f"   - Suggest a COMPLETELY DIFFERENT but RELATED business model.\n"
        f"   - It must leverage the same underlying domain or technology but target a more profitable/less saturated opportunity.\n"
        f"   - **ai_suggested_prompt**: Generate a short, punchy phrase (5-10 words max) for this new pivot idea. Example: 'Marketplace for vintage watch restoration'.\n\n"
        f"Ensure the 'ai_suggested_prompt' is ready to be used as a new input for the analysis.\n\n"
        f"**LANGUAGE INSTRUCTION:**\n"
        f"- The user has requested the response in: **{language}**\n"
        f"- **CRITICAL:** The entire response (titles, descriptions, prompts) MUST be in **{language}**.\n"
        f"- Do not translate technical terms literally if they are standard in {language}."
    )

    try:
        response = openai_client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate the rescue plan."}
            ],
            response_format=RescuePlan,
            temperature=0.7
        )
        
        if not response.choices or not response.choices[0].message.parsed:
            raise ValueError("Failed to generate rescue plan")
            
        return response.choices[0].message.parsed
        
    except Exception as e:
        print(f"Error generating rescue plan: {e}")
        # Fallback if generation fails
        return RescuePlan(
            improve={"title": "Refine Value Proposition", "description": "Focus on a specific niche.", "ai_suggested_prompt": "Niche down to specific vertical"},
            pivot={"title": "Explore Adjacent Markets", "description": "Look for similar problems in other industries.", "ai_suggested_prompt": "Pivot to adjacent market solution"}
        )
