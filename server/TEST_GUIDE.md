# Guide de Test - Analyst Agent Backend

## Étape 1 : Installation des dépendances

```powershell
cd C:\Users\stizi\Documents\server
python -m pip install -r requirements.txt
```

**Note** : Si vous rencontrez une erreur avec `pydantic-core` nécessitant Rust, essayez :
```powershell
python -m pip install --upgrade pip
python -m pip install pydantic --upgrade
python -m pip install -r requirements.txt
```

## Étape 2 : Configuration des clés API

Créez un fichier `.env` à la racine du projet avec vos clés API :

```env
OPENAI_API_KEY=votre_clé_openai_ici
TAVILY_API_KEY=votre_clé_tavily_ici
```

**Où obtenir les clés :**
- **OpenAI** : https://platform.openai.com/api-keys
- **Tavily** : https://tavily.com/ (créer un compte et obtenir une clé API)

## Étape 3 : Démarrer le serveur

```powershell
uvicorn main:app --reload
```

Le serveur démarre sur `http://localhost:8000`

## Étape 4 : Tester l'API

### Option A : Via l'interface Swagger (recommandé)

Ouvrez votre navigateur et allez sur :
```
http://localhost:8000/docs
```

Vous verrez l'interface Swagger interactive où vous pouvez :
1. Cliquer sur `POST /analyze`
2. Cliquer sur "Try it out"
3. Entrer votre JSON :
```json
{
  "idea": "AI eLearning Captioning Tool"
}
```
4. Cliquer sur "Execute"
5. Voir la réponse JSON structurée

### Option B : Via curl (PowerShell)

```powershell
curl -X POST "http://localhost:8000/analyze" `
  -H "Content-Type: application/json" `
  -d '{\"idea\": \"AI eLearning Captioning Tool\"}'
```

### Option C : Via PowerShell Invoke-RestMethod

```powershell
$body = @{
    idea = "AI eLearning Captioning Tool"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/analyze" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Option D : Test du health check

```powershell
curl http://localhost:8000/health
```

Ou dans le navigateur : `http://localhost:8000/health`

## Étape 5 : Vérifier la réponse

La réponse devrait être un JSON structuré avec :
- `analyst.title` : "The Analyst"
- `analyst.analysis_for` : votre idée
- `analyst.score` : un score entre 0-100
- `analyst.market_metrics` : TAM, SAM, CAGR
- `analyst.seo_opportunity.high_opportunity_keywords` : avec `volume_estimate` et `difficulty_level` (qualitatifs, pas de chiffres inventés)
- `analyst.ideal_customer_persona` : persona détaillée
- `analyst.analyst_footer` : résumé et recommandation

## Dépannage

### Erreur : "OPENAI_API_KEY is not set"
- Vérifiez que le fichier `.env` existe et contient vos clés
- Vérifiez qu'il n'y a pas d'espaces autour du `=`
- Redémarrez le serveur après avoir créé/modifié `.env`

### Erreur : "TAVILY_API_KEY is not set"
- Même chose que ci-dessus

### Erreur lors de l'installation des dépendances
- Essayez d'installer les packages un par un :
  ```powershell
  python -m pip install fastapi uvicorn[standard] openai tavily-python pydantic python-dotenv
  ```

### Le serveur ne démarre pas
- Vérifiez que le port 8000 n'est pas déjà utilisé
- Essayez un autre port : `uvicorn main:app --reload --port 8001`

## Exemple de réponse attendue

```json
{
  "analyst": {
    "title": "The Analyst",
    "analysis_for": "AI eLearning Captioning Tool",
    "score": 87,
    "score_card": {
      "title": "Excellent Product Potential",
      "level": "Great Product",
      "description": "..."
    },
    "market_metrics": [
      {
        "name": "Total Addressable Market (TAM)",
        "value": "$1.2B",
        "change_percentage": "+5.1%",
        "note": "vs last period"
      }
    ],
    "seo_opportunity": {
      "title": "SEO & Content Opportunity",
      "subtitle": "Keyword difficulty vs. search volume analysis",
      "high_opportunity_keywords": [
        {
          "term": "WCAG captioning tool",
          "volume_estimate": "High Interest",
          "difficulty_level": "Competitive"
        }
      ]
    },
    ...
  }
}
```


