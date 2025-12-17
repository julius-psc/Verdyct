import asyncio
import uuid
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import json
from models import (
    IdeaRequest, 
    AnalystResponse, 
    SpyResponse, 
    FinancierResponse, 
    ArchitectResponse,
    VerdyctReportResponse,
    VerdyctReportResponse,
    Agents,
    PixelEvent,
    Project,
    ProjectUpdate,
    WaitlistRequest,
    ContactRequest
)
from auth import verify_token, supabase
from agents.analyst import generate_analysis, search_market_data, generate_rescue_plan
from agents.spy import generate_spy_analysis, get_competitor_intel
from agents.financier import generate_financier_analysis, get_pricing_intel
from agents.architect import generate_architect_blueprint
from agents.architect import generate_architect_blueprint
from agents.watchdog import verify_cta
from database import init_db, get_session, upsert_vector, delete_vector
from sqlmodel import select, delete
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends
from fastapi.staticfiles import StaticFiles
from typing import List, Dict, Optional

app = FastAPI(title="Verdyct Analyst Agent", version="1.0")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.post("/api/track")
async def track_event(event: PixelEvent, session: AsyncSession = Depends(get_session)):
    """
    Ingest pixel events from client sites.
    """
    print(f"Pixel Event Received: {event.project_id} - {event.element_text}")
    
    # Check if project exists
    statement = select(Project).where(Project.id == event.project_id)
    result = await session.exec(statement)
    project = result.first()
    
    if not project:
        # Do not auto-create. Just log warning.
        # We return 200 to avoid breaking the client site.
        print(f"⚠️ Warning: Pixel event received for unknown project: {event.project_id}")
        return {"status": "ignored", "reason": "project_not_found"}
    
    # Save event to DB
    session.add(event)
    await session.commit()
    
    return {"status": "received"}

@app.post("/api/verify-cta")
async def trigger_cta_verification(project_id: str, session: AsyncSession = Depends(get_session)):
    """
    Trigger manual verification of a project's CTA.
    """
    statement = select(Project).where(Project.id == project_id)
    result = await session.exec(statement)
    project = result.first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    result = verify_cta(project.id, project.url)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    # Update project with new CTA info
    project.cta_text = result.get("cta_text")
    project.cta_selector = result.get("cta_selector")
    project.last_verified = datetime.utcnow().isoformat()
    
    session.add(project)
    await session.commit()
    
    return {"status": "verified", "cta": result}

@app.post("/api/waitlist")
async def join_waitlist(request: WaitlistRequest):
    """
    Add email to Supabase waitlist table.
    """
    from auth import supabase
    
    if not supabase:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
        
    try:
        data, count = supabase.table("waitlist").insert({"email": request.email}).execute()
        return {"status": "success", "data": data}
    except Exception as e:
        print(f"Waitlist Error: {e}")
        # Return 200 even on duplicate to avoid leaking info/breaking flow, or handle specifically
        return {"status": "received"}

@app.post("/api/contact")
async def submit_contact(request: ContactRequest):
    """
    Submit contact form to Supabase.
    """
    from auth import supabase
    
    if not supabase:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
        
    try:
        payload = {
            "first_name": request.first_name,
            "last_name": request.last_name,
            "email": request.email,
            "message": request.message
        }
        data, count = supabase.table("contact_submissions").insert(payload).execute()
        return {"status": "success"}
    except Exception as e:
        print(f"Contact Form Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit message")

from fastapi import Response

@app.get("/api/projects", response_model=List[Project])
async def get_projects(response: Response, session: AsyncSession = Depends(get_session), user: tuple = Depends(verify_token)):
    """
    Get all projects for the authenticated user.
    """
    user_payload, _ = user # Ignore token if we are using local DB for projects (wait, we ARE using local DB for projects)
    
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    
    statement = select(Project).where(Project.user_id == user_payload['sub']).order_by(Project.created_at.desc())
    result = await session.exec(statement)
    return result.all()

@app.get("/api/user/credits")
async def get_user_credits(user: tuple = Depends(verify_token)):
    """
    Get current user's credit balance from Supabase.
    """
    user_payload, user_token = user
    user_id = user_payload['sub']
    
    # Authenticated client
    from supabase import create_client, ClientOptions
    from auth import SUPABASE_URL, SUPABASE_KEY
    req_supabase = create_client(
        SUPABASE_URL, 
        SUPABASE_KEY, 
        options=ClientOptions(headers={'Authorization': f'Bearer {user_token}'})
    )
    
    try:
        user_data = req_supabase.table("users").select("credits").eq("id", user_id).execute()
        
        if not user_data.data:
            # Lazy creation
            req_supabase.table("users").insert({"id": user_id, "email": user_payload.get('email'), "credits": 10}).execute()
            return {"credits": 10}
            
        return {"credits": user_data.data[0]['credits']}
    except Exception as e:
        print(f"Error fetching credits: {e}")
        return {"credits": 0} # Fail safe

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Verdyct Analyst Agent"}

@app.post("/analyze", response_model=AnalystResponse)
async def analyze_idea(request: IdeaRequest, user: dict = Depends(verify_token)):
    """
    Endpoint principal pour analyser une idée de startup.
    Reçoit une idée, recherche des données de marché via Tavily,
    et génère un rapport structuré via OpenAI.
    Système de retry automatique si des données critiques manquent.
    """
    max_retries = 3
    retry_count = 0
    
    try:
        # Recherche de données de marché (une seule fois, les données Tavily ne changent pas)
        market_data = search_market_data(request.idea)
        
        # Retry loop pour la génération de l'analyse
        last_error = None
        while retry_count < max_retries:
            try:
                # Génération de l'analyse
                analysis = generate_analysis(
                    request.idea,
                    market_data["context"],
                    max_retries=max_retries
                )
                
                # Si on arrive ici, la validation a réussi
                return analysis
                
            except ValueError as ve:
                # Erreur de validation (listes vides, URLs invalides, etc.)
                last_error = ve
                retry_count += 1
                
                if retry_count < max_retries:
                    print(f"Retry {retry_count}/{max_retries}: {str(ve)}")
                    # Attendre un peu avant de retry (backoff)
                    await asyncio.sleep(1 * retry_count)  # 1s, 2s, 3s...
                else:
                    # Dernier essai échoué
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed after {max_retries} retries. Could not generate valid analysis with verified URLs. Last error: {str(ve)}"
                    )
        
        # Ne devrait jamais arriver ici, mais au cas où
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate analysis after {max_retries} retries: {str(last_error)}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/spy", response_model=SpyResponse)
async def spy_analysis(request: IdeaRequest, user: dict = Depends(verify_token)):
    """
    Endpoint pour l'analyse stratégique et concurrentielle (Spy Agent).
    Reçoit une idée, identifie les concurrents et leurs pain points via Tavily,
    puis génère un quadrant stratégique avec l'ouverture stratégique via OpenAI.
    Système de retry automatique si des données critiques manquent.
    """
    max_retries = 3
    retry_count = 0
    
    try:
        # Reconnaissance concurrentielle (une seule fois, les données Tavily ne changent pas)
        intel_data = get_competitor_intel(request.idea)
        
        # Retry loop pour la génération de l'analyse
        last_error = None
        while retry_count < max_retries:
            try:
                # Génération de l'analyse stratégique
                analysis = generate_spy_analysis(
                    request.idea,
                    intel_data["landscape_context"],
                    intel_data["pain_context"],
                    max_retries=max_retries
                )
                
                # Si on arrive ici, la validation a réussi
                return analysis
                
            except ValueError as ve:
                # Erreur de validation (listes vides, URLs invalides, etc.)
                last_error = ve
                retry_count += 1
                
                if retry_count < max_retries:
                    print(f"Retry {retry_count}/{max_retries}: {str(ve)}")
                    # Attendre un peu avant de retry (backoff)
                    await asyncio.sleep(1 * retry_count)  # 1s, 2s, 3s...
                else:
                    # Dernier essai échoué
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed after {max_retries} retries. Could not generate valid analysis with verified URLs. Last error: {str(ve)}"
                    )
        
        # Ne devrait jamais arriver ici, mais au cas où
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate analysis after {max_retries} retries: {str(last_error)}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/financier", response_model=FinancierResponse)
async def financier_analysis(request: IdeaRequest, user: dict = Depends(verify_token)):
    """
    Endpoint pour l'analyse financière (Financier Agent).
    Reçoit une idée, recherche les prix des concurrents via Tavily,
    suggère un modèle de pricing via OpenAI, puis calcule les projections avec Python.
    Système de retry automatique si des données critiques manquent.
    """
    max_retries = 3
    retry_count = 0
    
    try:
        # Recherche de pricing (une seule fois, les données Tavily ne changent pas)
        pricing_data = get_pricing_intel(request.idea)
        
        # Retry loop pour la génération de l'analyse
        last_error = None
        while retry_count < max_retries:
            try:
                # Génération de l'analyse (sans calculs)
                analysis = generate_financier_analysis(
                    request.idea,
                    pricing_data["pricing_context"],
                    max_retries=max_retries
                )
                
                # Si on arrive ici, la validation a réussi
                return analysis
                
            except ValueError as ve:
                # Erreur de validation (listes vides, URLs invalides, etc.)
                last_error = ve
                retry_count += 1
                
                if retry_count < max_retries:
                    print(f"Retry {retry_count}/{max_retries}: {str(ve)}")
                    # Attendre un peu avant de retry (backoff)
                    await asyncio.sleep(1 * retry_count)  # 1s, 2s, 3s...
                else:
                    # Dernier essai échoué
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed after {max_retries} retries. Could not generate valid analysis with verified URLs. Last error: {str(ve)}"
                    )
        
        # Ne devrait jamais arriver ici, mais au cas où
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate analysis after {max_retries} retries: {str(last_error)}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/architect", response_model=ArchitectResponse)
async def architect_blueprint(request: IdeaRequest, user: dict = Depends(verify_token)):
    """
    Endpoint pour le blueprint technique (Architect Agent).
    Génère un plan technique complet et un MVP fonctionnel.
    """
    max_retries = 3
    retry_count = 0
    
    try:
        last_error = None
        while retry_count < max_retries:
            try:
                blueprint = generate_architect_blueprint(
                    request.idea,
                    max_retries=max_retries
                )
                return blueprint
                
            except ValueError as ve:
                last_error = ve
                retry_count += 1
                
                if retry_count < max_retries:
                    print(f"Retry {retry_count}/{max_retries}: {str(ve)}")
                    await asyncio.sleep(1 * retry_count)
                else:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed after {max_retries} retries. Could not generate valid blueprint. Last error: {str(ve)}"
                    )
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate blueprint after {max_retries} retries: {str(last_error)}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.get("/api/projects/{project_id}", response_model=Project)
async def get_project(project_id: str, session: AsyncSession = Depends(get_session)):
    """
    Get a single project by ID.
    """
    statement = select(Project).where(Project.id == project_id)
    result = await session.exec(statement)
    project = result.first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    return project

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str, session: AsyncSession = Depends(get_session), user: dict = Depends(verify_token)):
    """
    Delete a project by ID.
    """
    # Verify ownership first
    statement = select(Project).where(Project.id == project_id, Project.user_id == user['sub'])
    result = await session.exec(statement)
    project = result.first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    try:
        # Delete from SQL
        await session.delete(project)
        await session.commit()
        
        # Delete from Vector DB
        delete_vector(project_id)
        
        return {"status": "deleted", "id": project_id}
    except Exception as e:
        print(f"Delete Failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, update_data: ProjectUpdate, session: AsyncSession = Depends(get_session), user: dict = Depends(verify_token)):
    """
    Update a project by ID (rename).
    """
    statement = select(Project).where(Project.id == project_id, Project.user_id == user['sub'])
    result = await session.exec(statement)
    project = result.first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if update_data.name is not None:
        project.name = update_data.name
        
    session.add(project)
    await session.commit()
    await session.refresh(project)
    
    return project

@app.post("/generate-report")
async def generate_report(request: IdeaRequest, session: AsyncSession = Depends(get_session), user: tuple = Depends(verify_token)):
    """
    ORCHESTRATOR ENDPOINT (STREAMING)
    Runs agents and streams progress updates via SSE.
    """
    user_payload, user_token = user

    async def event_generator():
        try:
            # Helper to run agent and return tag
            async def run_with_tag(tag, coro):
                try:
                    return tag, await coro
                except Exception as e:
                    return tag, e

            # Step 0: Gatekeeper - REMOVED
            # from agents.gatekeeper import validate_saas_idea
            # gatekeeper_res = validate_saas_idea(request.idea)
            # if not gatekeeper_res.is_saas:
            #     yield f"data: {json.dumps({'type': 'error', 'message': gatekeeper_res.rejection_reason})}\n\n"
            #     return

            # --- RATE LIMIT CHECK (Small Analysis Only) ---
            if request.analysis_type != 'full':
                user_id = user_payload['sub']
                from supabase import create_client, ClientOptions
                from auth import SUPABASE_URL, SUPABASE_KEY
                
                req_supabase = create_client(
                    SUPABASE_URL, 
                    SUPABASE_KEY, 
                    options=ClientOptions(headers={'Authorization': f'Bearer {user_token}'})
                )
                
                try:
                    # Fetch user stats
                    user_data = req_supabase.table("users").select("daily_count, last_active_date").eq("id", user_id).execute()
                    
                    if user_data.data:
                        stats = user_data.data[0]
                        today = datetime.utcnow().date().isoformat()
                        
                        last_active = stats.get('last_active_date')
                        daily_count = stats.get('daily_count', 0)
                        
                        # Reset if new day
                        if last_active != today:
                            daily_count = 0
                            req_supabase.table("users").update({"daily_count": 0, "last_active_date": today}).eq("id", user_id).execute()
                        
                        # Check Limit
                        if daily_count >= 20:
                             yield f"data: {json.dumps({'type': 'error', 'message': 'Daily analysis limit reached (20/day). Please come back tomorrow or upgrade for unlimited access.'})}\\n\\n"
                             return
                             
                        # Increment count (optimistic update, or strictly after success? Let's do it now to prevent spam abuse)
                        req_supabase.table("users").update({"daily_count": daily_count + 1}).eq("id", user_id).execute()
                        
                    else:
                        # Init user if not found (Lazy create handled later partially, but good to ensure here)
                         # defaulting to 0/today is implicit if row inserted later, but let's just proceed
                         pass
                         
                except Exception as e:
                    print(f"Rate Limit Check Error: {e}")
                    # Fail open or closed? Let's fail open but log it to avoid blocking legitimate users on system glitches
                    pass

            # Step 1: Run Analyst
            yield f"data: {json.dumps({'type': 'status', 'agent': 'analyst', 'status': 'running'})}\n\n"
            
            # Run Analyst
            analyst_res = await analyze_idea(request)
            yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'analyst'})}\n\n"
            
            pcs_score = analyst_res.analyst.pcs_score
            
            # Step 2: Gatekeeper
            if pcs_score < 60:
                # REJECTED
                yield f"data: {json.dumps({'type': 'log', 'message': f'POS {pcs_score} < 60. Triggering Rescue Plan.'})}\n\n"
                
                rescue_plan = generate_rescue_plan(request.idea, analyst_res.analyst)
                
                # Persistence (Rejected)
                project_id = str(uuid.uuid4())
                report_data = VerdyctReportResponse(
                    report_id=str(uuid.uuid4()),
                    project_id=project_id,
                    submitted_at=datetime.utcnow().isoformat(),
                    status="rejected",
                    pcs_score=pcs_score,
                    global_summary=f"Idea viability is low (POS: {pcs_score}). Rescue plan generated.",
                    agents=Agents(analyst=analyst_res.analyst),
                    rescue_plan=rescue_plan
                )
                
                project = Project(
                    id=project_id,
                    name=f"{request.idea[:30]}...",
                    raw_idea=request.idea,
                    pos_score=pcs_score,
                    status="rejected",
                    report_json=report_data.dict(),
                    user_id=user['sub']
                )
                session.add(project)
                await session.commit()
                
                upsert_vector(
                    text=request.idea,
                    metadata={"project_id": project_id, "pos_score": pcs_score, "status": "rejected"},
                    vector_id=project_id
                )
                
                yield f"data: {json.dumps({'type': 'complete', 'status': 'rejected', 'data': report_data.dict()})}\n\n"
                return

            else:
                # APPROVED
                yield f"data: {json.dumps({'type': 'log', 'message': f'POS {pcs_score} >= 60. Proceeding with full analysis.'})}\n\n"
                
                # Credit Check & Deduction Logic
                # Only check/deduct for 'full' analysis
                if request.analysis_type == 'full':
                    user_payload, user_token = user
                    user_id = user_payload['sub']
                    
                    # Create authenticated client for this request to respect RLS
                    # (Or use service role if configured globally, but this is safer fallback)
                    from supabase import create_client, ClientOptions
                    from auth import SUPABASE_URL, SUPABASE_KEY
                    
                    # Use the global key (Anon or Service) but attach user token if provided
                    req_supabase = create_client(
                        SUPABASE_URL, 
                        SUPABASE_KEY, 
                        options=ClientOptions(headers={'Authorization': f'Bearer {user_token}'})
                    )
                    
                    try:
                        user_data = req_supabase.table("users").select("credits").eq("id", user_id).execute()
                        
                        current_credits = 0
                        
                        # Use data from Supabase or initialize if not present
                        if not user_data.data:
                            # Create user entry if it doesn't exist (Lazy creation)
                            # Default 10 credits
                            current_credits = 10
                            req_supabase.table("users").insert({"id": user_id, "email": user_payload.get('email'), "credits": 10}).execute()
                        else:
                            current_credits = user_data.data[0]['credits']
                        
                        if current_credits < 1:
                             yield f"data: {json.dumps({'type': 'error', 'message': 'Insufficient credits. Please upgrade or choose Small analysis.'})}\n\n"
                             return

                        # 2. Deduct credit
                        new_credits = current_credits - 1
                        req_supabase.table("users").update({"credits": new_credits}).eq("id", user_id).execute()
                        
                        yield f"data: {json.dumps({'type': 'log', 'message': f'Credit deducted. Remaining: {new_credits}'})}\n\n"
                        
                    except Exception as e:
                        print(f"Supabase Credit Error: {e}")
                        yield f"data: {json.dumps({'type': 'error', 'message': f'System error checking credits: {str(e)}'})}\n\n"
                        return

                # Start parallel agents
                tasks = [] 
                
                # Spy, Financier, Architect ONLY run if full analysis
                if request.analysis_type == 'full':
                     tasks = [
                        run_with_tag("spy", spy_analysis(request)),
                        run_with_tag("financier", financier_analysis(request)),
                        run_with_tag("architect", architect_blueprint(request))
                    ]
                else:
                    yield f"data: {json.dumps({'type': 'log', 'message': 'Small Analysis: Skipping Spy, Financier, Architect.'})}\n\n"
                
                results = {}
                
                # Process as they complete
                for coro in asyncio.as_completed(tasks):
                    tag, result = await coro
                    if isinstance(result, Exception):
                        print(f"Error in {tag}: {result}")
                        # We continue even if one fails, but ideally we should handle it
                        # For now, we might have missing data in the final report
                        results[tag] = None 
                    else:
                        results[tag] = result
                        yield f"data: {json.dumps({'type': 'agent_complete', 'agent': tag})}\n\n"

                # Check if we have all results (or handle failures)
                # Re-construct the specific response objects if needed, or just use what we have
                # The results[tag] are the Pydantic models (SpyResponse, etc)
                
                spy_res = results.get("spy")
                financier_res = results.get("financier")
                architect_res = results.get("architect")
                
                if not spy_res or not financier_res or not architect_res:
                     # Handle critical failure if needed, or just proceed with partial
                     pass

                # Combine results
                agents_data = Agents(
                    analyst=analyst_res.analyst,
                    spy=spy_res.spy if spy_res else None,
                    financier=financier_res.financier if financier_res else None,
                    architect=architect_res.architect if architect_res else None
                )

                # Global Summary
                global_summary = f"Market Analysis: {analyst_res.analyst.analyst_footer.verdyct_summary}\n\n"
                if spy_res:
                    global_summary += f"Strategic Analysis: {spy_res.spy.spy_footer.verdyct_summary.text}\n\n"
                if financier_res:
                    global_summary += f"Financial Analysis: {financier_res.financier.financier_footer.verdyct_summary}\n\n"
                if architect_res:
                    global_summary += f"Product Blueprint: {architect_res.architect.architect_footer.verdyct_summary}"

                # Persistence (Approved)
                project_id = str(uuid.uuid4())

                report_data = VerdyctReportResponse(
                    report_id=str(uuid.uuid4()),
                    project_id=project_id,
                    submitted_at=datetime.utcnow().isoformat(),
                    status="approved",
                    pcs_score=pcs_score,
                    global_summary=global_summary,
                    agents=agents_data
                )

                project = Project(
                    id=project_id,
                    name=f"{request.idea[:30]}...",
                    raw_idea=request.idea,
                    pos_score=pcs_score,
                    status="approved",
                    url=architect_res.architect.mvp_status.mvp_live_link if architect_res else None,
                    report_json=report_data.dict(),
                    user_id=user_payload['sub']
                )
                session.add(project)
                await session.commit()
                
                upsert_vector(
                    text=request.idea,
                    metadata={"project_id": project_id, "pos_score": pcs_score, "status": "approved"},
                    vector_id=project_id
                )
                
                yield f"data: {json.dumps({'type': 'complete', 'status': 'approved', 'data': report_data.dict()})}\n\n"

        except Exception as e:
            error_msg = str(e)
            print(f"Orchestrator Error: {error_msg}")
            
            if "insufficient_quota" in error_msg or "429" in error_msg:
                friendly_msg = "OpenAI API Quota Exceeded. Please check your billing details at platform.openai.com."
                yield f"data: {json.dumps({'type': 'error', 'message': friendly_msg})}\n\n"
            else:
                yield f"data: {json.dumps({'type': 'error', 'message': error_msg})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
