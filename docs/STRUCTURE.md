# 📁 Project Structure Guide

## Overview

This document explains the new organized structure of the Finora project, designed for scalability, maintainability, and developer productivity.

## 🎯 Design Principles

1. **Feature-Based Organization**: Related code lives together
2. **Clear Separation of Concerns**: Frontend, backend, and shared code are distinct
3. **Type Safety First**: Strong TypeScript types throughout
4. **Easy Imports**: Path aliases for clean imports
5. **Scalable**: Easy to add new features without refactoring

## 📂 Directory Structure

```
finora/
├── app/                    # Next.js App Router (ROUTES ONLY)
│   ├── (auth)/            # Auth route group
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/       # Dashboard route group
│   │   ├── page.tsx       # /
│   │   ├── budget/        # /budget
│   │   ├── spending/      # /spending
│   │   ├── accounts/      # /accounts
│   │   ├── reflect/       # /reflect
│   │   ├── chat/          # /chat
│   │   └── settings/      # /settings
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
│
├── src/                   # All application source code
│   ├── features/          # Feature modules (domain logic)
│   ├── components/        # Shared React components
│   ├── lib/              # Utilities, hooks, API client
│   └── types/            # TypeScript type definitions
│
├── backend/              # Python FastAPI backend
│   ├── routes/          # API endpoints
│   ├── models/          # Database models
│   ├── services/        # Business logic
│   └── utils/           # Backend utilities
│
├── public/              # Static assets
├── docs/                # Documentation
└── [config files]       # Root configuration
```

## 🎨 Frontend Structure (`src/`)

### Features (`src/features/`)

Each feature is self-contained with its own components, hooks, and types:

```
src/features/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useAuthProtected.ts
│   └── types.ts
│
├── transactions/
│   ├── components/
│   │   ├── AddTransactionForm.tsx
│   │   └── TransactionList.tsx
│   ├── hooks/
│   │   └── useTransactions.ts
│   └── types.ts
│
├── budget/
│   ├── components/
│   │   ├── BudgetCard.tsx
│   │   └── BudgetChart.tsx
│   ├── hooks/
│   │   └── useBudget.ts
│   └── types.ts
│
└── chat/
    ├── components/
    │   └── HuggingFaceChatbot.tsx
    ├── hooks/
    │   └── useChat.ts
    └── types.ts
```

**Benefits:**
- ✅ Easy to find feature-related code
- ✅ Can work on a feature without affecting others
- ✅ Clear ownership and responsibility
- ✅ Easy to delete/add features

### Components (`src/components/`)

Shared, reusable components:

```
src/components/
├── ui/               # Primitive UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── ...
│
└── layout/          # Layout components
    ├── Header.tsx
    ├── BottomNav.tsx
    └── Sidebar.tsx
```

**Usage:**
```typescript
import { Button, Input, Card } from '@/components/ui';
import { Header, BottomNav } from '@/components/layout';
```

### Library (`src/lib/`)

Utilities, helpers, and shared logic:

```
src/lib/
├── api/              # API client
│   ├── client.ts     # Axios instance & methods
│   ├── config.ts     # API configuration
│   └── endpoints.ts  # API endpoint helpers
│
├── hooks/           # Shared React hooks
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── useWindowSize.ts
│
└── utils/           # Helper functions
    ├── constants.ts
    ├── format.ts
    └── validation.ts
```

**Usage:**
```typescript
import { apiService } from '@/lib/api/client';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { isValidEmail } from '@/lib/utils/validation';
import { STORAGE_KEYS } from '@/lib/utils/constants';
```

### Types (`src/types/`)

TypeScript type definitions:

```
src/types/
├── index.ts         # Main export file
├── transaction.ts
├── user.ts
├── budget.ts
├── api.ts
└── chat.ts
```

**Usage:**
```typescript
import type { Transaction, User, Budget } from '@/types';
```

## 🐍 Backend Structure (`backend/`)

```
backend/
├── routes/              # API endpoints
│   ├── __init__.py
│   ├── auth.py         # /api/auth/*
│   ├── transactions.py # /api/transactions/*
│   ├── budget.py       # /api/budget/*
│   └── chat.py         # /api/chat/*
│
├── models/             # Database models (SQLAlchemy)
│   ├── __init__.py
│   ├── user.py
│   ├── transaction.py
│   └── budget.py
│
├── services/          # Business logic
│   ├── __init__.py
│   ├── auth_service.py
│   ├── transaction_service.py
│   └── chatbot_service.py
│
├── utils/            # Backend utilities
│   ├── __init__.py
│   ├── database.py
│   └── security.py
│
├── main.py          # FastAPI app entry
└── requirements.txt
```

## 🔗 Import Aliases

Configured in `tsconfig.json`:

```typescript
// ❌ Before (relative imports)
import { apiService } from '../../../services/api';
import AddTransactionForm from '../../components/AddTransactionForm';

// ✅ After (clean aliases)
import { apiService } from '@/lib/api/client';
import { AddTransactionForm } from '@/features/transactions/components/AddTransactionForm';
```

**Available aliases:**
- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/features/*` → `src/features/*`
- `@/lib/*` → `src/lib/*`
- `@/types/*` → `src/types/*`

## 📝 Naming Conventions

### Files
- **Components**: PascalCase (e.g., `AddTransactionForm.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useTransactions.ts`)
- **Utils**: camelCase (e.g., `format.ts`, `validation.ts`)
- **Types**: camelCase (e.g., `transaction.ts`, `user.ts`)

### Code
- **Components**: PascalCase
- **Functions/Hooks**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Types/Interfaces**: PascalCase

## 🚀 Migration Steps

1. **Run the restructure script:**
   ```powershell
   .\RESTRUCTURE.ps1
   ```

2. **Update imports in your files** (examples below)

3. **Test the build:**
   ```bash
   npm run build
   ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

## 🔄 Import Update Examples

### Components

**Before:**
```typescript
import AddTransactionForm from '../components/AddTransactionForm';
```

**After:**
```typescript
import { AddTransactionForm } from '@/features/transactions/components/AddTransactionForm';
```

### API Client

**Before:**
```typescript
import { apiService } from './services/api';
```

**After:**
```typescript
import { apiService } from '@/lib/api/client';
```

### Hooks

**Before:**
```typescript
import { useAuthProtected } from '../hooks/useAuthProtected';
```

**After:**
```typescript
import { useAuthProtected } from '@/features/auth/hooks/useAuthProtected';
```

### Types

**Before:**
```typescript
interface Transaction {
  // defined inline
}
```

**After:**
```typescript
import type { Transaction } from '@/types';
```

## ✅ Best Practices

1. **Keep route files minimal**: `app/` should only contain routing logic
2. **Feature independence**: Features should not import from each other
3. **Shared code in lib**: Common logic goes in `src/lib/`
4. **Type everything**: Use TypeScript types from `src/types/`
5. **Export through index**: Features export through `index.ts`

## 📚 Further Reading

- [RESTRUCTURE.md](../RESTRUCTURE.md) - Complete restructure details
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js App Router](https://nextjs.org/docs/app)
- [FastAPI Best Practices](https://fastapi.tiangolo.com/tutorial/)

## 🤝 Contributing

When adding new features:

1. Create a new feature folder in `src/features/`
2. Add types to `src/types/`
3. Create backend routes in `backend/routes/`
4. Update this documentation

---

**Questions?** Check [RESTRUCTURE.md](../RESTRUCTURE.md) or ask the team!
