import sys
import os
import asyncio
from dotenv import load_dotenv

# Force UTF-8 encoding for Windows console to avoid UnicodeEncodeError with emojis
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

load_dotenv()

# Mock imports
from agents.financier import get_financial_intel, generate_financier_analysis, calculate_projections

async def test_financier():
    idea = "A SaaS platform for automated dog walking coordination called WalkMate"
    print(f"💰 Testing Financier Enhanced for: {idea}")

    # 1. Real Search Check
    print("\n1. Searching Financial Intel (Pricing + Costs)...")
    try:
        financial_data = get_financial_intel(idea)
        print(f"   ✅ Search Done. Results: {financial_data['results_count']}")
        print(f"   Cost Context Length: {len(financial_data.get('cost_context', ''))}")
    except Exception as e:
        print(f"   ❌ Search Failed: {e}")
        return

    # 2. Generation Check
    print("\n2. Generating Analysis (LLM + Calc)...")
    try:
        analysis = generate_financier_analysis(
            idea, 
            financial_data["pricing_context"], 
            cost_context=financial_data.get("cost_context", ""),
            language="en"
        )
        print("   ✅ Generation Successful!")
        
        # Check new fields
        costs = analysis.financier.cost_structure
        print(f"\n3. Cost Structure Check: {len(costs) if costs else 0} items")
        if costs:
            for c in costs:
                print(f"   - {c.name}: €{c.monthly_amount} (Variable: {c.is_variable})")
        
        metrics = analysis.financier.profit_engine.metrics
        print("\n4. Metrics Check:")
        print(f"   - Break Even Users: {metrics.break_even_users}")
        print(f"   - Runway: {metrics.projected_runway_months}")
        print(f"   - LTV:CAC: {metrics.ltv_cac_ratio}")
        
    except Exception as e:
        print(f"   ❌ Generation Failed: {e}")
        if hasattr(e, 'detail'):
            print(f"   Details: {e.detail}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_financier())
