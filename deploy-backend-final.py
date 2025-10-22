#!/usr/bin/env python3
"""
Finora Backend - Direct HuggingFace Space Deployment
Non-interactive deployment script
"""

import os
import subprocess
import shutil
from pathlib import Path

print("=" * 70)
print("🚀 FINORA BACKEND - DEPLOYING TO HUGGINGFACE SPACES")
print("=" * 70)
print()

HF_USERNAME = "Nithiyon"
HF_TOKEN = os.environ.get("HF_TOKEN", "")

print(f"Username: {HF_USERNAME}")
print(f"Space: https://huggingface.co/spaces/{HF_USERNAME}/finora-backend")
print()

# Setup paths
HOME = Path.home()
TEMP_DIR = HOME / "finora-hf-deploy"
FINORA_PROJECT = HOME / "Documents" / "finora"
BACKEND_SRC = FINORA_PROJECT / "backend"

print(f"📁 Backend source: {BACKEND_SRC}")
print(f"📁 Temp directory: {TEMP_DIR}")
print()

# Clean and create temp directory
if TEMP_DIR.exists():
    print("🗑️  Cleaning up old deployment folder...")
    shutil.rmtree(TEMP_DIR)

TEMP_DIR.mkdir(parents=True, exist_ok=True)
os.chdir(TEMP_DIR)

# Step 1: Clone HuggingFace Space
print("=" * 70)
print("STEP 1: Cloning HuggingFace Space Repository")
print("=" * 70)
print()

HF_GIT_URL = f"https://huggingface.co/spaces/{HF_USERNAME}/finora-backend.git"
print(f"🔗 Cloning: {HF_GIT_URL}")

# Configure git to not ask for credentials interactively
os.environ['GIT_TERMINAL_PROMPT'] = '0'

result = subprocess.run(
    ['git', 'clone', HF_GIT_URL],
    capture_output=True,
    text=True
)

if result.returncode != 0:
    print(f"❌ Clone failed: {result.stderr}")
    print("\n⚠️  Make sure:")
    print("   1. You created the Space on HuggingFace")
    print("   2. Your HF_TOKEN environment variable is set with a valid token")
    print("   3. The token has 'write' permissions")
    exit(1)

print("✅ Successfully cloned HuggingFace Space!")
print()

# Step 2: Copy backend files
print("=" * 70)
print("STEP 2: Copying Backend Files")
print("=" * 70)
print()

if not BACKEND_SRC.exists():
    print(f"❌ Backend source not found: {BACKEND_SRC}")
    exit(1)

HF_SPACE_DIR = TEMP_DIR / "finora-backend"
os.chdir(HF_SPACE_DIR)

# Files to copy
files_to_copy = [
    "main.py",
    "models.py",
    "schemas.py",
    "requirements.txt",
    "Dockerfile",
]

for file in files_to_copy:
    src = BACKEND_SRC / file
    dst = HF_SPACE_DIR / file
    if src.exists():
        shutil.copy2(src, dst)
        print(f"✅ Copied: {file}")
    else:
        print(f"⚠️  Skipped (not found): {file}")

# Create .env.example if not exists
env_example = HF_SPACE_DIR / ".env.example"
if not env_example.exists():
    with open(env_example, 'w') as f:
        f.write("""# HuggingFace Spaces Backend Configuration
DATABASE_URL=sqlite:///./finora.db
SECRET_KEY=your-secret-key-here
DEBUG=False
""")
    print("✅ Created: .env.example")

# Create or overwrite Dockerfile with production config
dockerfile_content = """FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY main.py .
COPY models.py .
COPY schemas.py .

# Expose port
EXPOSE 7860

# Run application with proper host binding for HuggingFace Spaces
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
"""

with open(HF_SPACE_DIR / "Dockerfile", 'w') as f:
    f.write(dockerfile_content)
print("✅ Created: Dockerfile (production)")

# Create README
readme_content = """# Finora Backend API

AI-powered budget tracking backend deployed on HuggingFace Spaces.

## Features

- 20+ REST API endpoints
- User and account management
- Transaction tracking and categorization
- Budget and goal management
- AI-powered financial chat assistant
- Automated transaction classification

## API Documentation

Once running, access the interactive API docs at:
- `/docs` - Swagger UI
- `/redoc` - ReDoc

## Environment Variables

See `.env.example` for configuration options.

## Deployment

This Space is automatically built and deployed on every git push.

## Project

Part of the Finora personal finance management system.
"""

with open(HF_SPACE_DIR / "README.md", 'w') as f:
    f.write(readme_content)
print("✅ Created: README.md")

print()

# Step 3: Commit and push
print("=" * 70)
print("STEP 3: Committing and Pushing to HuggingFace")
print("=" * 70)
print()

# Configure git
subprocess.run(['git', 'config', 'user.email', 'finora@bot.local'], check=True)
subprocess.run(['git', 'config', 'user.name', 'Finora Bot'], check=True)

# Add all files
result = subprocess.run(['git', 'add', '.'], capture_output=True, text=True)
if result.returncode != 0:
    print(f"❌ Git add failed: {result.stderr}")
    exit(1)
print("✅ Staged files for commit")

# Commit
result = subprocess.run(
    ['git', 'commit', '-m', 'Deploy Finora Backend to HuggingFace Spaces'],
    capture_output=True,
    text=True
)
if result.returncode != 0:
    # Might be no changes - that's ok
    print(f"⚠️  Commit note: {result.stderr}")
else:
    print("✅ Created commit")

# Push
print("\n🔄 Pushing to HuggingFace... (this may take a moment)")
result = subprocess.run(['git', 'push', 'origin', 'main'], capture_output=True, text=True)

if result.returncode != 0:
    print(f"❌ Push failed: {result.stderr}")
    print("\nNote: You may need to set up your HF_TOKEN environment variable")
    exit(1)

print("✅ Successfully pushed to HuggingFace!")
print()

# Step 4: Summary
print("=" * 70)
print("✅ DEPLOYMENT COMPLETE!")
print("=" * 70)
print()

print(f"🎉 Your Finora Backend is being deployed to:")
print(f"   https://huggingface.co/spaces/{HF_USERNAME}/finora-backend")
print()

print("📊 Building Status:")
print("   Check the Space page above to see the build progress")
print("   Build typically takes 3-10 minutes")
print()

print("🚀 Once deployed, your backend will be available at:")
backend_url = f"https://{HF_USERNAME}-finora-backend.hf.space"
print(f"   {backend_url}")
print()

print("📖 API Documentation:")
print(f"   {backend_url}/docs (Swagger UI)")
print(f"   {backend_url}/redoc (ReDoc)")
print()

print("Next steps:")
print("1. Wait for HuggingFace build to complete (~5 min)")
print("2. Update frontend .env.local with backend URL:")
print(f"   NEXT_PUBLIC_API_URL={backend_url}")
print("3. Redeploy frontend to Vercel")
print("4. Test integration in your Finora app")
print()

print("=" * 70)
