import os
from mangum import Mangum

# Import the main app from backend
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from main import app

# Export handler for Vercel
handler = Mangum(app)
