# Java Analytics Integration Guide

This document explains how to integrate the Java Analytics microservice with the Finora frontend.

## Architecture

```
React Frontend (Vercel)
    ↓ (API calls)
Java Analytics Service (Port 8080)
    ↓
PostgreSQL Database (optional)
    ↓
Results
```

## Setup Steps

### 1. Start Java Backend Locally

```bash
cd java-backend
mvn spring-boot:run
```

Service starts at `http://localhost:8080/api`

### 2. Update Frontend API Client

File: `app/utils/analyticsClient.ts`

```typescript
const ANALYTICS_API = process.env.NEXT_PUBLIC_ANALYTICS_API || 'http://localhost:8080/api';

export async function getMonthlySummary(transactions, month) {
  const response = await fetch(`${ANALYTICS_API}/analytics/monthly-summary?month=${month}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactions),
    credentials: 'include'
  });
  return response.json();
}

export async function getSpendingForecast(transactions, month) {
  const response = await fetch(`${ANALYTICS_API}/analytics/forecast?month=${month}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactions),
    credentials: 'include'
  });
  return response.json();
}
```

### 3. Update Analytics Page

File: `app/analytics/page.tsx`

```typescript
import { getMonthlySummary, getSpendingForecast } from '../utils/analyticsClient';

export default function AnalyticsPage() {
  useEffect(() => {
    // Use Java backend instead of local service
    getMonthlySummary(transactions, selectedMonth)
      .then(summary => setMonthlySummary(summary));
  }, [transactions, selectedMonth]);
}
```

### 4. Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_ANALYTICS_API=http://localhost:8080/api
```

For production (Vercel):

```
NEXT_PUBLIC_ANALYTICS_API=https://finora-analytics-prod.herokuapp.com/api
```

## API Endpoints

### POST /api/analytics/monthly-summary?month=2025-10

Request body:
```json
[
  {
    "id": 1,
    "userId": 1,
    "description": "Groceries",
    "amount": 50.00,
    "category": "Groceries",
    "type": "expense",
    "date": "2025-10-15T10:30:00",
    "notes": "Weekly shopping"
  }
]
```

Response:
```json
{
  "month": "2025-10",
  "totalIncome": 5000.00,
  "totalExpense": 2500.00,
  "netSavings": 2500.00,
  "savingsRate": 50.0,
  "categoryBreakdown": [
    {
      "category": "Groceries",
      "amount": 500.00,
      "percentage": 20.0,
      "emoji": "🛒",
      "color": "#3b82f6",
      "transactionCount": 10
    }
  ],
  "largestExpense": 200.00,
  "largestExpenseCategory": "Groceries",
  "transactionCount": 45
}
```

### POST /api/analytics/forecast?month=2025-10

Request body: Same as above

Response:
```json
{
  "month": "2025-11",
  "predictedIncome": 5000.00,
  "predictedExpense": 2450.00,
  "predictedSavings": 2550.00,
  "categoryForecasts": {
    "Groceries": 520.00,
    "Entertainment": 300.00,
    "Transport": 250.00
  },
  "confidence": 0.85,
  "insights": [
    "Many small transactions detected",
    "Top spending category: Groceries"
  ],
  "recommendation": "Good savings rate! Consider investing the surplus."
}
```

## Deployment

### Local Development

```bash
# Terminal 1 - Java Backend
cd java-backend
mvn spring-boot:run

# Terminal 2 - React Frontend  
npm run dev
```

Visit `http://localhost:3000/analytics`

### Production

#### Option 1: Railway (Recommended)

```bash
cd java-backend
railway link
railway deploy
```

Set environment variable in Railway:
```
ANALYTICS_API_PORT=8080
```

#### Option 2: Docker Compose

```bash
docker-compose up
```

Includes both React (port 3000) and Java (port 8080)

#### Option 3: Separate Deployments

- Frontend: Vercel (continues current setup)
- Backend: Render, Fly.io, or Railway

## Testing

### Using cURL

```bash
# Health check
curl http://localhost:8080/api/analytics/health

# Monthly summary
curl -X POST http://localhost:8080/api/analytics/monthly-summary?month=2025-10 \
  -H "Content-Type: application/json" \
  -d '[{"id":1,"userId":1,"amount":50,"category":"Groceries","type":"expense"}]'
```

### Using Dev Test Page

Visit `/dev-test` page which now calls Java backend:

1. Generate demo transactions
2. View analytics calculations from Java service
3. Compare with frontend calculations (for validation)

## Troubleshooting

### CORS Errors

Error: `Access to XMLHttpRequest blocked by CORS policy`

Fix: Ensure `application.properties` has correct CORS origins:
```properties
spring.web.cors.allowed-origins=http://localhost:3000,https://finora-six.vercel.app
```

### Connection Refused

Error: `Connection refused localhost:8080`

Fix: Ensure Java service is running
```bash
mvn spring-boot:run
```

### Port Already in Use

Error: `Port 8080 already in use`

Fix: Change port in `application.properties`:
```properties
server.port=8081
```

## Fallback Strategy

If Java backend is unavailable:

```typescript
try {
  const result = await getMonthlySummary(transactions, month);
  return result;
} catch (error) {
  console.warn('Java backend unavailable, using local calculations');
  return ChartUtils.getSpendingByCategory(transactions);
}
```

## Performance Notes

- Java backend calculates more complex metrics
- Use caching for frequently requested analyses
- Batch transaction requests for efficiency

## Next Steps

1. ✅ Java backend created
2. ⏳ Update analyticsClient.ts to call Java API
3. ⏳ Update analytics page component
4. ⏳ Test with demo data
5. ⏳ Deploy to production

See `java-backend/README.md` for detailed backend documentation.
