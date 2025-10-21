#!/usr/bin/env python3
"""
Automated HuggingFace Spaces Deployment Script for Finora Backend
This script automates the entire deployment process
"""

import os
import subprocess
import sys
import shutil
from pathlib import Path

def run_command(cmd, description):
    """Run a shell command and report status"""
    print(f"\n📋 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} - Success!")
            return True
        else:
            print(f"❌ {description} - Failed!")
            print(f"Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("=" * 70)
    print("🚀 FINORA BACKEND - AUTOMATED HUGGINGFACE DEPLOYMENT")
    print("=" * 70)
    print()
    
    # Get HuggingFace username
    hf_username = input("📝 Enter your HuggingFace username: ").strip()
    if not hf_username:
        print("❌ Username cannot be empty!")
        return
    
    print()
    print(f"✅ Username: {hf_username}")
    print(f"✅ Space will be: https://huggingface.co/spaces/{hf_username}/finora-backend")
    print()
    
    # Create temp directory
    temp_dir = Path.home() / "finora-hf-deploy"
    if temp_dir.exists():
        print(f"Cleaning up old deployment folder: {temp_dir}")
        shutil.rmtree(temp_dir)
    
    temp_dir.mkdir(parents=True, exist_ok=True)
    os.chdir(temp_dir)
    
    print()
    print("=" * 70)
    print("STEP 1: Clone HuggingFace Space Repository")
    print("=" * 70)
    
    hf_git_url = f"https://huggingface.co/spaces/{hf_username}/finora-backend.git"
    
    print(f"\n🔗 Space URL: {hf_git_url}")
    print("\n⚠️  If you haven't created the Space yet:")
    print("   1. Go to https://huggingface.co/spaces")
    print("   2. Click 'Create new Space'")
    print("   3. Name: finora-backend")
    print("   4. Space SDK: Docker")
    print("   5. Click 'Create Space'")
    print("\n📝 Press ENTER when your Space is created...")
    input()
    
    print("\n🔐 Git will ask for credentials:")
    print("   Username: YOUR_HF_USERNAME")
    print("   Password: YOUR_HF_TOKEN (get from https://huggingface.co/settings/tokens)")
    print()
    
    if not run_command(f'git clone "{hf_git_url}"', "Cloning HuggingFace Space"):
        print("\n❌ Failed to clone. Make sure:")
        print("   1. You created the Space on HuggingFace")
        print("   2. Your credentials are correct")
        return
    
    hf_space_dir = temp_dir / "finora-backend"
    if not hf_space_dir.exists():
        print("❌ Space directory not created. Git clone may have failed.")
        return
    
    os.chdir(hf_space_dir)
    
    print()
    print("=" * 70)
    print("STEP 2: Copy Backend Files from Your Project")
    print("=" * 70)
    
    # Find the backend directory
    finora_backend = Path.home() / "Documents" / "finora" / "backend"
    
    if not finora_backend.exists():
        print(f"❌ Backend directory not found at {finora_backend}")
        print("Please ensure your Finora project is at ~/Documents/finora")
        return
    
    print(f"\n📂 Source: {finora_backend}")
    print(f"📂 Destination: {hf_space_dir}")
    
    # Copy files
    files_to_copy = [
        "main.py",
        "models.py", 
        "schemas.py",
        "chatbot_enhanced.py",
        "classifier.py",
        "requirements.txt",
        "Dockerfile",
        ".env.example"
    ]
    
    print("\n📦 Copying files:")
    for file in files_to_copy:
        src = finora_backend / file
        dst = hf_space_dir / file
        if src.exists():
            shutil.copy2(src, dst)
            print(f"   ✅ {file}")
        else:
            print(f"   ⚠️  {file} (not found, skipping)")
    
    print("\n✅ Files copied!")
    
    print()
    print("=" * 70)
    print("STEP 3: Commit and Push to HuggingFace")
    print("=" * 70)
    
    commands = [
        ('git config user.email "bot@finora.ai"', "Configure git email"),
        ('git config user.name "Finora Bot"', "Configure git name"),
        ('git add .', "Stage all files"),
        ('git commit -m "Deploy Finora Backend - AI-powered budget tracking API"', "Create commit"),
        ('git push', "Push to HuggingFace")
    ]
    
    for cmd, desc in commands:
        if not run_command(cmd, desc):
            if "nothing to commit" not in cmd:
                print(f"\n⚠️  Warning: {desc} may have had issues")
                print("Try pushing manually with: git push")
    
    print()
    print("=" * 70)
    print("✅ DEPLOYMENT INITIATED!")
    print("=" * 70)
    print()
    print("🎉 Your backend is being deployed!")
    print()
    print("📝 Next steps:")
    print(f"   1. Go to: https://huggingface.co/spaces/{hf_username}/finora-backend")
    print("   2. Wait for 'Building...' to complete (5-10 minutes)")
    print("   3. When status changes to 'Running', your backend is live!")
    print(f"   4. Your backend URL: https://{hf_username}-finora-backend.hf.space")
    print()
    print("🔗 Test your backend:")
    print(f"   https://{hf_username}-finora-backend.hf.space/docs")
    print()
    print("🔧 Update your frontend .env.local:")
    print(f"   NEXT_PUBLIC_API_URL=https://{hf_username}-finora-backend.hf.space")
    print()
    print("=" * 70)
    print()
    
    # Save info to file
    info_file = Path.home() / "finora-deployment-info.txt"
    with open(info_file, "w") as f:
        f.write(f"Finora Backend Deployment\n")
        f.write(f"{'='*50}\n\n")
        f.write(f"HuggingFace Username: {hf_username}\n")
        f.write(f"Space URL: https://huggingface.co/spaces/{hf_username}/finora-backend\n")
        f.write(f"Backend URL: https://{hf_username}-finora-backend.hf.space\n")
        f.write(f"API Docs: https://{hf_username}-finora-backend.hf.space/docs\n")
        f.write(f"\nFrontend .env.local:\n")
        f.write(f"NEXT_PUBLIC_API_URL=https://{hf_username}-finora-backend.hf.space\n")
    
    print(f"💾 Info saved to: {info_file}")
    print()
    print("✨ Deployment complete! Monitor your Space for build status.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Deployment cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        sys.exit(1)
