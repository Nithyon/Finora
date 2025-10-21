#!/bin/bash
# Production startup script for Finora Backend

cd /app/backend

# Install dependencies
pip install --no-cache-dir -r requirements.txt

# Run the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
