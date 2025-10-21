# 🚀 Deploy Finora Backend to HuggingFace Spaces - STEP BY STEP

## Total Time: ~15 minutes (including wait time)

---

## STEP 1: Create HuggingFace Account (2 minutes)

1. Go to: https://huggingface.co
2. Click **Sign Up** (top right)
3. Enter:
   - **Email**: your@email.com
   - **Password**: Strong password
   - **Username**: Choose your username (e.g., `myname-finora`)
4. Check email and verify
5. ✅ Account created!

---

## STEP 2: Create New Space (1 minute)

1. Go to: https://huggingface.co/spaces
2. Click **Create new Space** (blue button)
3. Fill in:
   - **Space name**: `finora-backend`
   - **Space SDK**: Click dropdown → Select **Docker**
   - **License**: MIT (default is fine)
   - **Visibility**: Public (or Private)
4. Click **Create Space**
5. ✅ Space created! Now you'll see an empty repository

---

## STEP 3: Clone the Space Repository (2 minutes)

Open terminal/command prompt:

```bash
# Create a folder for deployment
mkdir finora-deploy
cd finora-deploy

# Clone your new HuggingFace Space
git clone https://huggingface.co/spaces/YOUR_USERNAME/finora-backend
cd finora-backend
```

**Note**: Replace `YOUR_USERNAME` with your actual HuggingFace username

If prompted for credentials:
- Username: `YOUR_USERNAME`
- Password: Use your HuggingFace token (create one at https://huggingface.co/settings/tokens)

✅ Space cloned!

---

## STEP 4: Copy Backend Files (2 minutes)

Now copy all backend files from your Finora project:

```bash
# From inside the finora-backend folder you just cloned
# Copy all files from your local Finora project

# On Windows (cmd):
xcopy C:\Users\saini\Documents\finora\backend\* . /Y

# On Mac/Linux:
cp -r /path/to/finora/backend/* .
```

This should copy:
- ✅ `main.py`
- ✅ `models.py`
- ✅ `schemas.py`
- ✅ `requirements.txt`
- ✅ `chatbot_enhanced.py`
- ✅ `classifier.py`
- ✅ `Dockerfile`
- ✅ And other files

---

## STEP 5: Verify Files (1 minute)

Check that all files are there:

```bash
# List files
ls -la
# or on Windows: dir

# Should see:
# - main.py
# - Dockerfile
# - requirements.txt
# - models.py
# - etc.
```

✅ All files present!

---

## STEP 6: Commit & Push (2 minutes)

Now push everything to HuggingFace:

```bash
# Add all files
git add .

# Commit with a message
git commit -m "Deploy Finora Backend - AI-powered budget tracking API"

# Push to HuggingFace
git push
```

You'll be asked for credentials again - use your HF token

✅ Pushed to HuggingFace!

---

## STEP 7: Wait for Deployment (5-10 minutes)

1. Go to your Space: `https://huggingface.co/spaces/YOUR_USERNAME/finora-backend`
2. You'll see "Building" status
3. Watch the build logs
4. When complete, status will be "Running" ✅

The first build takes ~5-10 minutes. Subsequent deployments are faster.

---

## STEP 8: Get Your Public URL (1 minute)

Once "Running":

1. Go to your Space settings
2. Scroll down to **Hosting**
3. Find **Public URL**: `https://YOUR_USERNAME-finora-backend.hf.space`
4. Copy this URL ✅

---

## STEP 9: Test Your Backend (2 minutes)

Test that it's working:

```
https://YOUR_USERNAME-finora-backend.hf.space/docs
```

You should see the **Swagger UI** with all API endpoints listed!

Try the endpoints:
- Click `GET /categories`
- Click "Try it out"
- Click "Execute"
- Should see categories returned ✅

---

## STEP 10: Connect Frontend to Backend (2 minutes)

Update your frontend to use the backend:

1. Open `.env.local` in your Finora project:
```
NEXT_PUBLIC_API_URL=https://YOUR_USERNAME-finora-backend.hf.space
```

2. Replace `YOUR_USERNAME` with your actual username

3. Save file

4. Commit and push:
```bash
git add .env.local
git commit -m "Connect to deployed backend"
git push origin main
```

5. Vercel will auto-redeploy in 1-2 minutes ✅

---

## STEP 11: Test Full Integration (2 minutes)

1. Go to your frontend: `https://finora-six.vercel.app`
2. Open browser DevTools: **F12** → **Network tab**
3. Navigate around the app
4. You should see API calls to your backend URL
5. Check responses are `200 OK` ✅

---

## ✅ YOU'RE DONE!

Your **complete Finora application** is now live:

| Component | URL | Status |
|-----------|-----|--------|
| **Frontend** | https://finora-six.vercel.app | ✅ Live |
| **Backend** | https://YOUR_USERNAME-finora-backend.hf.space | ✅ Live |
| **Cost** | **$0/month** | ✅ Free |

---

## 🔗 Available Resources

- **Frontend**: https://finora-six.vercel.app
- **Backend API Docs**: https://YOUR_USERNAME-finora-backend.hf.space/docs
- **GitHub Code**: https://github.com/Nithyon/Finora
- **HuggingFace Space**: https://huggingface.co/spaces/YOUR_USERNAME/finora-backend

---

## 🆘 Troubleshooting

### Build fails with "Module not found"
- Check all files were copied correctly
- Verify `requirements.txt` has all dependencies

### Can't access backend URL
- Wait another 5 minutes for build to complete
- Check Space status is "Running" (not "Building")
- Clear browser cache

### Frontend can't connect to backend
- Check `.env.local` has correct URL
- Check CORS headers (already configured in backend)
- Open DevTools and look for error messages

### How do I update the backend?
```bash
# Make changes locally
# Then:
cd finora-backend  # HF Space clone
cp /path/to/finora/backend/* .
git add .
git commit -m "Update backend"
git push
```

---

## 📚 Documentation

- FastAPI: https://fastapi.tiangolo.com/
- HuggingFace Spaces: https://huggingface.co/docs/hub/spaces
- Next.js: https://nextjs.org/docs

---

## 🎉 Congratulations!

You now have a **production-ready, completely free** full-stack application!

**Next steps:**
- Add more features
- Invite users
- Scale as needed
- Upgrade to paid tier if needed (optional)

**Thank you for using Finora! 💰**
