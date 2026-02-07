# Verdyct 2.0: The Aggressive Pivot

## Change Log

### 1. Backend: The "Ruthless" Persona (`server/agents/analyst.py`)
-   **Synthesis Engine Refactor**: Replaced generic summaries with a "Data Extraction Engine". It now hunts for specific numbers, angry quotes, and competitor failures.
-   **Step 1 (Core)**: New "Shark" persona. Focus on "Killing the Wrapper" ideas and classifying competitors ruthlessly.
-   **Step 2 (Strategy)**: New "Mercenary Strategist" persona. Focused on aggressive monetization and viral loops.
-   **Step 3 (Validation)**: New "Executioner" persona. Generates brutal "Pre-Mortems" and "Survival Scores".

### 2. Schema Update (`server/models.py`)
-   Added `market_overview` field to the `Analyst` model to persist the "Thesis / Hook" generated in Step 1.

### 3. Frontend: "The Verdict" UI (`client/.../AnalystView.tsx`)
-   **Rebranding**: Renamed "Market Viability" to **"THE VERDICT"**.
-   **The Hook**: Added a prominent section for the "Thesis" (Step 1 executive summary) right under the score.
-   **The Verdict**: Renamed "Verdyct Analysis" to **"RUTHLESS TAKE"** with aggressive styling.
-   **Quote Integration**: Configured UI to display raw user quotes found by the new synthesis engine.

## Visual Changes
-   **Bold Typography**: "THE VERDICT" and "RUTHLESS TAKE" uses uppercase tracking for impact.
-   **Color Coding**: Red/Green logic for scores to emphasize "Success/Failure" binary.
-   **Italicized Thesis**: The "Killer Insight" is displayed in italics to feel like a direct quote from a VC.

## Next Steps
-   **Test with specific ideas**: Run an analysis on a "Wrapper" idea (e.g., "AI Recipe Generator") and verify the agent brutally dissects it.
-   **Frontend Polish**: Further refine the "Bento Grid" to highlight the "Dirty Secrets" section if data allows.
