# Script PowerShell de démarrage du serveur Analyst Agent
Write-Host "================================================" -ForegroundColor Cyan
Set-Location $PSScriptRoot
Write-Host "Démarrage du serveur Analyst Agent" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que Python est disponible
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python utilisé: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERREUR: Python n'est pas trouvé dans le PATH" -ForegroundColor Red
    Write-Host "Assurez-vous que Python est installé et dans le PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Vérifier que tavily est installé
try {
    python -c "from tavily import TavilyClient" 2>&1 | Out-Null
    Write-Host "✓ Module tavily disponible" -ForegroundColor Green
} catch {
    Write-Host "ERREUR: Le module tavily n'est pas installé" -ForegroundColor Red
    Write-Host "Installation de tavily-python..." -ForegroundColor Yellow
    python -m pip install tavily-python
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR: Échec de l'installation de tavily-python" -ForegroundColor Red
        exit 1
    }
}

# Vérifier le fichier .env
if (-not (Test-Path ".env")) {
    Write-Host "ATTENTION: Le fichier .env n'existe pas" -ForegroundColor Yellow
    Write-Host "Créez un fichier .env avec vos clés API" -ForegroundColor Yellow
    Write-Host ""
}

# Démarrer le serveur
Write-Host "Démarrage du serveur sur http://localhost:8000" -ForegroundColor Green
Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Yellow
Write-Host ""
python -m uvicorn main:app --reload
