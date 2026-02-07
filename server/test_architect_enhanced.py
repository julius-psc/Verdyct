import sys
import os
import asyncio
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

load_dotenv()

from agents.architect import generate_architect_blueprint

async def test_enhanced_architect():
    idea = "Uber for dog walking with real-time GPS tracking"
    print(f"🏗️ Testing Architect Agent (Mini-CTO Mode) for: {idea}")

    try:
        # Run Generation
        response = generate_architect_blueprint(idea, language="en")
        arch = response.architect
        
        output = []
        output.append("✅ Blueprint Generated Successfully!")
        output.append(f"Title: {arch.title}")
        
        # Check New Fields
        output.append("\n--- 1. AI-Accelerated MVP Roadmap ---")
        if arch.mvp_roadmap and len(arch.mvp_roadmap) > 0:
            for m in arch.mvp_roadmap:
                output.append(f"   - [{m.phase}] {m.duration}: {', '.join(m.deliverables[:2])}...")
        else:
            output.append("   ❌ MISSING: MVP Roadmap is empty.")
            
        output.append("\n--- 2. Technical Risks ---")
        if arch.tech_risks and len(arch.tech_risks) > 0:
            for r in arch.tech_risks:
                output.append(f"   - {r.risk} ({r.impact}): Mitigate via {r.mitigation[:50]}...")
        else:
            output.append("   ❌ MISSING: Tech Risks are empty.")

        output.append("\n--- 3. Scalability Strategy ---")
        if arch.scalability_strategy and len(arch.scalability_strategy) > 0:
             for s in arch.scalability_strategy:
                 output.append(f"   - {s.title}")
        else:
             output.append("   ❌ MISSING: Scalability Strategy is empty.")

        output.append("\n--- 4. Compliance Checklist ---")
        if arch.compliance_checklist and len(arch.compliance_checklist) > 0:
             for c in arch.compliance_checklist:
                 output.append(f"   - {c.requirement} ({c.status})")
        else:
             output.append("   ❌ MISSING: Compliance Checklist is empty.")

        output.append("\n--- 5. Integrations ---")
        if arch.recommended_integrations and len(arch.recommended_integrations) > 0:
             for i in arch.recommended_integrations:
                 output.append(f"   - {i.name} ({i.category})")
        else:
             output.append("   ❌ MISSING: Recommended Integrations are empty.")

        # Absolute Path for Safety
        abs_path = "C:/Users/stizi/Music/Verdyct/server/test_results.txt"
        
        with open(abs_path, "w", encoding="utf-8") as f:
            f.write("\n".join(output))
        print(f"Test finished. Check {abs_path}")

    except Exception as e:
        print(f"❌ Generation Failed: {e}")
        try:
            with open("C:/Users/stizi/Music/Verdyct/server/test_results.txt", "w", encoding="utf-8") as f:
                f.write(f"FAILED: {e}")
        except:
             pass
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    try:
        if sys.platform == 'win32':
             asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        asyncio.run(test_enhanced_architect())
    except Exception as final_e:
        with open("C:/Users/stizi/Music/Verdyct/server/test_results.txt", "w", encoding="utf-8") as f:
            f.write(f"CRITICAL FAILURE: {final_e}")
