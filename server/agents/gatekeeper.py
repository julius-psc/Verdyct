from pydantic import BaseModel
from utils import openai_client

class GatekeeperResponse(BaseModel):
    is_saas: bool
    rejection_reason: str

def validate_saas_idea(idea: str) -> GatekeeperResponse:
    """
    Validates if the input is a legitimate SaaS/Startup idea.
    Returns True if it is, False otherwise with a reason.
    """
    system_prompt = """You are a strict Gatekeeper for a SaaS Validator AI.
Your job is to screen inputs and reject anything that is clearly NOT a software/SaaS business idea.

REJECT (is_saas=False) if the input is:
- A physical business (e.g., "I want to open a bakery", "A dog walking service", "Selling t-shirts") UNLESS it has a clear software component (e.g., "Uber for dog walkers" is OK).
- Nonsense or gibberish (e.g., "asdf", "hello", "test").
- A general question or greeting (e.g., "How are you?", "What is the weather?").
- A request for code generation or general AI assistance.
- Malicious or inappropriate content.

ACCEPT (is_saas=True) if the input is:
- A software product idea (web app, mobile app, API, platform).
- A tech-enabled service.
- A marketplace or platform.
- Even a vague software idea like "AI for lawyers".

If REJECTED, provide a short, friendly, but firm `rejection_reason` (max 1 sentence) explaining why.
Example: "Verdyct is designed to analyze software and SaaS businesses, but this looks like a physical service."
"""

    try:
        response = openai_client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Input: {idea}"}
            ],
            response_format=GatekeeperResponse,
            temperature=0.1
        )
        
        if not response.choices or not response.choices[0].message.parsed:
            # Fallback to safe default
            return GatekeeperResponse(is_saas=True, rejection_reason="")
            
        return response.choices[0].message.parsed
        
    except Exception as e:
        print(f"Gatekeeper error: {e}")
        # Fail open (allow it) if AI fails, to avoid blocking valid users
        return GatekeeperResponse(is_saas=True, rejection_reason="")
