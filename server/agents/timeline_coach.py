import os
import json
from typing import List, Optional, Dict, Any
from openai import OpenAI
from models import Timeline, TimelineStep, TimelineMessage

# Initialize OpenAI
openai_api_key = os.getenv("OPENAI_API_KEY")
openai_client = OpenAI(api_key=openai_api_key)

SYSTEM_PROMPT = """You are the 'Verdyct Timeline Architect', an expert project manager and startup coach.
Your goal is to guide the user from idea to execution by building a dynamic, step-by-step timeline.
You are practical, encouraging, but focused on shipping.
"""

def get_onboarding_prompt(context: Dict) -> str:
    return SYSTEM_PROMPT + """
    STATUS: ONBOARDING.
    The user wants to start a timeline for their project.
    Your goal is to understand their specific context to build a tailored plan.
    
    You need to gather:
    1. Current "North Star" Goal (e.g. "Get first 10 customers", "Build MVP", "Raise Seed")
    2. Key Consrtaints (Time, Tech Stack preference, Budget)
    3. Current Progress (Just an idea? Prototype ready?)

    Review the chat history.
    If you have enough information to build a solid first step, output a special JSON tool call 'finalize_onboarding'.
    Otherwise, ask the next most relevant question. Do not ask for everything at once. Keep it conversational.
    """

def get_step_helper_prompt(step: TimelineStep, context: Dict) -> str:
    # OPTIMIZED: Only include title + description (not full content) to save tokens
    return SYSTEM_PROMPT + f"""
    STATUS: HELPING WITH STEP "{step.title}".
    Context: {json.dumps(context)}
    Step Description: {step.description}
    
    The user is asking for help or feedback on this specific step.
    If they need detailed instructions, you can reference that the full guide is available in the main panel.
    Answer their question, provide examples, or unblock them.
    Keep answers concise and actionable.
    """

def run_timeline_agent(
    timeline: Timeline,
    last_user_message: str,
    chat_history: List[TimelineMessage],
    step: Optional[TimelineStep] = None
) -> Dict[str, Any]:
    """
    Main entry point for the Timeline Agent.
    Handles both Onboarding chat and Step-specific chat.
    """
    
    # 1. Determine Prompt based on state
    if step:
        # Step-specific chat
        system_content = get_step_helper_prompt(step, timeline.context)
        mode = "step_help"
    elif timeline.status == "onboarding":
        system_content = get_onboarding_prompt(timeline.context)
        mode = "onboarding"
    else:
        # Generic fallback or maintenance mode
        system_content = SYSTEM_PROMPT + "You are chatting about the project timeline generally."
        mode = "general"

    # 2. Build Messages
    messages = [{"role": "system", "content": system_content}]
    
    # OPTIMIZED: Smart context selection to reduce token costs
    # Strategy: Keep first message + last 4 messages (2 exchanges)
    if len(chat_history) > 5:
        # Keep first message (initial context) + last 4 messages (recent conversation)
        selected_history = [chat_history[0]] + chat_history[-4:]
    else:
        # If history is short, keep all
        selected_history = chat_history
    
    for msg in selected_history:
        messages.append({"role": msg.role, "content": msg.content})
        
    messages.append({"role": "user", "content": last_user_message})

    # 3. Call LLM
    tools = []
    if mode == "onboarding":
        tools = [{
            "type": "function",
            "function": {
                "name": "finalize_onboarding",
                "description": "Call this when you have sufficient context to generate the first step.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "goal": {"type": "string", "description": "The defined North Star goal"},
                        "summary": {"type": "string", "description": "Summary of constraints and context"},
                        "final_message": {"type": "string", "description": "Transition message, e.g. 'Great, I'm generating your plan.'"}
                    },
                    "required": ["goal", "summary", "final_message"]
                }
            }
        }]
    elif mode == "step_help":
        tools = [{
            "type": "function",
            "function": {
                "name": "update_step_content",
                "description": "Call this to modify the content of the current step based on user feedback.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "new_title": {"type": "string", "description": "The new title (optional)"},
                        "new_content": {"type": "string", "description": "The new full markdown content"},
                        "message_to_user": {"type": "string", "description": "Confirmation message to user"}
                    },
                    "required": ["new_content", "message_to_user"]
                }
            }
        }]

    response_kwargs = {
        "model": "gpt-4o-mini",
        "messages": messages,
        "temperature": 0.7
    }
    if tools:
        response_kwargs["tools"] = tools

    completion = openai_client.chat.completions.create(**response_kwargs)
    message = completion.choices[0].message

    # 4. Handle Response
    result = {
        "message": message.content,
        "action": None,
        "data": {}
    }

    if message.tool_calls:
        tool_call = message.tool_calls[0]
        if tool_call.function.name == "finalize_onboarding":
            args = json.loads(tool_call.function.arguments)
            result["message"] = args["final_message"]
            result["action"] = "finalize_onboarding"
            result["data"] = {
                "goal": args["goal"],
                "context": {"summary": args["summary"]}
            }
        elif tool_call.function.name == "update_step_content":
            args = json.loads(tool_call.function.arguments)
            result["message"] = args["message_to_user"]
            result["action"] = "update_step"
            result["data"] = {
                "title": args.get("new_title"),
                "content": args["new_content"]
            }

    return result


def generate_next_step_agent(timeline: Timeline, previous_steps: List[TimelineStep]) -> Dict[str, Any]:
    """
    Generates the next logical step.
    """
    prev_titles = [s.title for s in previous_steps]
    
    prompt = f"""
    You are the Timeline Architect.
    Project Goal: {timeline.goal}
    Context: {json.dumps(timeline.context)}
    Completed Steps: {json.dumps(prev_titles)}
    
    Generate the NEXT single most important step for the user.
    It should be concrete, verifiable, and achievable in 1-3 days.
    
    Return JSON format:
    {{
        "title": "Short title",
        "description": "1 sentence overview",
        "content": "Detailed markdown instructions, including checklists or code snippets if relevant."
    }}
    """
    
    completion = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.7
    )
    
    try:
        content = completion.choices[0].message.content
        data = json.loads(content)
        return data
    except Exception as e:
        print(f"Error generating step: {e}")
        return {
            "title": "Error generating step",
            "description": "Please try again",
            "content": f"System error: {str(e)}"
        }
