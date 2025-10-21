# 🚀 Finora Backend - Complete Deployment Guide

## Quick Summary
Your backend is **99% complete**. Just deploy it and connect the frontend!

---

## 📋 What's Ready

### Backend API (FastAPI)
✅ 20+ REST endpoints
✅ User management
✅ Account management  
✅ Transaction tracking
✅ Budget planning
✅ Goal tracking
✅ AI Chat with context
✅ Smart categorization
✅ Monthly analytics
✅ CORS configured

### Database
✅ SQLAlchemy ORM (ready for PostgreSQL)
✅ SQLite (development)
✅ All models defined

### Files
✅ `backend/main.py` - API server
✅ `backend/models.py` - Database models
✅ `backend/schemas.py` - API schemas
✅ `backend/chatbot_enhanced.py` - AI responses
✅ `backend/classifier.py` - Transaction categorization
✅ `backend/requirements.txt` - Dependencies

---

## 🌐 Deploy to HuggingFace Spaces (5 minutes, COMPLETELY FREE)

### Step 1: Create HuggingFace Account
1. Go to https://huggingface.co
2. Click "Sign Up"
3. Fill in your details
4. Verify email

### Step 2: Create New Space
1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Fill in:
   - **Space name**: `finora-backend` (or your choice)
   - **License**: Choose any
   - **Space SDK**: Select `Docker`
4. Click "Create Space"

### Step 3: Upload Backend Files
Clone the Space repository:
```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/finora-backend
cd finora-backend
```

Copy your backend files:
```bash
# From your project root
cp -r backend/* ./
```

### Step 4: Create Dockerfile
Create `Dockerfile` in the Space root:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 5: Push to HuggingFace
```bash
git add .
git commit -m "Deploy Finora Backend"
git push
```

**Wait 5 minutes** - HuggingFace will build and deploy automatically

### Step 6: Get Your Backend URL
After deployment completes:
- Go to your Space settings
- Find the public URL
- Example: `https://YOUR_USERNAME-finora-backend.hf.space`

---

## 🔗 Connect Frontend to Backend

### Update Environment Variable
Edit `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://YOUR_USERNAME-finora-backend.hf.space
```

### Redeploy Frontend
```bash
git add .env.local
git commit -m "Connect to deployed backend"
git push origin main
```

Vercel will auto-deploy in 2 minutes

---

## ✅ Test the Connection

1. Go to your frontend: https://finora-six.vercel.app
2. Open browser DevTools (F12)
3. Go to Network tab
4. Perform an action (create account, add transaction, etc.)
5. Look for API calls to your backend URL
6. Should see `200 OK` responses

---

## 📊 API Documentation

Once deployed, access Swagger docs:
```
https://YOUR_USERNAME-finora-backend.hf.space/docs
```

This shows all endpoints and allows you to test them directly!

---

## 🛠️ Available Endpoints

### Users
- `POST /users` - Create user
- `GET /users/{user_id}` - Get user details

### Accounts
- `POST /users/{user_id}/accounts` - Create account
- `GET /users/{user_id}/accounts` - List accounts

### Transactions
- `POST /transactions` - Create transaction
- `GET /users/{user_id}/transactions` - List transactions
- `PUT /transactions/{id}` - Update transaction
- `DELETE /transactions/{id}` - Delete transaction

### Budgets
- `POST /users/{user_id}/budgets` - Create budget
- `GET /users/{user_id}/budgets` - List budgets
- `PUT /budgets/{id}` - Update budget

### Goals
- `POST /users/{user_id}/goals` - Create goal
- `GET /users/{user_id}/goals` - List goals
- `PUT /goals/{id}` - Update goal

### AI Features
- `POST /chat` - Chat with AI (with financial context)
- `POST /classify` - Classify transaction
- `GET /budget-advice` - Get AI budget tips
- `GET /users/{user_id}/analytics/monthly` - Monthly analytics

---

## 🔐 Environment Variables (When Deployed)

```env
DATABASE_URL=sqlite:///./finora.db
# Or for production:
# DATABASE_URL=postgresql://user:pass@host/dbname

SECRET_KEY=your-secret-key
API_PORT=8000
ENVIRONMENT=production
```

---

## 💡 Cost Analysis

| Component | Cost | Notes |
|-----------|------|-------|
| HuggingFace Backend | **FREE** ⭐ | Unlimited free tier |
| Vercel Frontend | **FREE** ⭐ | 100GB bandwidth free |
| SQLite Database | **FREE** ⭐ | Included in backend |
| **TOTAL** | **$0/month** ✅ | Completely free! |

---

## 🚨 Troubleshooting

### Backend won't deploy
- Check Dockerfile syntax
- Ensure all Python imports are in requirements.txt
- Check build logs on HuggingFace

### Frontend can't reach backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS headers (already configured)
- Open browser console for error messages

### 502 Bad Gateway
- Backend might be sleeping (free tier)
- Try refreshing page
- Check HuggingFace Space status

---

## 📝 Next Steps

1. **Create HuggingFace account** (2 min)
2. **Create Space and upload files** (3 min)
3. **Update .env.local** (1 min)
4. **Redeploy frontend** (1 min)
5. **Test API calls** (2 min)

**Total: ~10 minutes to production! 🎉**

---

## ❓ Questions?

Check HuggingFace Spaces documentation:
https://huggingface.co/docs/hub/spaces

Or check FastAPI docs:
https://fastapi.tiangolo.com/

Your backend is production-ready! 🚀
