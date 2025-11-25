import os
import re
import json
from typing import Dict, List, Any, Union
from dotenv import load_dotenv
from openai import OpenAI
from tavily import TavilyClient

# Load environment variables
load_dotenv()

# Initialize Clients
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

# Optional: GitHub & Vercel tokens
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME", "verdyct")
VERCEL_API_TOKEN = os.getenv("VERCEL_API_TOKEN")

def clean_text_for_json(text: str) -> str:
    """Nettoie le texte pour éviter les caractères de contrôle invalides dans JSON"""
    if not text:
        return ""
    # Remplacer les caractères de contrôle invalides (sauf \n, \r, \t qui sont valides dans JSON strings)
    text = re.sub(r'[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]', ' ', text)
    # Remplacer les retours à la ligne multiples par un seul espace pour les citations
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\r+', ' ', text)
    text = re.sub(r'\t+', ' ', text)
    # Normaliser les espaces multiples
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_tavily_results(response):
    """Helper pour extraire les résultats de Tavily (gère dict ou objet)"""
    if isinstance(response, dict):
        return response.get("results", [])
    elif hasattr(response, "results"):
        return response.results
    elif hasattr(response, "get"):
        return response.get("results", [])
    else:
        if hasattr(response, "__dict__"):
            return response.__dict__.get("results", [])
        return []

def format_tavily_context(results):
    """Formate les résultats Tavily en contexte texte avec URLs clairement associées"""
    if not results:
        return ""
    
    context_parts = []
    for idx, r in enumerate(results, 1):
        if isinstance(r, dict):
            title = r.get('title', '')
            content = r.get('content', '')
            url = r.get('url', '')
        elif hasattr(r, '__dict__'):
            title = getattr(r, 'title', '')
            content = getattr(r, 'content', '')
            url = getattr(r, 'url', '')
        else:
            continue
        
        # Nettoyer le contenu
        title = clean_text_for_json(title)
        content = clean_text_for_json(content)
        url = clean_text_for_json(url) if url else ""
        
        if title or content:
            context_parts.append(f"[SOURCE {idx}]\nTitle: {title}\nContent: {content}\nVERIFIED_URL: {url}\n---")
    
    return "\n\n".join(context_parts)

def extract_urls_from_context(context: str) -> Dict[str, str]:
    """Extrait les URLs et leurs contenus associés depuis le contexte formaté"""
    urls_map = {}
    if not context:
        return urls_map
    
    # Pattern pour extraire [SOURCE X] ... VERIFIED_URL: <url>
    pattern = r'\[SOURCE \d+\](.*?)VERIFIED_URL: ([^\n]+)'
    matches = re.finditer(pattern, context, re.DOTALL)
    
    for match in matches:
        content = match.group(1).strip()
        url = match.group(2).strip()
        if url and url not in urls_map:
            urls_map[url] = content
    
    return urls_map

def optimize_query(query: str, max_length: int = 400) -> str:
    """
    Optimise une requête Tavily pour qu'elle reste sous la limite de caractères.
    Utilise GPT-4o-mini pour condenser intelligemment la requête si nécessaire.
    """
    # Si la requête est déjà sous la limite, on la retourne telle quelle
    if len(query) <= max_length:
        return query
    
    try:
        # Utiliser GPT-4o-mini (low cost) pour optimiser la requête
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": f"You are a search query optimizer. Your task is to condense search queries to be under {max_length} characters while preserving the core search intent and key terms. Remove filler words, use abbreviations where appropriate, and prioritize the most important keywords."
                },
                {
                    "role": "user",
                    "content": f"Optimize this search query to be under {max_length} characters:\n\n{query}"
                }
            ],
            temperature=0.3,
            max_tokens=100
        )
        
        optimized = response.choices[0].message.content.strip()
        
        # Vérifier que la requête optimisée est bien sous la limite
        if len(optimized) <= max_length:
            print(f"Query optimized: {len(query)} -> {len(optimized)} chars")
            return optimized
        else:
            # Si l'IA a échoué, on tronque brutalement
            print(f"AI optimization failed, truncating query to {max_length} chars")
            return query[:max_length]
            
    except Exception as e:
        print(f"Error optimizing query: {e}. Truncating to {max_length} chars")
        # En cas d'erreur, on tronque simplement
        return query[:max_length]

