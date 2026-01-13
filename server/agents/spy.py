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
    Effectue la reconnaissance concurrentielle via Tavily.
    Deux types de recherches :
    1. Landscape Search : identifie les concurrents principaux
    2. Pain Search : collecte les plaintes et critiques sur chaque concurrent
    """
    try:
        # 1. Landscape Search : identifier les concurrents avec leurs noms réels
        landscape_query = f"Top competitors for {idea} list names pricing features comparison alternatives"
        landscape_query = optimize_query(landscape_query)
        
        landscape_response = tavily_client.search(
            query=landscape_query,
            search_depth="advanced",
            max_results=10
        )
        
        landscape_results = extract_tavily_results(landscape_response)
        landscape_context = format_tavily_context(landscape_results)
        
        # Ajouter une note explicite pour l'extraction des noms
        if landscape_context:
            landscape_context = f"IMPORTANT: Extract real competitor names (e.g., Expensify, QuickBooks, Zapier) from the data below. Use ONLY names that appear in the search results.\n\n{landscape_context}"
        
        # 2. Pain Search : rechercher les plaintes pour chaque concurrent identifié
        pain_queries = []
        pain_contexts = []
        
        # Recherche générale de plaintes sur le marché
        general_pain_query = f"{idea} complaints reddit G2 Capterra negative reviews"
        general_pain_query = optimize_query(general_pain_query)
        try:
            pain_response = tavily_client.search(
                query=general_pain_query,
                search_depth="advanced",
                max_results=10
            )
            pain_results = extract_tavily_results(pain_response)
            pain_context = format_tavily_context(pain_results)
            if pain_context:
                pain_contexts.append(f"General market complaints:\n{pain_context}")
        except Exception as e:
            print(f"Error in general pain search: {e}")
        
        # Recherches spécifiques pour les concurrents identifiés (limité à 3 pour éviter trop d'appels API)
        # On laisse l'IA identifier les concurrents depuis le landscape_context
        competitor_pain_query = f"{idea} competitors complaints reddit G2 Capterra cons negative reviews"
        competitor_pain_query = optimize_query(competitor_pain_query)
        try:
            competitor_pain_response = tavily_client.search(
                query=competitor_pain_query,
                search_depth="advanced",
                max_results=10
            )
            competitor_pain_results = extract_tavily_results(competitor_pain_response)
            competitor_pain_context = format_tavily_context(competitor_pain_results)
            if competitor_pain_context:
                pain_contexts.append(f"Competitor-specific complaints:\n{competitor_pain_context}")
        except Exception as e:
            print(f"Error in competitor pain search: {e}")
        
        # Combiner tous les contextes
        all_pain_context = "\n\n---\n\n".join(pain_contexts) if pain_contexts else ""
        
        return {
            "landscape_context": landscape_context,
            "pain_context": all_pain_context,
            "landscape_count": len(landscape_results),
            "pain_count": len([c for c in pain_contexts if c])
        }
        
    except Exception as e:
        print(f"Error in competitor intel search: {e}")
        import traceback
        traceback.print_exc()
        return {
            "landscape_context": "",
            "pain_context": "",
            "landscape_count": 0,
            "pain_count": 0
        }

def generate_spy_analysis(idea: str, landscape_context: str, pain_context: str, language: str = "en", max_retries: int = 3) -> SpyResponse:
    """Génère l'analyse stratégique du Spy Agent via OpenAI avec retry automatique"""
    
    # Extraire les URLs disponibles depuis les contextes
    landscape_urls = extract_urls_from_context(landscape_context)
    pain_urls = extract_urls_from_context(pain_context)
    all_urls = {**landscape_urls, **pain_urls}
    
    if not all_urls:
        raise ValueError("No URLs found in Tavily search results. Cannot verify any information.")
    
    # Construire les sections de contexte
    landscape_section = f"COMPETITIVE LANDSCAPE DATA:\n{landscape_context}" if landscape_context else "No competitive landscape data available."
    pain_section = f"CUSTOMER PAIN POINTS & COMPLAINTS:\n{pain_context}" if pain_context else "No customer pain point data available."
    
    # Liste des URLs disponibles pour référence
    urls_list = "\n".join([f"- {url}" for url in all_urls.keys()]) if all_urls else "No URLs available"
    
    system_prompt = f"""You are a strategic competitive intelligence expert (The Spy). Your task is to analyze a startup idea and identify the strategic opening in the market.

The startup idea to analyze is: {idea}

{landscape_section}

{pain_section}

CRITICAL RULES - YOU MUST FOLLOW THESE STRICTLY:

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

2. **Position Competitors**: 
   - Extract competitor names DIRECTLY from the landscape data above
   - Use ONLY names that appear in the Tavily search results (e.g., "Expensify", "QuickBooks", "Zapier")
   - NEVER invent competitor names or use placeholders
   - **CRITICAL URL VALIDATION**: For EACH competitor, you MUST provide a "verified_url" field
   - The verified_url MUST be one of the URLs from the VERIFIED_URL fields in the landscape data above
   - If you cannot find a URL that mentions the competitor, DO NOT include that competitor
   - Assign X/Y coordinates (0-100 scale) for each competitor based on their positioning in the data
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
                print(f"Warning: Could not clean parsed response: {e}")
        
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
                        print(f"Warning: Competitor {competitor.get('name', 'Unknown')} has invalid or missing URL: {verified_url}")
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
                        print(f"Warning: Complaint has invalid or missing URL: {verified_url}")
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
        
        return analysis
        
    except HTTPException:
        raise
    except ValueError as ve:
        # Les ValueError sont relancés pour permettre le retry
        raise ve
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error generating spy analysis: {error_details}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating spy analysis: {str(e)}"
        )
