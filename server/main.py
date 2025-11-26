import asyncio
import uuid
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
    Project
)
from agents.analyst import generate_analysis, search_market_data, generate_rescue_plan
from agents.spy import generate_spy_analysis, get_competitor_intel
from agents.financier import generate_financier_analysis, get_pricing_intel
from agents.architect import generate_architect_blueprint
from agents.architect import generate_architect_blueprint
from agents.watchdog import verify_cta
from database import init_db, get_session, upsert_vector
from sqlmodel import select
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

@app.get("/api/projects", response_model=List[Project])
async def get_projects(session: AsyncSession = Depends(get_session)):
    """
    Get all projects.
    """
    statement = select(Project).order_by(Project.created_at.desc())
    result = await session.exec(statement)
    return result.all()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Verdyct Analyst Agent"}

@app.post("/analyze", response_model=AnalystResponse)
async def analyze_idea(request: IdeaRequest):
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
async def spy_analysis(request: IdeaRequest):
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
async def financier_analysis(request: IdeaRequest):
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
async def architect_blueprint(request: IdeaRequest):
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

@app.post("/generate-report", response_model=VerdyctReportResponse)
async def generate_report(request: IdeaRequest, session: AsyncSession = Depends(get_session)):
    """
    ORCHESTRATOR ENDPOINT
    Runs ALL 4 agents in parallel using asyncio.gather.
    Returns a combined JSON report with all insights.
    """
    try:
        # Define wrapper functions to handle individual agent failures gracefully if needed
        # For now, we let them raise exceptions which will fail the whole request (as per current design)
        # But we could wrap them in try/except to allow partial success
        
        async def run_analyst():
            return await analyze_idea(request)
            
        async def run_spy():
            return await spy_analysis(request)
            
        async def run_financier():
            return await financier_analysis(request)
            
        async def run_architect():
            return await architect_blueprint(request)
        
        # Step 1: The Gatekeeper - Run Analyst First
        analyst_res = await run_analyst()
        pcs_score = analyst_res.analyst.pcs_score
        
        # Step 2: Conditional Branching
        if pcs_score < 60:
            # Scenario A: Low Score - STOP & RESCUE
            print(f"Gatekeeper: PCS {pcs_score} < 60. Triggering Rescue Plan.")
            
            rescue_plan = generate_rescue_plan(request.idea, analyst_res.analyst)
            
            # --- PERSISTENCE (REJECTED) ---
            # Save rejected project to DB
            project_id = str(uuid.uuid4())
            project = Project(
                id=project_id,
                name=f"Rejected: {request.idea[:30]}...",
                raw_idea=request.idea,
                pos_score=pcs_score,
                status="rejected"
            )
            session.add(project)
            await session.commit()
            
            # Save embedding
            upsert_vector(
                text=request.idea,
                metadata={
                    "project_id": project_id,
                    "pos_score": pcs_score,
                    "status": "rejected"
                },
                vector_id=project_id
            )
            # -----------------------------
            
            return VerdyctReportResponse(
                report_id=str(uuid.uuid4()),
                submitted_at=datetime.utcnow().isoformat(),
                status="rejected",
                pcs_score=pcs_score,
                global_summary=f"Idea viability is low (PCS: {pcs_score}). Rescue plan generated.",
                agents=Agents(
                    analyst=analyst_res.analyst
                ),
                rescue_plan=rescue_plan
            )
            
        else:
            # Scenario B: High Score - GO
            print(f"Gatekeeper: PCS {pcs_score} >= 60. Proceeding with full analysis.")
            
            # Run remaining agents in parallel
            spy_res, financier_res, architect_res = await asyncio.gather(
                run_spy(),
                run_financier(),
                run_architect()
            )
            
            # Combine results
            agents_data = Agents(
                analyst=analyst_res.analyst,
                spy=spy_res.spy,
                financier=financier_res.financier,
                architect=architect_res.architect
            )

            # Construct global summary
            global_summary = (
                f"Market Analysis: {analyst_res.analyst.analyst_footer.verdyct_summary}\n\n"
                f"Strategic Analysis: {spy_res.spy.spy_footer.verdyct_summary.text}\n\n"
                f"Financial Analysis: {financier_res.financier.financier_footer.verdyct_summary}\n\n"
                f"Product Blueprint: {architect_res.architect.architect_footer.verdyct_summary}"
            )

            # --- PERSISTENCE (APPROVED) ---
            # Architect returns a project_id in the blueprint usually, but here we might need to extract it
            # For now, we'll use the one generated by Architect if available, or generate one.
            # Looking at Architect response, it has 'mvp_url' which contains the prompt, but maybe not the ID explicitly in the response model?
            # Let's check ArchitectResponse model. It has 'mvp_url' and 'screenshot_url'.
            # The screenshot URL format is "https://lovable.dev/screenshot/{project_id}.png"
            # We can extract it from there.
            
            project_id = str(uuid.uuid4()) # Default fallback
            try:
                if architect_res.architect.mvp_status.mvp_screenshot_url:
                    # Extract ID from URL
                    parts = architect_res.architect.mvp_status.mvp_screenshot_url.split('/')
                    if parts:
                        filename = parts[-1]
                        project_id = filename.replace('.png', '')
            except:
                pass

            project = Project(
                id=project_id,
                name=f"Approved: {request.idea[:30]}...",
                raw_idea=request.idea,
                pos_score=pcs_score,
                status="approved",
                url=architect_res.architect.mvp_status.mvp_live_link
            )
            session.add(project)
            await session.commit()
            
            # Save embedding
            upsert_vector(
                text=request.idea,
                metadata={
                    "project_id": project_id,
                    "pos_score": pcs_score,
                    "status": "approved"
                },
                vector_id=project_id
            )
            # -----------------------------

            return VerdyctReportResponse(
                report_id=str(uuid.uuid4()),
                submitted_at=datetime.utcnow().isoformat(),
                status="approved",
                pcs_score=pcs_score,
                global_summary=global_summary,
                agents=agents_data
            )
        
    except Exception as e:
        print(f"Orchestrator Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate full report: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
