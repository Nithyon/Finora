import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

# Import the main app
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'api'))

from main import app

# CORS configuration for Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Export handler for Vercel
handler = Mangum(app)
