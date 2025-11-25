# Verdyct Agent Cost & Complexity Report

This document outlines the operational costs and technical complexity associated with running the Verdyct Agent system. Costs are estimated based on current API pricing for OpenAI (GPT-4o) and Tavily (Search).

## Cost Summary

| Agent | Operational Cost (Per Run) | Complexity |
| :--- | :--- | :--- |
| **Analyst Agent** | ~$0.025 | Medium |
| **Spy Agent** | ~$0.055 | High |
| **Financier Agent** | ~$0.025 | Medium |
| **Architect Agent** | ~$0.038 | High |
| **TOTAL** | **~$0.143** | **High** |

---

## Detailed Breakdown

### 1. Analyst Agent
**Role:** Market analysis, PCS scoring, and SEO opportunity identification.

*   **API Calls:**
    *   **Tavily:** 1 Advanced Search (Market Data)
    *   **OpenAI:** 1 Call (`gpt-4o-2024-08-06`)
*   **Token Usage (Est.):**
    *   Input: ~2,000 tokens (Search context + Prompt)
    *   Output: ~1,000 tokens (Structured Analysis)
*   **Complexity:** **Medium**
    *   Requires parsing unstructured search data into structured market metrics.
    *   Implements deterministic scoring logic (PCS) with specific weights and penalties.
    *   Includes retry logic for data validation.

### 2. Spy Agent
**Role:** Competitive intelligence, strategic quadrant mapping, and pain point analysis.

*   **API Calls:**
    *   **Tavily:** 3 Advanced Searches (Landscape, General Pain, Competitor Pain)
    *   **OpenAI:** 1 Call (`gpt-4o-2024-08-06`)
*   **Token Usage (Est.):**
    *   Input: ~4,000 tokens (Aggregated search contexts)
    *   Output: ~1,500 tokens (Strategic analysis & Quadrant data)
*   **Complexity:** **High**
    *   Synthesizes data from multiple distinct search contexts.
    *   Requires complex mapping of competitors to a 2D strategic space.
    *   Must extract and validate direct quotes and verified URLs from large text blocks.

### 3. Financier Agent
**Role:** Financial modeling, pricing strategy, and revenue projections.

*   **API Calls:**
    *   **Tavily:** 1 Advanced Search (Pricing Intel)
    *   **OpenAI:** 1 Call (`gpt-4o-2024-08-06`)
*   **Token Usage (Est.):**
    *   Input: ~2,000 tokens (Pricing data)
    *   Output: ~1,000 tokens (Pricing model & Assumptions)
*   **Complexity:** **Medium**
    *   Hybrid logic: AI determines the *strategy* (Business Model, Pricing Tiers), while Python handles the *math* (Projections, CAC/LTV calculations).
    *   Requires accurate business model detection to select the correct pricing structure.

### 4. Architect Agent
**Role:** Technical blueprinting, MVP code generation, and deployment prep.

*   **API Calls:**
    *   **Tavily:** 0 Calls
    *   **OpenAI:** 2 Calls (`gpt-4o-2024-08-06`)
        1.  Blueprint Generation
        2.  MVP Code Generation
*   **Token Usage (Est.):**
    *   Input: ~3,000 tokens (Blueprint + Code Prompt)
    *   Output: ~3,000 tokens (Blueprint JSON + Full Source Code)
*   **Complexity:** **High**
    *   Generates executable code (HTML/CSS/JS).
    *   Integrates with external APIs (GitHub, Vercel) for deployment.
    *   Constructs complex prompts for third-party tools (Lovable).

---

## Pricing Assumptions

*   **Tavily Search:** Estimated at $0.01 per Advanced Search request.
*   **OpenAI GPT-4o:**
    *   Input: $2.50 / 1M tokens
    *   Output: $10.00 / 1M tokens
*   **Note:** Costs are estimates and may vary based on the length of search results and the specific nature of the user's idea.
