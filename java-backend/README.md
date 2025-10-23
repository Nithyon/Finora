# Finora Analytics Java Backend

Spring Boot microservice for advanced financial analytics.

## Features

- ✅ Monthly financial summaries
- ✅ Spending forecasts
- ✅ Category breakdown analysis
- ✅ Personalized insights
- ✅ REST API endpoints
- ✅ PostgreSQL integration ready

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.9+
- Docker (optional)

### Build

```bash
mvn clean install
```

### Run Locally

```bash
mvn spring-boot:run
```

Service will start on `http://localhost:8080/api`

### Docker

```bash
# Build image
docker build -t finora-analytics:1.0.0 .

# Run container
docker run -p 8080:8080 finora-analytics:1.0.0
```

## API Endpoints

### Health Check
```
GET /api/analytics/health
```

### Monthly Summary
```
POST /api/analytics/monthly-summary?month=2025-10
Body: List of TransactionDTO objects
```

### Spending Forecast
```
POST /api/analytics/forecast?month=2025-10
Body: List of TransactionDTO objects
```

### Category Breakdown
```
POST /api/analytics/category-breakdown?month=2025-10
Body: List of TransactionDTO objects
```

### Insights
```
POST /api/analytics/insights
Body: List of TransactionDTO objects
```

## Integration

Frontend calls the Java backend from React:

```typescript
// app/utils/analyticsClient.ts
const response = await fetch('http://localhost:8080/api/analytics/monthly-summary', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    month: '2025-10',
    transactions: allTransactions
  })
});
```

## Database

Default: H2 (in-memory)
Production: PostgreSQL

Switch in `application.properties`

## Deployment

### Railway

```bash
railway link
railway deploy
```

### Docker Compose

```bash
docker-compose up
```

## Project Structure

```
java-backend/
├── pom.xml
├── Dockerfile
├── src/
│   ├── main/
│   │   ├── java/com/finora/
│   │   │   ├── FinoraAnalyticsApplication.java
│   │   │   └── analytics/
│   │   │       ├── controller/AnalyticsController.java
│   │   │       ├── service/AnalyticsService.java
│   │   │       └── model/
│   │   │           ├── TransactionDTO.java
│   │   │           ├── MonthlySummary.java
│   │   │           ├── CategoryBreakdown.java
│   │   │           └── SpendingForecast.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── README.md
└── .gitignore
```

## Next Steps

1. [ ] Connect to frontend React components
2. [ ] Add PostgreSQL database
3. [ ] Implement user authentication
4. [ ] Add ML-based predictions
5. [ ] Deploy to Railway/production

## License

MIT
