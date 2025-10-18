# Finora Project Restructure

## 📁 New Project Structure

```
finora/
├── app/                        # Next.js App Router (routes only)
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── page.tsx           # Home/Dashboard
│   │   ├── budget/
│   │   ├── spending/
│   │   ├── accounts/
│   │   ├── reflect/
│   │   ├── chat/
│   │   └── settings/
│   ├── layout.tsx
│   └── globals.css
│
├── src/                        # All source code
│   ├── features/              # Feature-based modules
│   │   ├── auth/              # Authentication feature
│   │   │   ├── components/   # LoginForm, SignupForm
│   │   │   ├── hooks/        # useAuth, useAuthProtected
│   │   │   └── types.ts
│   │   ├── transactions/      # Transaction management
│   │   │   ├── components/   # AddTransactionForm, TransactionList
│   │   │   ├── hooks/        # useTransactions
│   │   │   └── types.ts
│   │   ├── budget/           # Budget planning
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types.ts
│   │   └── chat/             # AI Chat
│   │       ├── components/   # HuggingFaceChatbot
│   │       ├── hooks/
│   │       └── types.ts
│   │
│   ├── components/           # Shared components
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   └── layout/          # Layout components
│   │       ├── Header.tsx
│   │       ├── BottomNav.tsx
│   │       └── Sidebar.tsx
│   │
│   ├── lib/                 # Utilities & helpers
│   │   ├── api/            # API client
│   │   │   ├── client.ts
│   │   │   ├── endpoints.ts
│   │   │   └── config.ts
│   │   ├── hooks/          # Shared hooks
│   │   │   └── useLocalStorage.ts
│   │   └── utils/          # Helper functions
│   │       ├── format.ts
│   │       ├── validation.ts
│   │       └── constants.ts
│   │
│   └── types/              # TypeScript types
│       ├── index.ts
│       ├── transaction.ts
│       ├── user.ts
│       └── api.ts
│
├── backend/                # Python backend (FastAPI)
│   ├── routes/            # API routes
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── transactions.py
│   │   ├── budget.py
│   │   └── chat.py
│   ├── models/            # Database models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── transaction.py
│   │   └── budget.py
│   ├── services/          # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── transaction_service.py
│   │   └── chatbot_service.py
│   ├── utils/             # Backend utilities
│   │   ├── __init__.py
│   │   ├── database.py
│   │   └── security.py
│   ├── main.py           # FastAPI app entry
│   └── requirements.txt
│
├── public/               # Static assets
│   ├── finora-crest.svg
│   └── favicon.ico
│
├── docs/                 # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT.md
│
└── config files...       # Root config files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.js
    └── vercel.json
```

## 🎯 Key Benefits

### 1. **Feature-Based Organization** (`src/features/`)
- Each feature is self-contained with its own components, hooks, and types
- Easy to find and maintain related code
- Clear ownership and boundaries

### 2. **Shared Components** (`src/components/`)
- Reusable UI components in `ui/`
- Layout components in `layout/`
- Separation of concerns

### 3. **Clean API Layer** (`src/lib/api/`)
- Centralized API client configuration
- Type-safe endpoints
- Easy to mock for testing

### 4. **Type Safety** (`src/types/`)
- Shared TypeScript types
- Single source of truth
- Better IDE autocomplete

### 5. **Backend Separation** (`backend/`)
- Clear Python backend structure
- Routes, models, services pattern
- Easy to test and maintain

## 🔄 Migration Commands

```powershell
# Move components to features
Move-Item components\AddTransactionForm.tsx src\features\transactions\components\
Move-Item components\TransactionList.tsx src\features\transactions\components\
Move-Item components\HuggingFaceChatbot.tsx src\features\chat\components\

# Move layout components
Move-Item components\Header.tsx src\components\layout\
Move-Item components\BottomNav.tsx src\components\layout\

# Move hooks
Move-Item app\hooks\useAuthProtected.ts src\features\auth\hooks\

# Move API files
Move-Item app\services\api.ts src\lib\api\client.ts
Move-Item app\config\api.ts src\lib\api\config.ts

# Move backend files
Move-Item api\main.py backend\
Move-Item api\chatbot.py backend\services\chatbot_service.py
Move-Item api\requirements.txt backend\

# Move docs
Move-Item *_GUIDE.md docs\
Move-Item *_STATUS.md docs\
```

## ✅ Next Steps

1. Run migration commands
2. Update import paths in all files
3. Test build: `npm run build`
4. Update documentation
5. Commit changes

## 🚀 Import Path Examples

### Before:
```typescript
import { apiService } from '../services/api';
import AddTransactionForm from '../../components/AddTransactionForm';
```

### After:
```typescript
import { apiService } from '@/lib/api/client';
import { AddTransactionForm } from '@/features/transactions/components/AddTransactionForm';
```

## 📝 Notes

- Use `@/` alias for `src/` directory (configured in tsconfig.json)
- Keep `app/` for Next.js routing only
- Feature folders can have their own README.md
- Each feature should export through an index.ts
