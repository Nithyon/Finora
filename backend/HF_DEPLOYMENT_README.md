# Finora Backend - HuggingFace Spaces Deployment

This folder contains everything needed to deploy the Finora backend to HuggingFace Spaces.

## Quick Start (5 minutes)

### 1. Create HuggingFace Account
- Go to https://huggingface.co
- Sign up (free)

### 2. Create New Space
- Go to https://huggingface.co/spaces
- Click "Create new Space"
- Name: `finora-backend`
- Space SDK: `Docker`
- Click Create

### 3. Clone & Upload
```bash
# Clone your new space
git clone https://huggingface.co/spaces/YOUR_USERNAME/finora-backend
cd finora-backend

# Copy all files from this folder
# Then commit and push
git add .
git commit -m "Deploy Finora Backend"
git push
```

### 4. Wait for Deployment
- HuggingFace will build automatically
- Takes ~5 minutes
- You'll see "Building..." then "Running"

### 5. Get Your URL
- Go to Space settings
- Public URL: `https://YOUR_USERNAME-finora-backend.hf.space`

### 6. Connect Frontend
Update `.env.local` in frontend:
```
NEXT_PUBLIC_API_URL=https://YOUR_USERNAME-finora-backend.hf.space
```

## Files Included

- `Dockerfile` - Container configuration
- `main.py` - FastAPI server
- `models.py` - Database models
- `schemas.py` - API schemas
- `requirements.txt` - Python dependencies
- And more...

## Test It

Once deployed, access Swagger UI:
```
https://YOUR_USERNAME-finora-backend.hf.space/docs
```

## Support

- FastAPI Docs: https://fastapi.tiangolo.com/
- HuggingFace Spaces: https://huggingface.co/docs/hub/spaces
