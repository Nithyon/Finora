# 🎨 Finora Feature Integration - Visual Maps

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FINORA APP (Complete System)                 │
└─────────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ↓                    ↓                    ↓
    ┌────────┐          ┌────────┐          ┌────────┐
    │ Frontend             Backend            Storage
    │ (Next.js)         (FastAPI)           (Multiple)
    └────────┘          └────────┘          └────────┘
        │                    │                    │
        ├─ React Components  ├─ Transactions    ├─ localStorage
        ├─ TypeScript        ├─ Accounts        ├─ Backend DB
        ├─ AppContext        ├─ Categories      └─ Session
        └─ Tailwind CSS      └─ User Data
```

---

## Page Interconnection Map

```
                    ⚙️ SETTINGS (Hub)
                   /    /     \    \
                  /    /       \    \
                 /    /         \    \
                /    ↓          ↓    \
    🏠 HOME ←→ 🎯 PERSONALIZE 💰 SPENDING
       ↓ │         ↓      ↑      ↑ │
       │ │         │      └──────┘ │
       │ │         │               │
       │ └─────────┼───────────────┤
       │           ↓               ↓
       └────→ 💬 CHAT ←───────────┘
              │   ↓   │
              │   ↓   │
              └→ 🎯 REFLECT ←─────┐
                 ↑    ↑           │
                 └────┼───────────┘
                      ↑
                   🏦 ACCOUNTS
```

---

## Data Flow Diagram

```
USER INPUT
    │
    ├─ Home: Monthly Income
    │         │
    │         ├→ localStorage (finora_ynab_setup)
    │         └→ Personalize Plan (loads next visit)
    │
    ├─ Personalize Plan: Budget Targets
    │         │
    │         ├→ localStorage (finora_budget_targets)
    │         ├→ Spending (auto-load)
    │         └→ Reflect (auto-load)
    │
    └─ Backend: Transactions & Accounts
              │
              ├→ AppContext
              ├→ Spending (calculate breakdown)
              ├→ Home (actual spending)
              └→ Accounts (per-account tracking)
```

---

## Budget Tracking Cycle

```
     USER ENTERS INCOME
              │
              ↓
    [PERSONALIZE PLAN]
      Set Budget Targets
       Save to Storage
              │
              ↓
    [SPENDING PAGE]
    Track Against Targets
     Color-coded Status
         (Green/Yellow/Red)
              │
              ↓
    [HOME DASHBOARD]
   Shows Spending Summary
     Quick Action Links
              │
              ↓
    [ACCOUNTS PAGE]
   Per-Account Breakdown
    Health Indicators
              │
              ↓
    [CHAT GUIDANCE]
     Get Recommendations
    Get Action Links
              │
              ↓
    [REFLECT GOALS]
   Progress Tracking
     Goal Management
              │
              └──→ CYCLE REPEATS
```

---

## User Journey Map

```
NEW USER
    │
    ├─ First Visit
    │  ├─ Sees Home Setup Modal
    │  ├─ Enters Monthly Income
    │  ├─ Clicks "Personalize Plan"
    │  ├─ Sets Budget Targets
    │  ├─ Saves Targets
    │  └─ Returns to Home
    │
    ├─ Exploration Phase
    │  ├─ Views Spending Breakdown
    │  ├─ Checks Account Balances
    │  ├─ Reads Chat Guidance
    │  ├─ Reviews Reflect Goals
    │  └─ Adjusts Settings
    │
    └─ Regular Usage
       ├─ Daily: Check Home Dashboard
       ├─ Weekly: Review Spending
       ├─ Monthly: Adjust Budget
       ├─ Always: Access Settings
       └─ Anytime: Get Chat Help
```

---

## Component Hierarchy

```
┌─ Layout (Root)
│  └─ BottomNavbar
│
├─ Home Page
│  ├─ Header (with Settings icon)
│  ├─ Setup Modal (first time)
│  ├─ Ready to Assign Card
│  ├─ Stats Cards (Assigned/Spending)
│  ├─ Spending Overview
│  ├─ Category Grid
│  ├─ Assign Modal
│  └─ Help Text
│
├─ Personalize Plan Page
│  ├─ Header (with Settings icon & Next button)
│  ├─ Cost Summary
│  ├─ Monthly Targets Card
│  ├─ Amount Input Modal
│  └─ Category Lists (Bills/Needs/Wants)
│
├─ Spending Page
│  ├─ Header (with Settings icon)
│  ├─ Total Spending Card
│  ├─ Stats Grid
│  └─ Category Cards (with Budget vs Actual)
│
├─ Accounts Page
│  ├─ Header (with Settings icon)
│  ├─ Total Balance Card
│  ├─ Quick Stats
│  └─ Account Cards (with Health Indicator)
│
├─ Chat Page
│  ├─ Header (with Settings icon & Status)
│  ├─ Messages List
│  │  ├─ User Messages
│  │  ├─ Bot Messages
│  │  └─ Navigation Links (NEW!)
│  ├─ Loading Animation
│  └─ Input Form
│
├─ Reflect Page
│  ├─ Header (with Settings icon)
│  ├─ Goals Summary
│  ├─ Personal Goals Section
│  ├─ Budget Targets Section
│  ├─ Quick Stats
│  ├─ Add Goal Button
│  └─ Edit Targets Link
│
└─ Settings Page
   ├─ Header (with Settings icon)
   ├─ Account Settings
   ├─ Bank Connections
   ├─ App Settings
   ├─ Notifications
   └─ Log Out Button
```

---

## State Management Flow

```
┌─────────────────────────────────────┐
│      React State (In-Memory)        │
├─────────────────────────────────────┤
│ • Page-specific state (forms, modals)
│ • Temporary UI state
│ • Hover/focus states
│ • Animation states
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│    Context API (AppContext)         │
├─────────────────────────────────────┤
│ • User data
│ • Accounts list
│ • Transactions
│ • Loading state
│ • Connected from Backend (FastAPI)
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│    localStorage (Browser Storage)   │
├─────────────────────────────────────┤
│ • finora_ynab_setup (income)
│ • finora_budget_targets (targets)
│ • user_email
│ • auth_token
│ • user_name
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│   Backend API (FastAPI/HF Spaces)   │
├─────────────────────────────────────┤
│ • Accounts
│ • Transactions
│ • User Profile
│ • Chat Responses
│ • Persistent Data
└─────────────────────────────────────┘
```

---

## Feature Integration Timeline

```
START (Isolated Features)
  │
  ├─ Task 1: Settings Accessibility (30 min)
  │  └─ Added ⚙️ icon to all pages
  │
  ├─ Task 2: Budget → Plan Connection (30 min)
  │  └─ Income sync via localStorage
  │
  ├─ Task 3: Plan → Spending Connection (45 min)
  │  └─ Budget targets loaded & displayed
  │
  ├─ Task 4: Spending → Home Connection (30 min)
  │  └─ Actual spending shown on dashboard
  │
  ├─ Task 5: Chat Navigation Links (20 min)
  │  └─ Links rendered in responses
  │
  ├─ Task 6: Reflect Goals Integration (30 min)
  │  └─ Budget targets shown in Reflect
  │
  ├─ Task 7: Accounts Functionality (30 min)
  │  └─ Spending per account tracked
  │
  └─ Documentation (1 hour)
     └─ Created guides & references
     
COMPLETE (Fully Integrated System)
```

---

## Storage Layer Diagram

```
┌──────────────────────────────────────────────────────┐
│              Browser Storage (localStorage)          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  finora_ynab_setup                                   │
│  ┌────────────────────────┐                          │
│  │ {                      │                          │
│  │   income: 50000,       │                          │
│  │   categories: [...]    │                          │
│  │ }                      │                          │
│  └────────────────────────┘                          │
│           Manages: Home Page                         │
│           Used by: Personalize Plan                  │
│                                                      │
│  finora_budget_targets                               │
│  ┌────────────────────────┐                          │
│  │ [                      │                          │
│  │   {                    │                          │
│  │     category: "Rent",  │                          │
│  │     amount: 25000,     │                          │
│  │     icon: "🏠",        │                          │
│  │     ...                │                          │
│  │   },                   │                          │
│  │   ...                  │                          │
│  │ ]                      │                          │
│  └────────────────────────┘                          │
│           Manages: Personalize Plan                  │
│           Used by: Spending, Reflect                 │
│                                                      │
│  Other Keys                                          │
│  ├─ user_email: User identification                  │
│  ├─ auth_token: Authentication                      │
│  └─ user_name: Display name                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Spending Category Status Legend

```
        Budget Status Indicators

    On Track (≤80%)
    ═════════════════════
    Budget: ₹25,000
    Spent:  ₹15,000
    Left:   ₹10,000
    Bar:    🟩🟩🟩🟩⬜ (60%)
    Color:  🟢 GREEN
    Status: ✓ Good

    Caution (80-100%)
    ═════════════════════
    Budget: ₹25,000
    Spent:  ₹22,000
    Left:   ₹3,000
    Bar:    🟩🟩🟩🟩🟨 (88%)
    Color:  🟡 YELLOW
    Status: ⚠ Caution

    Over Budget (>100%)
    ═════════════════════
    Budget: ₹25,000
    Spent:  ₹27,000
    Over:   -₹2,000
    Bar:    🟩🟩🟩🟩🟥 (108%)
    Color:  🔴 RED
    Status: ✗ Over Budget
```

---

## Navigation Link Flow

```
USER IN CHAT
    │
    ├─ Asks Question
    │
    ├─ Chatbot Responds
    │  │
    │  └─ Response includes link (if applicable)
    │     Example: "📊 Personalize Your Plan"
    │
    ├─ Link is Rendered as Button
    │  └─ <Link href="/personalize-plan">
    │       📊 Personalize Your Plan →
    │     </Link>
    │
    ├─ User Clicks Link
    │
    ├─ Navigation Triggered
    │  └─ Next.js Link component handles
    │
    └─ Personalize Plan Page Opens
       └─ User can adjust budget
```

---

## Mobile Optimization Checklist

```
✅ Touch Targets
   ├─ Minimum 44px × 44px
   ├─ All buttons: 50px+
   ├─ All clickable areas: 44px+
   └─ Spacing: 8px between targets

✅ Responsive Layout
   ├─ Max-width: 768px (md breakpoint)
   ├─ Padding: 16px on sides
   ├─ Font: 16px+ for readability
   └─ Line height: 1.5+

✅ Safe Areas
   ├─ Top safe area (notch)
   ├─ Bottom safe area (home indicator)
   ├─ Navigation padding: pb-24
   └─ Header padding: py-4

✅ Navigation
   ├─ Bottom nav: always visible
   ├─ Settings accessible: header icon
   ├─ Back button: navigation or link
   └─ No horizontal scrolling

✅ Performance
   ├─ Images optimized
   ├─ No unnecessary renders
   ├─ Smooth animations
   └─ Fast interactions
```

---

## Error Handling Flow

```
USER ACTION
    │
    ├─ Input Validation
    │  ├─ Amount validation
    │  ├─ Date validation
    │  └─ Email validation
    │
    ├─ If Invalid
    │  └─ Show error message
    │
    ├─ If Valid
    │  └─ Process request
    │
    ├─ Try to Save/API Call
    │  ├─ Success: Update UI
    │  └─ Failure: Show error
    │
    └─ Fallback
       ├─ Use default values
       ├─ Show user-friendly error
       └─ Suggest action
```

---

## Summary Statistics

```
Pages Created:              6
Features Integrated:        7
Data Sync Points:          4
localStorage Keys:          2+
Color Codes:               5
Touch Targets:            44px+
Max Page Width:          768px
Navigation Items:          6
Settings Access Points:    2
User Workflows:           2+
Data Sources:             3
```

---

*Visual Maps Created: October 22, 2025*
*Status: 🟢 PRODUCTION READY*
