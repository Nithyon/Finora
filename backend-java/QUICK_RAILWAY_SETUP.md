# Quick Railway Setup (5 minutes)

## TL;DR - Fast Track

### 1. Go here: https://railway.app/project/create

### 2. Select "Deploy from GitHub"
- Sign in with GitHub
- Select: `Nithyon/Finora`
- Select: `main` branch
- Click "Deploy"

### 3. Configure Root Directory
- Once in Railway dashboard
- Click the project
- Click "Settings" 
- Set **Root Directory** to: `backend-java`
- Save

### 4. Wait for Deployment
- Railway will build and deploy (3-5 minutes)
- You'll see "Deployment Successful"
- Copy the **Public URL** (under Deployments tab)

### 5. Update Vercel
1. Go to: https://vercel.com/dashboard
2. Click your **Finora** project
3. Go to **Settings** → **Environment Variables**
4. Add variable:
   ```
   Name: NEXT_PUBLIC_ANALYTICS_API
   Value: https://your-railway-url.railway.app
   ```
5. Click "Save"
6. Go to **Deployments** → trigger **Redeploy**

### 6. Done! 
- Wait 2 minutes for Vercel rebuild
- Go to https://finora-six.vercel.app/analytics
- Click the Analytics button
- Should see data now! 🎉

---

## Common Issues & Fixes

**"No Port Found"?**
- Go to Railway Settings
- Add: `PORT=8080`

**"Build Failed"?**
- Check Railway logs (red X on deployment)
- Make sure **Root Directory** is `backend-java`

**Still "Service Unavailable"?**
1. Check the Railway URL is correct in Vercel
2. Wait 5 more minutes (first deployment can be slow)
3. Hard refresh browser: `Ctrl+Shift+R`

---

For detailed setup, see: `RAILWAY_DEPLOYMENT.md`
