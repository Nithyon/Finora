# 🚀 Deploy to Vercel - Step by Step

## Prerequisites
- Vercel account (free at vercel.com)
- GitHub account with repo pushed
- HuggingFace API key
- Node.js installed locally

---

## Step 1: Push to GitHub

```bash
cd c:\Users\saini\OneDrive\Documents\finora
git init
git add .
git commit -m "Initial commit: Finora with backend and frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/finora.git
git push -u origin main
```

---

## Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Connect your GitHub account
5. Select the `finora` repository
6. Click "Import"

---

## Step 3: Configure Environment Variables

In Vercel Dashboard:

1. Go to **Project Settings** → **Environment Variables**
2. Add these variables:

```
HUGGINGFACE_API_KEY = your_hf_api_key_here
DATABASE_URL = sqlite:///./finora.db
NEXT_PUBLIC_API_URL = https://your-project.vercel.app/api
```

Get HF key from: https://huggingface.co/settings/tokens

---

## Step 4: Configure Build Settings

1. Go to **Settings** → **Build & Development Settings**
2. Set:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

---

## Step 5: Deploy!

1. Click **Deploy**
2. Wait for deployment to complete (~5 minutes)
3. You'll get a URL like: `https://finora-xyz.vercel.app`

---

## Step 6: Test Your Deployment

### Test API
```bash
curl https://YOUR_URL/api/health
```

Should return:
```json
{"status": "ok", "message": "FINORA API is running"}
```

### Test Frontend
Visit: `https://YOUR_URL`

---

## Troubleshooting

### Build Fails
- Check `HUGGINGFACE_API_KEY` is set
- Ensure all dependencies in `package.json`
- Check Next.js build in local: `npm run build`

### API Not Working
- Verify environment variables set in Vercel
- Check logs: Vercel Dashboard → Deployments → Logs
- API endpoint should be at `/api/*`

### Database Issues
- SQLite database auto-creates
- May need to initialize on first run
- Check backend logs for errors

---

## Redeploy After Changes

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys!
```

---

## Important Files

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel configuration |
| `api_handler.py` | API handler for Vercel |
| `package.json` | Frontend dependencies |
| `.env.example` | Environment variables template |

---

## Frontend Environment

Create or update `app/config.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default {
  API_URL,
};
```

---

## Monitoring

1. **Vercel Dashboard**
   - Monitor builds and deployments
   - Check function logs
   - View analytics

2. **Logs**
   - API logs at `/api/*`
   - Frontend logs in browser console

3. **Performance**
   - Use Vercel Analytics
   - Monitor API response times

---

## Next Steps

1. ✅ Deploy backend API
2. ✅ Deploy frontend
3. ✅ Setup environment variables
4. ✅ Test all endpoints
5. ✅ Configure custom domain (optional)
6. ✅ Setup monitoring

---

## Useful Links

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- FastAPI Docs: https://fastapi.tiangolo.com/
- GitHub: https://github.com

---

**Your app is now LIVE!** 🎉

Share your Vercel URL and start using Finora!
