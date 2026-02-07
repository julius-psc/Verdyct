import sys
import codecs
import asyncio
import os
from dotenv import load_dotenv

# Force UTF-8 for Windows console
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Load env vars
load_dotenv()

# Build a mock request
idea = "ShadowBoard — a B2B SaaS platform that passively analyzes internal work signals"
language = "en"

async def run_test():
    print(f"TESTING SPY AGENT FOR IDEA: {idea}")
    
    try:
        # Import directly to test the actual code
        from agents.spy import get_competitor_intel, generate_spy_analysis
        
        # 1. Test Intelligence Gathering
        print("\n--- 1. Testing get_competitor_intel ---")
        intel_data = get_competitor_intel(idea)
        
        print("\n[INTEL DATA KEYS]:", intel_data.keys())
        print(f"[LANDSCAPE CONTEXT LENGTH]: {len(intel_data.get('landscape_context', ''))}")
        
        if not intel_data.get('landscape_context'):
            print("❌ FATAL: Landscape context is empty!")
            return
            
        # 2. Test Analysis Generation
        print("\n--- 2. Testing generate_spy_analysis ---")
        analysis = generate_spy_analysis(
            idea,
            intel_data["landscape_context"],
            intel_data["pain_context"],
            intel_data.get("feature_context", ""),
            intel_data.get("pricing_context", ""),
            language=language
        )
        
        print("\nSUCCESS! Analysis Generated.")
        print("Title:", analysis.spy.title)
        
    except Exception as e:
        print(f"\nERROR CAUGHT: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        if hasattr(e, 'errors'):
             print("\n[VALIDATION ERRORS]:", e.errors())

if __name__ == "__main__":
    asyncio.run(run_test())
