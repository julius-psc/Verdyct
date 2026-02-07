# Plan de Refonte : Analyst Agent "The Converter"

## Objectif
Transformer l'Agent Analyste (Gratuit) d'un simple rapporteur passif à un **"Teaser Stratégique"** irrésistible qui démontre une valeur immédiate et incite à l'achat des agents spécialisés (Spy, Financier, Architect), tout en maîtrisant les coûts.

## Contraintes
-   **Coût** : Maintien ou réduction des coûts actuels (GPT-4o + Tavily).
-   **Schema** : Pas de changement majeur du schéma JSON (pour l'instant) pour éviter de casser le frontend. On utilise les champs existants plus intelligemment.
-   **Impact** : Effet "Wow" immédiat → "Cet agent a compris mon business mieux que moi."

---

## 1. Stratégie de Contenu : "Insight vs Data"

Actuellement, l'Analyst remplit des cases (TAM, SAM, Concurrents).
Futurement, il doit trouver **L'Angle** (The Hook).

### A. Le "Killer Insight" (Nouveau Champ Logique)
On utilise le champ `market_overview` ou `verdyct_summary` pour ne plus faire un résumé, mais une **Thèse**.
*   *Avant* : "Le marché du CRM est en croissance de 12%..."
*   *Après* : "Le marché CRM est saturé, MAIS les avis clients montrent une haine massive pour la complexité de Salesforce. Votre opportunité n'est pas d'être 'meilleur', mais d'être 'le anti-Salesforce'. Voici pourquoi..."

### B. La Preuve par l'Exemple (Real Quotes)
Dans `market_metrics` ou `market_pain_points`, on force l'insertion de **citations réelles** trouvées par Tavily.
*   *Au lieu de* : "Users complain about price."
*   *On veut* : "Utilisateur u/SaaS_Hater sur Reddit : 'I pay $50/mo for this tool and it crashes every Tuesday.' (Source: reddit.com/...)"

### C. Le Teasing "Spy & Financier" (Intégré)
On utilise les champs `competitors_preview` et `unit_economics_preview` pour teaser explicitement.
*   *Competitors* : "J'ai trouvé 3 concurrents cachés qui n'affichent pas leurs prix. *L'agent Spy peut aller scraper ces données pour vous.*"
*   *Unit Economics* : "Votre CAC estimé est de $50, mais si vous optimisez X, il pourrait descendre. *L'agent Financier peut modéliser ce scénario.*"

---

## 2. Optimisation Technique (Coût & Vitesse)

### A. Pipeline de Prompts Affiné
On remplace la structure "3 Appels GPT-4o" par un pipeline hybride plus malin :

1.  **Recherche (Tavily)** : Inchangé (4 appels c'est bien). Ajout d'une recherche spécifique "Complaints about [Topic]" dès cette phase.
2.  **Synthèse (GPT-4o-mini)** : **CRITIQUE**. On modifie le prompt pour qu'il ne "résume" pas, mais qu'il **"extraie les pépites"** (chiffres, citations, noms propres). Le résumé tue la nuance.
3.  **One-Shot Thinking (GPT-4o)** :
    *   Au lieu de faire Step 1, Step 2, Step 3 séparément (3 appels couteux), on peut tenter de regrouper **Step 1 & 2** en un seul appel `AnalystCoreStrategy`.
    *   On garde **Step 3 (Validation)** séparé car il demande un "Changement de Personnage" (Le Sceptique) qui bénéficie d'un contexte frais.
    *   *Gain estimé* : 33% d'économie sur les tokens d'output et de latence.

### B. Prompting "Opinionated"
On change les System Prompts pour qu'ils aient une **personnalité forte**.
*   *Actuel* : "You are a market analyst."
*   *Nouveau* : "You are a ruthless VC analyst. Your job is to find the flaw in the plan OR the golden opportunity. Be specific. Do not be polite. Use data."

---

## 3. Implémentation Concrète (Prochaines étapes)

1.  **Modifier `synthesize_tavily_data` (analyst.py)**
    *   Objectif : Garder les "Raw Quotes" et les "Specific Numbers". Interdire le "fluff" et les généralités.

2.  **Refondre `generate_analysis`**
    *   Fusionner ou optimiser les appels LLM.
    *   Injecter des instructions de "Teasing" dans les prompts de Step 1 & 2.

3.  **Refondre `step_1_core_analysis` & `step_3_validation`**
    *   Forcer la génération d'un "Verdict" tranché dans le score.
    *   Remplir `market_pain_points` avec de vraies citations.

## Validation
On testera avec une idée "cliché" (ex: "Un Uber pour promener les chiens") et on verra si l'analyste dit "Marché saturé, voici pourquoi" au lieu de "Marché prometteur de 10Mds$".
