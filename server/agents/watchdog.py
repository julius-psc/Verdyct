import requests
from typing import Dict, Optional
from utils import openai_client, clean_text_for_json

def verify_cta(project_id: str, url: str) -> Dict[str, str]:
    """
    Verifies the Call to Action (CTA) button on the given URL.
    
    Args:
        project_id: The ID of the project.
        url: The URL of the MVP to check.
        
    Returns:
        A dictionary containing the CTA text and selector, or error details.
    """
    print(f"Watchdog: Verifying CTA for {project_id} at {url}")
    
    # TODO: SPA/Rendering Awareness
    # Simple HTML fetching with requests might return empty pages if the client site 
    # is a Single Page Application (React/Vue) rendered entirely on the client.
    # For a robust solution, we should swap this for a Headless Browser (like Playwright).
    # Structure is kept simple for MVP but ready for that swap.
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        html_content = response.text
        
        # Truncate HTML to avoid token limits if it's huge
        if len(html_content) > 50000:
            html_content = html_content[:50000] + "..."
            
        # Use OpenAI to find the CTA
        prompt = f"""
        Analyze the following HTML content and identify the primary Call to Action (CTA) button.
        The CTA is usually the most prominent button (e.g., "Sign Up", "Get Started", "Buy Now").
        
        Return a JSON object with:
        - "cta_text": The text content of the button.
        - "cta_selector": A unique CSS selector to identify this element.
        - "confidence": High/Medium/Low.
        
        If no clear CTA is found, return null values.
        
        HTML Content:
        {html_content}
        """
        
        completion = openai_client.chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": "You are an expert web scraper and QA engineer."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0
        )
        
        result = completion.choices[0].message.content
        import json
        data = json.loads(result)
        
        return data
        
    except Exception as e:
        print(f"Watchdog Error: {e}")
        return {"error": str(e)}
