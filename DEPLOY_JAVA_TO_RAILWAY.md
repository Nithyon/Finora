# Deploy Java Analytics Service to Railway (5 Minutes)

## Step 1: Create Railway Account
1. Go to: https://railway.app
2. Click **"Start Project"**
3. Sign in with GitHub (easiest)
4. Authorize Railway

## Step 2: Deploy Your Project
1. Click **"Create New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: `Nithyon/Finora` repository
4. Select branch: `main`
5. Click **"Deploy"**

Railway will automatically detect and build your project.

## Step 3: Configure Root Directory
1. Once deployed, go to your Railway **Project Dashboard**
2. Click on the **"finora" service**
3. Go to **Settings** tab
4. Find **"Root Directory"**
5. Set to: `backend-java`
6. Click **Save**

Railway will rebuild with this setting.

## Step 4: Get Your Public URL
1. Go to the **Deployments** tab
2. Wait for "✅ Success" status (5-10 minutes first time)
3. Under the successful deployment, find **"Public URL"**
4. Copy it - looks like: `https://finora-prod-xxxx.railway.app`

## Step 5: Update Vercel
1. Go to: https://vercel.com/dashboard
2. Select your **Finora** project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   ```
   Name: NEXT_PUBLIC_ANALYTICS_API
   Value: https://your-railway-url.railway.app
   ```
5. Click **Save**
6. Trigger **Redeploy** from Deployments tab

## Step 6: Test It! 
1. Wait 2-3 minutes for Vercel to rebuild
2. Go to: https://finora-six.vercel.app/analytics
3. Click **Analytics (📊)** button
4. **You should see real data now!** ✅

---

## Troubleshooting

**Still showing "service unavailable"?**
- Wait another 2-3 minutes (Railway may still be building)
- Hard refresh browser: `Ctrl+Shift+R`
- Check Railway deployment logs for errors
- Verify Vercel environment variable is set correctly

**Railway build failed?**
- Check the build logs in Railway dashboard
- Make sure Root Directory is set to `backend-java`
- Try redeploying from Railway dashboard

---

**That's it!** Your Java service will be live and accessible from everywhere! 🎉
