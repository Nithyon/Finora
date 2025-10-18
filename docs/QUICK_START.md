# 🚀 Quick Start Guide - Finora Backend

## 5-Minute Setup

### Step 1: Install Dependencies (2 min)
```bash
cd c:\Users\saini\OneDrive\Documents\finora\api
pip install -r requirements.txt
```

### Step 2: Set Environment Variable (1 min)
Create file `c:\Users\saini\OneDrive\Documents\finora\api\.env`:
```env
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

(Get free key from: https://huggingface.co/settings/tokens)

### Step 3: Run Backend (1 min)
```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 4: Test API (1 min)
Open in browser: `http://localhost:8000/docs`

---

## 🧪 Test the API

### Test 1: Health Check
Click green "GET /health" button in docs UI

Expected: `{"status": "ok", "message": "FINORA API is running"}`

### Test 2: Create User
Click POST /users button, fill:
```json
{
  "username": "john_doe",
  "email": "john@example.com"
}
```

Expected: User created with ID

### Test 3: Create Account
Click POST /users/{user_id}/accounts, fill:
```json
{
  "name": "Checking",
  "account_type": "Checking",
  "balance": 5000
}
```

### Test 4: Add Transaction (Auto-Categorized!)
Click POST /transactions, fill:
```json
{
  "user_id": 1,
  "transaction": {
    "amount": 50.0,
    "description": "Groceries at Walmart",
    "category_name": "Groceries",
    "account_id": 1,
    "transaction_type": "expense"
  }
}
```

Expected: Transaction created with auto-assigned category!

### Test 5: Chat with AI
Click POST /chat, fill:
```json
{
  "message": "How should I budget my money?",
  "user_context": {
    "total_spent": 2500,
    "spending_by_category": {"Rent": 1500, "Groceries": 500},
    "monthly_budget": 4000,
    "goals": ["Vacation"]
  }
}
```

Expected: AI responds with budget advice!

---

## 📊 Available Endpoints

### Create a Complete Workflow

1. **Create User**
```
POST /users
{
  "username": "alice",
  "email": "alice@example.com"
}
```
Response: `user_id = 1`

2. **Create Account**
```
POST /users/1/accounts
{
  "name": "My Checking",
  "account_type": "Checking",
  "balance": 5000
}
```
Response: `account_id = 1`

3. **Create Budget**
```
POST /users/1/budgets
{
  "category_name": "Groceries",
  "month": "2025-10",
  "allocated": 500
}
```

4. **Add Transactions**
```
POST /transactions?user_id=1
{
  "transaction": {
    "amount": 143.08,
    "description": "BulkCo Groceries",
    "category_name": "Groceries",
    "account_id": 1,
    "transaction_type": "expense"
  }
}
```

5. **Get Analytics**
```
GET /users/1/analytics/monthly?month=2025-10
```
Response: Complete monthly report!

6. **Chat with AI**
```
POST /chat?user_id=1
{
  "message": "Am I spending too much?",
  "user_context": {...}
}
```

---

## 🔍 Troubleshooting

### Error: "ModuleNotFoundError"
**Solution:** Make sure you're in the `api/` folder and ran pip install
```bash
cd c:\Users\saini\OneDrive\Documents\finora\api
pip install -r requirements.txt
```

### Error: "HUGGINGFACE_API_KEY not found"
**Solution:** Create `.env` file in `api/` folder with your HF key
```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxx
```

### Error: "Port 8000 already in use"
**Solution:** Either close the other process or use different port:
```bash
python main.py --port 8001
```

### Database Issue
**Solution:** Delete `finora.db` and restart - it will auto-recreate:
```bash
rm finora.db
python main.py
```

---

## 📚 Documentation

- **Full API Reference:** See `BACKEND_GUIDE.md`
- **Feature Overview:** See `BACKEND_COMPLETE.md`
- **Code Structure:** See `README.md`

---

## 🎯 Next Steps

Once backend is running, you can:

1. **Test All Endpoints** - Use `/docs` UI
2. **Check Database** - Open `finora.db` with SQLite viewer
3. **Monitor Logs** - Watch terminal output
4. **Build Frontend** - Create React components

---

## ⚡ Common Commands

### Start Server
```bash
cd c:\Users\saini\OneDrive\Documents\finora\api
python main.py
```

### Access API Docs
```
http://localhost:8000/docs
```

### Stop Server
```
Press Ctrl+C in terminal
```

### Check Database
```bash
sqlite3 finora.db
.tables
```

### View Logs
```bash
tail -f output.log
```

---

## 🎉 That's It!

Your backend is now running! 🚀

- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- Database: finora.db

Ready to build the frontend? 💪

---

**Questions?** Check the documentation files:
- BACKEND_GUIDE.md - Detailed API reference
- BACKEND_COMPLETE.md - Feature overview
- README.md - Project structure
