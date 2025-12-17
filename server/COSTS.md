# Verdyct Agent Cost & Complexity Report

This document outlines the operational costs and technical complexity associated with running the Verdyct Agent system. Costs are estimated based on current API pricing for OpenAI (GPT-4o) and Tavily (Search).

## 1. Unit Cost Summary (Per Agent Run)

| Agent | API Calls | Input Tokens | Output Tokens | Est. Cost | Complexity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gatekeeper** | 1x GPT-4o | ~500 | ~50 | **$0.002** | Low |
| **Analyst** | 1x GPT-4o, 1x Tavily | ~6,000 | ~1,000 | **$0.030** | Medium |
| **Spy** | 1x GPT-4o, 3x Tavily | ~12,000 | ~1,500 | **$0.060** | High |
| **Financier** | 1x GPT-4o, 1x Tavily | ~3,000 | ~1,000 | **$0.023** | Medium |
| **Architect** | 2x GPT-4o (Blueprint+Code) | ~5,000 | ~6,000 | **$0.073** | High |
| **Rescue Plan** | 1x GPT-4o (If rejected) | ~1,000 | ~500 | **$0.008** | Low |

**Total Single Run Cost (Approved Idea)**: Gatekeeper + Analyst + Spy + Financier + Architect = **~$0.188**
**Total Single Run Cost (Rejected Idea)**: Gatekeeper + Analyst + Rescue = **~$0.040**

---

## 2. Offer Profitability Analysis

### A. Beginner (Free Tier)
*   **What it includes**: 1 Complete Analysis (Analyst Agent Only).
*   **Active Agents**: Gatekeeper + Analyst.
*   **Operational Cost**: **$0.032** per user.
*   **Price**: €0.
*   **Profit/Loss**: **-$0.03** (Cost of Acquisition).
*   **Verdict**: Sustainable marketing channel. 1000 free users = ~$32.00 marketing spend.

### B. Starter (One-Time Purchase)
*   **Price**: **€19** (~$20.00).
*   **What it includes**: 5 Full Analyses (All Agents).
*   **Max Operational Cost**: 5 runs × ~$0.188 = **$0.94**.
*   **Gross Margin**: $20.00 - $0.94 = **$19.06**.
*   **Margin %**: **~95%**.
*   **Verdict**: Extremely profitable. Allows for high CPAs (Cost Per Acquisition) in marketing.

### C. Startup (Monthly Subscription)
*   **Price**: **€29/month** (~$30.00).
*   **What it includes**: 20 Full Analyses / month.
*   **Max Operational Cost**: 20 runs × ~$0.188 = **$3.76**.
*   **Gross Margin**: $30.00 - $3.76 = **$26.24**.
*   **Margin %**: **~87%**.
*   **Verdict**: Extremely profitable. Recurring revenue model is highly sustainable.

---

## 3. Cost Assumptions

*   **Tavily Search**: Estimated at $0.005 per Advanced Search request.
*   **OpenAI GPT-4o (2024-08-06)**:
    *   Input: $2.50 / 1M tokens ($0.0025 / 1k).
    *   Output: $10.00 / 1M tokens ($0.0100 / 1k).
*   **GPT-4o-mini**: Used for internal query optimization, cost is negligible (<$0.001 total).

## 4. Risks & Mitigations

*   **Retry Loops**: System allows up to 3 retries per agent if validation fails. In a worst-case scenario, costs could triple ($0.18 -> $0.54 per run). Even at 3x cost, paid margins remain >85%.
*   **Code Generation Spikes**: The Architect agent generates full code output. If the code is exceptionally long, output token costs could increase.
    *   *Mitigation*: Use `gpt-4o-mini` for the heavy lifting of code generation in future updates to save ~$0.04 per run.
*   **Exchange Rate**: Calculations assume €1 ≈ $1.05. Fluctuations have minimal impact given the high margins.
