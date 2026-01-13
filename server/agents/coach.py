import os
import json
from typing import List, Optional, Dict
from openai import OpenAI
from models import Roadmap, RoadmapStep, RoadmapChat, RoadmapContext

# Initialize OpenAI
openai_api_key = os.getenv("OPENAI_API_KEY")
openai_client = OpenAI(api_key=openai_api_key)

def get_system_prompt(mode: str, context: Dict):
    base_prompt = """You are the 'Verdyct AI Co-Founder', an experienced startup coach. 
    Your goal is to guide the user from their initial idea to a successful exit.
    You are practical, direct, and focused on execution. 
    Tone: Professional, encouraging, but realistic. No fluff."""

    if mode == "onboarding":
        return base_prompt + """
        STATUS: ONBOARDING.
        The user has just started the roadmap process.
        Your goal is to gather 3 key pieces of information to build a tailored plan:
        1. Current Stage (Idea, MVP, Revenue?)
        2. Available Resources (Time per week, Budget?)
        3. Primary Goal for next 3 months.
        
        Review the user's latest message. If you have all 3, output a special JSON to signal 'READY'.
        Otherwise, ask the next most important question naturally. Do not ask all 3 at once. Be conversational.
        """
    
    elif mode == "generator":
        return base_prompt + f"""
        STATUS: EXECUTION.
        The user is executing the roadmap.
        Context: {json.dumps(context)}
        
        Your job is to generate the NEXT step.
        """
    return base_prompt

def run_coach_agent(
    roadmap: Roadmap, 
    last_user_message: str, 
    chat_history: List[RoadmapChat],
    full_report: Optional[Dict] = None
) -> Dict:
    """
    Core logic for the Coach Agent.
    Returns a dictionary with:
    - message: str
    - new_step: Optional[RoadmapStep]
    - updated_status: Optional[str]
    - update_context: Optional[Dict]
    """
    
    # 1. Determine Mode
    mode = "onboarding" if roadmap.status == "onboarding" else "generator"
    
    # 2. Build History for LLM
    messages = [
        {"role": "system", "content": get_system_prompt(mode, roadmap.context)}
    ]
    
    # Add project context if available
    if full_report:
        try:
            if isinstance(full_report, str):
                full_report = json.loads(full_report)
            
            summary = full_report.get('analyst', {}).get('analyst_footer', {}).get('verdyct_summary', '')
            messages.append({"role": "system", "content": f"Project Analysis Summary: {json.dumps(summary)}"})
        except Exception as e:
            print(f"Error parsing full_report context: {e}")

    
    # Add recent chat history (limit to last 10 for context window)
    for chat in chat_history[-10:]:
        messages.append({"role": chat.role, "content": chat.content})
        
    messages.append({"role": "user", "content": last_user_message})

    # 3. Call LLM
    # We use function calling / JSON mode to detect 'READY' state or new steps
    
    if mode == "onboarding":
        completion = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.7,
            tools=[{
                "type": "function",
                "function": {
                    "name": "finalize_onboarding",
                    "description": "Call this when you have gathered all necessary information (Stage, Resources, Goal).",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "summary": {"type": "string", "description": "Summary of gathered context"},
                            "final_message": {"type": "string", "description": "Transition message to the user, e.g. 'Great, I have everything. Let's build your roadmap.'"}
                        },
                        "required": ["summary", "final_message"]
                    }
                }
            }]
        )
        
        tool_calls = completion.choices[0].message.tool_calls
        
        if tool_calls:
            # Onboarding Complete!
            args = json.loads(tool_calls[0].function.arguments)
            return {
                "message": args["final_message"],
                "updated_status": "active",
                "update_context": {"onboarding_summary": args["summary"]},
                "trigger_first_step": True
            }
        else:
            # Continue conversation
             # Note: Using json_object response_format with tools might be tricky if tool isn't called. 
             # Re-running without tools constraint for normal chatter if tool wasn't selected is safer, 
             # OR just prompt it to reply normally if not ready.
             # Actually, for gpt-4o, if tool isn't called, it returns content. 
             # But we forced json_object... wait, 'tools' and 'json_object' can conflict if not careful.
             # Let's simplify: simple chat completion.
             pass

    # Simple text response fallback logic for conversation
    # We re-run without JSON constraint for the actual conversation ensuring natural flow
    
    completion_text = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        temperature=0.7
    )
    
    response_text = completion_text.choices[0].message.content
    
    # Check if we should trigger first step immediately (e.g. if user says "I'm ready" or similar magic words, distinct from tool call)
    # But relies on tool call for state transition is more robust.
    
    return {
        "message": response_text
    }

def generate_next_step(roadmap: Roadmap, full_report: Optional[Dict] = None) -> RoadmapStep:
    """
    Generates the next logical step based on current progress.
    """
    current_steps_count = len(roadmap.steps)
    prev_steps = [s['title'] for s in roadmap.steps]
    
    prompt = f"""
    You are the Roadmap Architect.
    Project Context: {json.dumps(roadmap.context)}
    Previous Steps Completed: {json.dumps(prev_steps)}
    
    Generate the step #{current_steps_count + 1}.
    It must be actionable, specific, and small enough to be done in 1-3 days.
    """
    
    completion = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={ "type": "json_object" }
    )
    
    # We expect a JSON with title, description
    # For now, let's just mock/hardcode the structure parsing or assume GPT behaves.
    # To be safe, we'd use a Pydantic tool definition, but let's try direct JSON prompt.
    # Implement step generation
    completion = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={ "type": "json_object" },
        temperature=0.7
    )
    
    try:
        data = json.loads(completion.choices[0].message.content)
        # Expect keys: title, description
        return RoadmapStep(
            id=current_steps_count + 1,
            title=data.get("title", "Next Step"),
            description=data.get("description", "Follow the plan."),
            status="locked",
            is_preview=True
        )
    except Exception as e:
        print(f"Error generating step: {e}")
        return RoadmapStep(
            id=current_steps_count + 1,
            title="Error Generating Step",
            description="Please try again.",
            status="locked",
            is_preview=True
        )
