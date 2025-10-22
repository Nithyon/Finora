# Deploy Java Analytics Service to Railway (FREE)

Railway.app offers a **free tier** perfect for hobby projects. Here's how to deploy:

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Start Project"
3. Sign up with GitHub (easiest option)
4. Authorize Railway to access your GitHub

## Step 2: Create New Project
1. Click "Create New Project" 
2. Select "Deploy from GitHub repo"
3. Search and select: `Nithyon/Finora`
4. Select branch: `main`
5. Click "Deploy"

## Step 3: Configure the Service
1. In Railway dashboard, your project will appear
2. Click on the "finora" service
3. Go to the **"Settings"** tab
4. Under **"Service"**, set:
   - **Root Directory**: `backend-java`
   - Click "Save"

## Step 4: Set Up Environment Variables
1. Go to **Variables** tab
2. Add these variables:
   ```
   JAVA_TOOL_OPTIONS = -Dserver.port=$PORT
   PORT = 8080
   ```
3. Click "Add"

## Step 5: Get Your Service URL
1. Go to the **"Deployments"** tab
2. Wait for deployment to complete (usually 3-5 minutes)
3. Once deployed, click on the deployment
4. Copy the **Public URL** (looks like: `https://finora-prod-xxxx.railway.app`)

## Step 6: Update Finora Frontend

Now update your frontend to use this URL:

### Option A: Update Environment Variable (RECOMMENDED)
1. Go to your **Vercel Dashboard**
2. Select your **Finora** project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   ```
   NEXT_PUBLIC_ANALYTICS_API = https://finora-prod-xxxx.railway.app
   ```
   (Replace with your actual Railway URL)
5. Click "Save"
6. Go to **Deployments** and trigger a redeploy or just wait for auto-redeploy

### Option B: Update Code
Edit `app/utils/analyticsClient.ts`:
```typescript
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_ANALYTICS_API || 
  'https://your-railway-url.railway.app';
```

## Step 7: Verify Deployment
1. Wait 2-3 minutes for Vercel to rebuild
2. Go to https://finora-six.vercel.app/analytics
3. You should see data loading instead of "Service unavailable"

## Troubleshooting

### If build fails on Railway:
1. Go to Railway project **Settings**
2. Under **Java**, ensure:
   - **Java Version**: 17
   - **Build Command**: `mvn clean package`

### If still showing "Service unavailable":
1. Check Railway logs (click deployment → view logs)
2. Verify the URL is correct in Vercel environment variables
3. Make sure Railway deployment shows "Success" status

### Monitor Railway Service:
- Dashboard shows real-time logs
- Check CPU/Memory usage in Resources tab
- Railway has generous free tier limits

## Free Tier Limits (Railway)
✅ **Included:**
- $5 free credits every month (plenty for this service)
- 500 GB bandwidth
- Unlimited projects
- Custom domains

---

**Questions?** Check Railway docs: https://docs.railway.app
