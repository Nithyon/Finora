#!/bin/bash
# Automated deployment helper script
# This script helps you deploy to HuggingFace Spaces

echo "================================================"
echo "🚀 Finora Backend - HuggingFace Spaces Deploy"
echo "================================================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Please install Git first."
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python first."
    exit 1
fi

echo "✅ Git and Python found"
echo ""

# Get HuggingFace username
read -p "📝 Enter your HuggingFace username: " HF_USERNAME

if [ -z "$HF_USERNAME" ]; then
    echo "❌ Username cannot be empty"
    exit 1
fi

HF_SPACE_URL="https://huggingface.co/spaces/$HF_USERNAME/finora-backend"
HF_SPACE_GIT="https://huggingface.co/spaces/$HF_USERNAME/finora-backend.git"

echo ""
echo "📦 Deployment Configuration:"
echo "   Username: $HF_USERNAME"
echo "   Space URL: $HF_SPACE_URL"
echo ""

# Create temp directory
TEMP_DIR="/tmp/finora-hf-deploy"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

echo "📥 Cloning HuggingFace Space..."
git clone "$HF_SPACE_GIT" 2>/dev/null || true
cd finora-backend 2>/dev/null || mkdir finora-backend && cd finora-backend

echo "📋 Copying backend files..."
# Copy all backend files from parent directory
cp -v ../../../backend/* ./ 2>/dev/null || cp -v ../../backend/* ./ 2>/dev/null || true

echo ""
echo "✅ Files prepared for deployment"
echo ""
echo "📤 Pushing to HuggingFace Spaces..."
git add .
git commit -m "Deploy Finora Backend - AI-powered budget tracking API" || true
git push

echo ""
echo "================================================"
echo "✅ Deployment initiated!"
echo "================================================"
echo ""
echo "⏳ Next steps:"
echo "1. Go to: $HF_SPACE_URL"
echo "2. Wait for 'Building...' to complete (5-10 minutes)"
echo "3. Once 'Running', get your public URL"
echo "4. Update frontend .env.local:"
echo "   NEXT_PUBLIC_API_URL=https://$HF_USERNAME-finora-backend.hf.space"
echo ""
echo "🎉 Your backend will be live soon!"
echo ""
