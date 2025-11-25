@echo off
REM Script de démarrage du serveur Analyst Agent
cd /d %~dp0
echo ================================================
echo Demarrage du serveur Analyst Agent
echo ================================================

REM Vérifier que Python est disponible
python --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Python n'est pas trouve dans le PATH
    echo Assurez-vous que Python est installe et dans le PATH
    pause
    exit /b 1
)

REM Afficher la version de Python utilisée
echo Python utilise:
python --version
echo.

REM Vérifier que tavily est installé
python -c "from tavily import TavilyClient" >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Le module tavily n'est pas installe
    echo Installation de tavily-python...
    python -m pip install tavily-python
    if errorlevel 1 (
        echo ERREUR: Echec de l'installation de tavily-python
        pause
        exit /b 1
    )
)

REM Vérifier le fichier .env
if not exist .env (
    echo ATTENTION: Le fichier .env n'existe pas
    echo Creez un fichier .env avec vos cles API
    echo.
)

REM Démarrer le serveur
echo Demarrage du serveur sur http://localhost:8000
echo Appuyez sur Ctrl+C pour arreter
echo.
python -m uvicorn main:app --reload

