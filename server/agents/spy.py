import json
from typing import Dict
from fastapi import HTTPException
from models import SpyResponse
from utils import (
    openai_client, 
    tavily_client, 
    extract_tavily_results, 
    format_tavily_context, 
    extract_urls_from_context,
    clean_text_for_json,
    optimize_query
)

def get_competitor_intel(idea: str) -> Dict:
    """
    Multistep Competitive Intelligence (Deep Research).
    1. Discovery: Identify real competitor names.
    2. Comparison: Feature & Pricing check.
    3. Sentiment: User complaints & reviews.
    4. (PREMIUM) Feature Matrix: Detailed capabilities comparison
    5. (PREMIUM) Pricing Intel: Pricing tiers breakdown
    """
    try:
        all_results = []
        landscape_context = ""
        pain_context = ""
        feature_context = ""  # NEW - Premium
        pricing_context = ""  # NEW - Premium
        
        print(f"\n🔍 Starting Tavily searches for: {idea[:60]}...")
        
        # Step 0: Extract generic search query (Crucial for new/invented names like 'ShadowBoard')
        search_terms = idea
        try:
            print("   Step 0: Extracting market keywords...")
            term_response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a search query expert. Extract the core market category and 2-3 key functional terms for this startup idea. Return ONLY the terms, no project names, no quotes. Example: 'Project X: A drone for walking dogs' -> 'drone dog walking service pet automation'"},
                    {"role": "user", "content": idea}
                ],
                max_tokens=30
            )
            search_terms = term_response.choices[0].message.content.strip()
            print(f"   ✅ Search terms extracted: '{search_terms}'")
        except Exception as e:
            print(f"   ⚠️ Keyword extraction failed, using original idea: {e}")
        
        # Step 1: Discovery (Who?)
        # Use extracted terms for broader discovery
        query_discovery = optimize_query(f"Top direct competitors for {search_terms} SaaS")
        try:
            print(f"   Step 1/5: Discovery (Query: {query_discovery[:50]}...)...")
            r1 = tavily_client.search(query=query_discovery, search_depth="advanced", max_results=5)
            discovery_results = extract_tavily_results(r1)
            all_results.extend(discovery_results)
            landscape_context += format_tavily_context(discovery_results)
            print(f"   ✅ Step 1 complete ({len(discovery_results)} results)")
        except Exception as e:
            print(f"   ❌ Step 1 failed: {e}")

        # Step 2: Comparison (Features/Pricing)
        # Use search terms to find comparison tables
        query_compare = optimize_query(f"Feature and pricing comparison {search_terms} vs competitors table")
        try:
            print(f"   Step 2/5: Comparison...")
            r2 = tavily_client.search(query=query_compare, search_depth="advanced", max_results=5)
            compare_results = extract_tavily_results(r2)
            all_results.extend(compare_results)
            landscape_context += "\n" + format_tavily_context(compare_results)
            print(f"   ✅ Step 2 complete ({len(compare_results)} results)")
        except Exception as e:
             print(f"   ❌ Step 2 failed: {e}")

        # Step 3: Sentiment (Pain points)
        # Use search terms to find real user complaints about the category/competitors
        query_sentiment = optimize_query(f"User complaints and negative reviews for {search_terms} tools reddit G2 Capterra")
        try:
            print(f"   Step 3/5: Sentiment...")
            r3 = tavily_client.search(query=query_sentiment, search_depth="advanced", max_results=6)
            sentiment_results = extract_tavily_results(r3)
            all_results.extend(sentiment_results)
            pain_context = format_tavily_context(sentiment_results)
            print(f"   ✅ Step 3 complete ({len(sentiment_results)} results)")
        except Exception as e:
             print(f"   ❌ Step 3 failed: {e}")
        
        # Step 4 & 5 Replacement: DEEP RESEARCH (Targeted Search)
        # Instead of generic searches, we extract top competitors and search specifically for them
        try:
            print(f"   Step 4/5: Deep Research (Targeted Competitor Intel)...")
            
            # Sub-step A: Extract Top 3 Competitors from Step 1 results
            top_competitors = []
            try:
                comp_response = openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "Extract the names of the top 3 direct competitors mentioned in the search results. Return ONLY a valid JSON list of strings. Example: [\"HubSpot\", \"Salesforce\", \"Pipedrive\"]"},
                        {"role": "user", "content": f"Search Results:\n{landscape_context[:2000]}"}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0
                )
                comp_data = json.loads(comp_response.choices[0].message.content)
                top_competitors = comp_data.get("competitors", []) 
                # Handle direct list return or dict wrapper
                if not top_competitors and isinstance(comp_data, list):
                     top_competitors = comp_data
                if isinstance(comp_data, dict) and not top_competitors:
                     # Try to find any list in the dict
                     for k, v in comp_data.items():
                         if isinstance(v, list):
                             top_competitors = v
                             break
                
                top_competitors = top_competitors[:3] # Limit to 3 to manage API usage
                print(f"   🎯 Targeted Competitors: {top_competitors}")
            except Exception as e:
                print(f"   ⚠️ Competitor extraction failed: {e}")

            # Sub-step B: Loop search for each competitor
            if top_competitors:
                for comp in top_competitors:
                    print(f"      🔎 Researching {comp}...")
                    
                    # Search Pricing
                    try:
                        q_pricing = f"{comp} pricing plans cost per user"
                        r_p = tavily_client.search(query=q_pricing, search_depth="advanced", max_results=1)
                        p_res = extract_tavily_results(r_p)
                        all_results.extend(p_res)
                        pricing_context += f"\n\n--- {comp} PRICING ---\n" + format_tavily_context(p_res)
                    except: pass
                    
                    # Search Features
                    try:
                        q_features = f"{comp} key features capabilities list"
                        r_f = tavily_client.search(query=q_features, search_depth="advanced", max_results=1)
                        f_res = extract_tavily_results(r_f)
                        all_results.extend(f_res)
                        feature_context += f"\n\n--- {comp} FEATURES ---\n" + format_tavily_context(f_res)
                    except: pass
                
                print(f"   ✅ Deep Research Loop Complete.")
            else:
                 print("   ⚠️ No competitors found for Deep Research. Falling back to generic search.")
                 # Fallback to original generic search if no competitors extracted
                 query_features = optimize_query(f"Detailed feature list capabilities comparison {search_terms} market leaders")
                 r4 = tavily_client.search(query=query_features, search_depth="advanced", max_results=3)
                 feature_context = format_tavily_context(extract_tavily_results(r4))
                 
                 query_pricing = optimize_query(f"Pricing plans pricing tiers {search_terms} tools detailed breakdown")
                 r5 = tavily_client.search(query=query_pricing, search_depth="advanced", max_results=3)
                 pricing_context = format_tavily_context(extract_tavily_results(r5))

        except Exception as e:
            print(f"   ❌ Deep Research failed: {e}")
        
        print(f"✅ Tavily searches complete: {len(all_results)} total results\n")
        
        return {
            "landscape_context": landscape_context,
            "pain_context": pain_context,
            "feature_context": feature_context, 
            "pricing_context": pricing_context,
            "landscape_count": 0,
            "pain_count": 0
        }
        
    except Exception as e:
        print(f"❌ Error in competitor intel search: {e}")
        return {
            "landscape_context": "",
            "pain_context": "",
            "feature_context": "",
            "pricing_context": "",
            "landscape_count": 0,
            "pain_count": 0
        }

def generate_spy_analysis(idea: str, landscape_context: str, pain_context: str, feature_context: str = "", pricing_context: str = "", language: str = "en", max_retries: int = 3) -> SpyResponse:
    """Génère l'analyse stratégique du Spy Agent via OpenAI avec retry automatique
    
    Args:
        idea: The startup idea to analyze
        landscape_context: Competitive landscape data from Tavily
        pain_context: Customer complaints and pain points from Tavily
        feature_context: (OPTIONAL) Feature comparison data for premium features
        pricing_context: (OPTIONAL) Pricing intelligence data for premium features
        language: Target language for the report
        max_retries: Max retry attempts for OpenAI calls
    """
    
    print(f"\n🚀 Generating Spy Analysis...")
    print(f"   Idea: {idea[:60]}...")
    print(f"   Language: {language}")
    
    # Extraire les URLs disponibles depuis TOUS les contextes (y compris premium)
    landscape_urls = extract_urls_from_context(landscape_context)
    pain_urls = extract_urls_from_context(pain_context)
    feature_urls = extract_urls_from_context(feature_context) if feature_context else {}
    pricing_urls = extract_urls_from_context(pricing_context) if pricing_context else {}
    all_urls = {**landscape_urls, **pain_urls, **feature_urls, **pricing_urls}
    
    print(f"   URLs extracted: {len(all_urls)} total")
    print(f"     - Landscape: {len(landscape_urls)}")
    print(f"     - Pain: {len(pain_urls)}")
    print(f"     - Features: {len(feature_urls)}")
    print(f"     - Pricing: {len(pricing_urls)}")
    
    if not all_urls:
        print("⚠️ WARNING: No URLs found in Tavily search results. Proceeding with caution (risk of validation failure).")
        # raise ValueError("No URLs found in Tavily search results. Cannot verify any information.")
    
    # Construire les sections de contexte
    landscape_section = f"COMPETITIVE LANDSCAPE DATA:\n{landscape_context}" if landscape_context else "No competitive landscape data available."
    pain_section = f"CUSTOMER PAIN POINTS & COMPLAINTS:\n{pain_context}" if pain_context else "No customer pain point data available."
    
    # Sections premium (optionnelles)
    feature_section = f"FEATURE COMPARISON DATA (for premium features):\n{feature_context}" if feature_context else ""
    pricing_section = f"PRICING INTELLIGENCE DATA (for premium features):\n{pricing_context}" if pricing_context else ""
    
    # Liste des URLs disponibles pour référence
    urls_list = "\n".join([f"- {url}" for url in all_urls.keys()]) if all_urls else "No URLs available"
    
    # Instructions premium (ALWAYS INCLUDED to force generation attempt)
    premium_instructions = """

**PREMIUM FEATURES (REQUIRED):**
You MUST attempt to generate these premium features using ALL available data (landscape, pain points, etc.). 
If specific feature/pricing context is missing, INFER it from the general competitor descriptions and pain points.

6. **Feature Comparison Matrix** (OBJECTIVE SCORING REQUIRED):
   - Extract 3-5 key feature categories relevant to this market
   - Compare user's product vs 3-5 competitors
   - **CRITICAL - NO BIAS RULE:**
     * ✅ = Feature is EXPLICITLY mentioned in the data as present
     * ❌ = Feature is NOT mentioned or explicitly absent
     * 🔄 = "Planned" or "Beta" (mentioned as coming soon)
     * **DO NOT ASSUME** the user's idea has features just because "it could."
     * If the user's idea is just a concept with NO live product, mark EVERYTHING as ❌ or 🔄.
   - **CRITICAL:** Use verified_url from ANY context (landscape/pain) if specific feature context is missing.

7. **Pricing Comparison**:
   - if specific pricing data is missing, providing estimates based on market standards (e.g. "Likely Freemium", "Enterprise Custom") or infer from "expensive/cheap" descriptions.
   - **CRITICAL:** providing a 'recommended_positioning' is vital.

8. **Sentiment Breakdown**:
   - Analyze sentiment from the 'pain_context'
   - Synthesize sources (e.g. "Reddit Generic", "G2 Aggregate") if specific sources are not distinct.

9. **Gap Opportunities**:
   - Identify 2-4 clear market gaps based on complaints
   - **CRITICAL:** Each gap MUST have verified_url
"""


    
    system_prompt = f"""You are a RUTHLESS strategic competitive intelligence expert (The Spy). Your job is to tell founders the TRUTH, not what they want to hear.

**CRITICAL MINDSET SHIFT:**
- You are NOT a cheerleader. You are an analyst who has seen hundreds of startups fail.
- If a market is saturated, you MUST say so with LOW scores.
- If an idea is just a "wrapper" around existing tech, you MUST call it out.
- **BIAS CHECK:** Do NOT give high scores to ideas with many established competitors just because "there's room for innovation." There isn't.

The startup idea to analyze is: {idea}

**LANGUAGE INSTRUCTION:**
- The user has requested the response in: **{language}**
- **CRITICAL OVERRIDE: INPUT LANGUAGE DETECTION**
- You must DETECT the language of the user's input idea '{idea}'.
- If the input is in a different language than '{language}' (e.g. input is French but requested is English), you MUST output the report in the **INPUT LANGUAGE**.
- The goal is to always answer in the same language the user spoke.
- **CRITICAL:** All textual content (titles, descriptions, summaries) MUST be in the **INPUT LANGUAGE**.

{landscape_section}

{pain_section}

{feature_section}

{pricing_section}

CRITICAL RULES - YOU MUST FOLLOW THESE STRICTLY:

**RUTHLESS SCORING ENFORCEMENT:**

1. **IF competitors include ANY of the following monopolies/giants:**
   - Social: Facebook, Instagram, TikTok, Snapchat, LinkedIn, Twitter
   - E-commerce: Amazon, eBay, Alibaba, Shopify
   - Marketplace: Airbnb, Uber, Upwork, Fiverr
   - SaaS Incumbents: Salesforce, HubSpot, Adobe, Microsoft, Google Workspace
   
   **THEN you MUST:**
   - Give Strategic Opening Score ≤ 20/100
   - Label quadrant as "RED OCEAN - SUICIDE MISSION"
   - State clearly: "This market is DOMINATED by [Giant]. Entry is not recommended."

2. **IF the idea is a "Wrapper" (UI on top of OpenAI/Stripe/Google APIs):**
   - Innovation Score ≤ 30/100
   - Strategic Opening Score ≤ 25/100
   - State: "This is a thin wrapper. No defensibility. Can be cloned in a weekend."

3. **IF there are 10+ competitors mentioned in the data:**
   - Strategic Opening Score ≤ 40/100
   - Label: "HIGHLY SATURATED - Requires 10x better product"

4. **IF the ONLY differentiator is "Cheaper Pricing":**
   - Strategic Opening Score ≤ 35/100
   - State: "Price wars lead to race-to-bottom. Not a sustainable strategy."

**COMPETITOR NAMES - ABSOLUTE REQUIREMENT:**
- You MUST use ONLY real competitor names found in the Tavily search results above
- Examples of real names: "Expensify", "QuickBooks", "Zapier", "Notion", "Figma", "Descript", "Podcastle"
- You MUST NEVER use placeholders like "Competitor A", "Competitor 1", "Company X", "Product Y", or any generic names
- If you cannot find specific competitor names in the provided data, you MUST:
  * Use fewer competitors (only those you can identify from the data)
  * Do NOT invent or guess competitor names
  * It is better to have 2-3 real competitors than 5 fake ones
- Every competitor name in the "competitors" array MUST appear in the Tavily search results above
- When matching complaints to competitors, use ONLY the real competitor names found in the data

Your analysis must:

1. **Define Strategic Axes**: Based on the competitive landscape data, determine the TWO most relevant dimensions for this specific market. Examples:
   - X-axis: "Creator/B2C" vs "Enterprise/B2B"
   - Y-axis: "Simple Tool" vs "All-in-One Platform"
   - Or: "Cheap" vs "Premium", "Simple" vs "Complex", etc.
   Choose axes that reveal meaningful strategic differences in the market.

2. **Position Competitors (NO RANDOM SCORING)**: 
   - Extract competitor names DIRECTLY from the landscape data above
   - Use ONLY names that appear in the Tavily search results (e.g., "Expensify", "QuickBooks", "Zapier")
   - NEVER invent competitor names or use placeholders
   - **CRITICAL URL VALIDATION**: For EACH competitor, you MUST provide a "verified_url" field
   - The verified_url MUST be one of the URLs from the VERIFIED_URL fields in the landscape data above
   - If you cannot find a URL that mentions the competitor, DO NOT include that competitor
   - **SCORING RULE**: Assign X/Y coordinates (0-100 scale) based on **EVIDENCE**. 
     * If a competitor is described as "expensive", their Price score must be high (e.g. 80-90). 
     * If they are "simple", their Complexity score must be low.
     * DO NOT assign random coordinates.
   - Label each competitor's quadrant (e.g., "Crowded", "Niche", "Premium", etc.)
   - Use the actual data from Tavily to inform positioning

3. **Find the Strategic Opening (Blue Ocean)**:
   - Identify the empty space on the quadrant (where no competitors are positioned)
   - Place the user's idea in that strategic opening
   - Assign coordinates (0-100) for the strategic opening
   - Label it appropriately (e.g., "Empty Space", "Blue Ocean", "Opportunity")

4. **Extract Voice of Customer**:
   - Pull direct quotes from the pain context data (Reddit, G2, Capterra)
   - **CRITICAL URL VALIDATION**: For EACH complaint/quote, you MUST provide a "verified_url" field
   - The verified_url MUST be one of the URLs from the VERIFIED_URL fields in the pain context data above
   - The quote MUST actually appear in the content associated with that URL
   - If you cannot find a URL that contains the quote, DO NOT include that complaint
   - CRITICAL: When extracting quotes, ensure they are valid JSON strings:
     * Remove or replace any control characters (newlines, tabs, etc.) with spaces
     * Escape special characters properly in JSON strings
     * Keep quotes concise and clean (max 200 characters per quote)
     * If a quote contains problematic characters, sanitize it by replacing newlines with spaces
   - Identify the source (Reddit, G2 Review, Capterra, etc.) based on the URL domain
   - Match complaints to specific competitors using ONLY real competitor names from the data
   - If a complaint mentions a competitor name, use that exact name (e.g., "Expensify", not "Competitor A")
   - Create a word cloud of pain terms with mention counts based on frequency in the data

5. **Generate Strategic Insights**:
   - Summarize the most frequent negative terms
   - Provide a strategic verdict on where the opening is
   - Create highlight boxes with key metrics
{premium_instructions}

**URL VALIDATION REQUIREMENT - ANTI-HALLUCINATION RULE:**
- EVERY competitor MUST have a verified_url from the landscape data
- EVERY complaint/quote MUST have a verified_url from the pain data
- If you cannot find a matching URL for an information, DO NOT include it
- It is better to have fewer verified items than many unverified ones
- The verified_url field is MANDATORY and cannot be empty or placeholder

**LANGUAGE INSTRUCTION:**
- The user has requested the report in: **{language}**
- **CRITICAL:** All textual content in your JSON response (titles, reviews, quotes, summaries, strategic insights, etc.) **MUST** be in **{language}**.
- Do not translate the field names (keys) of the JSON structure, only the values.
- **TECHNICAL TERMS:** Do NOT translate standard technical terms literally (e.g., 'Blue Ocean', 'Red Ocean', 'Niche', 'B2B', 'B2C'). Keep them as standard industry terms or use commonly accepted equivalents in {language}.

**CRITICAL - MINIMUM REQUIREMENTS:**
- You MUST provide AT LEAST ONE competitor with a valid verified_url
- You MUST provide AT LEAST ONE complaint with a valid verified_url
- You MUST provide AT LEAST ONE pain word in the word cloud
- If you cannot meet these minimum requirements, the system will retry automatically
- DO NOT return empty lists - this will cause the system to fail and retry

Available URLs for reference:
{urls_list}

Be data-driven. Use ONLY the actual research data provided. If you cannot find specific competitor names in the data, use fewer competitors rather than inventing names. NEVER include information without a verified_url. ALWAYS ensure you provide at least the minimum required verified data."""

    print(f"   Prompt size: ~{len(system_prompt) // 4:,} tokens (estimate)")
    print(f"   Calling OpenAI API...")

    try:
        response = openai_client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze the strategic opening for this startup idea: {idea}"}
            ],
            response_format=SpyResponse,
            temperature=0.7
        )
        
        if not response.choices or len(response.choices) == 0:
            raise ValueError("No response choices returned from OpenAI")
        
        message = response.choices[0].message
        
        if not hasattr(message, 'parsed') or message.parsed is None:
            if hasattr(message, 'content') and message.content:
                import json
                try:
                    # Parser le JSON d'abord, puis nettoyer les valeurs
                    content_dict = json.loads(message.content)
                    
                    # Nettoyer tous les champs texte pour éviter les caractères de contrôle
                    def clean_dict_recursive(obj):
                        """Nettoie récursivement tous les strings dans un dict"""
                        if isinstance(obj, dict):
                            return {k: clean_dict_recursive(v) for k, v in obj.items()}
                        elif isinstance(obj, list):
                            return [clean_dict_recursive(item) for item in obj]
                        elif isinstance(obj, str):
                            return clean_text_for_json(obj)
                        else:
                            return obj
                    
                    content_dict = clean_dict_recursive(content_dict)
                    analysis = SpyResponse(**content_dict)
                except (json.JSONDecodeError, ValueError) as parse_error:
                    raise ValueError(f"Failed to parse OpenAI response: {parse_error}")
            else:
                raise ValueError("No parsed response and no content available from OpenAI")
        else:
            analysis = message.parsed
            
            # Nettoyer tous les champs texte même si le parsing a réussi
            # Convertir en dict, nettoyer, puis recréer l'objet
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
                analysis = SpyResponse(**cleaned_dict)
            except Exception as e:
                print(f"   ⚠️  Warning: Could not clean parsed response: {e}")
        
        if not isinstance(analysis, SpyResponse):
            raise ValueError("Failed to parse response as SpyResponse")
        
        # Validation post-processing : vérifier que toutes les URLs sont valides
        valid_urls = set(all_urls.keys())
        
        # Convertir en dict pour validation et recréation
        analysis_dict = analysis.model_dump()
        
        # Valider les URLs des concurrents
        if 'spy' in analysis_dict and 'market_quadrant' in analysis_dict['spy']:
            if 'competitors' in analysis_dict['spy']['market_quadrant']:
                valid_competitors = []
                for competitor in analysis_dict['spy']['market_quadrant']['competitors']:
                    verified_url = competitor.get('verified_url', '')
                    if verified_url and verified_url in valid_urls:
                        valid_competitors.append(competitor)
                    else:
                        print(f"   ⚠️  Warning: Competitor {competitor.get('name', 'Unknown')} has invalid or missing URL: {verified_url}")
                analysis_dict['spy']['market_quadrant']['competitors'] = valid_competitors
        
        # Valider les URLs des plaintes
        if 'spy' in analysis_dict and 'customer_intel' in analysis_dict['spy']:
            if 'top_complaints' in analysis_dict['spy']['customer_intel']:
                valid_complaints = []
                for complaint in analysis_dict['spy']['customer_intel']['top_complaints']:
                    verified_url = complaint.get('verified_url', '')
                    if verified_url and verified_url in valid_urls:
                        valid_complaints.append(complaint)
                    else:
                        print(f"   ⚠️  Warning: Complaint has invalid or missing URL: {verified_url}")
                analysis_dict['spy']['customer_intel']['top_complaints'] = valid_complaints
            
            # Valider pain_word_cloud (doit avoir au moins 1 élément)
            if 'pain_word_cloud' in analysis_dict['spy']['customer_intel']:
                if not analysis_dict['spy']['customer_intel']['pain_word_cloud'] or len(analysis_dict['spy']['customer_intel']['pain_word_cloud']) == 0:
                    raise ValueError("pain_word_cloud cannot be empty")
        
        # Validation stricte : vérifier que les listes critiques ne sont pas vides
        if len(analysis_dict.get('spy', {}).get('market_quadrant', {}).get('competitors', [])) == 0:
            raise ValueError("No valid competitors found with verified URLs. All competitors were filtered out.")
        
        if len(analysis_dict.get('spy', {}).get('customer_intel', {}).get('top_complaints', [])) == 0:
            raise ValueError("No valid complaints found with verified URLs. All complaints were filtered out.")
        
        # Recréer l'objet avec les données validées
        analysis = SpyResponse(**analysis_dict)
        
        # Log premium features status
        print(f"\n📊 Premium Features Generated:")
        print(f"     Feature Matrix: {'✅' if analysis.spy.feature_comparison_matrix else '⚠️  null'}")
        print(f"     Pricing Comparison: {'✅' if analysis.spy.pricing_comparison else '⚠️  null'}")
        print(f"     Sentiment Breakdown: {'✅' if analysis.spy.sentiment_breakdown else '⚠️  null'}")
        print(f"     Gap Opportunities: {'✅' if analysis.spy.gap_opportunities else '⚠️  null'}")
        
        print(f"✅ Spy Analysis generation complete!\n")
        
        return analysis
        
    except HTTPException:
        raise
    except ValueError as ve:
        # Les ValueError sont relancés pour permettre le retry
        print(f"❌ Validation error: {ve}")
        raise ve
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"❌ Error generating spy analysis: {error_details}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating spy analysis: {str(e)}"
        )
