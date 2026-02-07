#!/bin/bash
# Robust startup script that handles PORT env var correctly

# Get PORT from environment, default to 8000
PORT=${PORT:-8000}

# Start the application
python main.py
