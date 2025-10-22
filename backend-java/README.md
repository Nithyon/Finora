# Finora Analytics Microservice (Java)

Advanced analytics microservice for Finora personal finance application. Provides financial forecasting, spending analysis, and AI-powered insights.

## Architecture

```
Frontend (Next.js) ──┐
                    ├──→ FastAPI Backend (Main)
                    │         ↓
                    │      SQLite DB
                    │
                    └──→ Java Analytics Service (Port 8081)
                              (This service)
```

## Features

✅ **Monthly Financial Summary** - Income, expense, and breakdown by category  
✅ **Spending Forecasts** - ML-powered predictions based on historical data  
✅ **Category Analysis** - Detailed spending breakdown with trends  
✅ **Smart Insights** - Personalized recommendations and alerts  
✅ **Budget Tracking** - Monitor spending against budget limits  
✅ **Month-to-Month Comparison** - Track spending changes over time  
✅ **CORS Enabled** - Works seamlessly with Next.js frontend

## Tech Stack

- **Framework**: Spring Boot 3.1.5
- **Language**: Java 17
- **Build**: Maven 3.9
- **Container**: Docker
- **API**: REST with JSON

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/health` | Service health check |
| GET | `/api/analytics/monthly-summary/{userId}` | Monthly financial summary |
| GET | `/api/analytics/spending-forecast/{userId}` | Spending predictions |
| GET | `/api/analytics/category-breakdown/{userId}` | Category-wise breakdown |
| GET | `/api/analytics/insights/{userId}` | Smart insights & recommendations |
| GET | `/api/analytics/comparison/{userId}` | Current vs previous month |
| GET | `/api/analytics/budget-tracking/{userId}` | Budget utilization tracking |

### Example Request

```bash
# Get monthly summary
curl -X GET "http://localhost:8081/api/analytics/monthly-summary/1?month=10&year=2025"

# Response
{
  "totalIncome": 50000.00,
  "totalExpense": 25000.00,
  "netIncome": 25000.00,
  "byCategory": {
    "Food": 5000.00,
    "Transport": 3000.00,
    "Entertainment": 2000.00
  },
  "transactionCount": 45,
  "month": "10",
  "year": "2025"
}
```

## Local Development

### Prerequisites

- **Java 17+** - [Download](https://www.oracle.com/java/technologies/downloads/#java17)
- **Maven 3.9+** - [Download](https://maven.apache.org/download.cgi)
- **Docker** (optional) - [Download](https://www.docker.com/)

### Setup

1. **Install Java & Maven** (if not already installed)

```bash
# Verify Java
java -version

# Verify Maven
mvn -version
```

2. **Build the project**

```bash
cd backend-java
mvn clean install
```

3. **Run locally**

```bash
# Development
mvn spring-boot:run

# Or with environment variables
mvn spring-boot:run -Dspring-boot.run.arguments="--finora.api.url=YOUR_API_URL"
```

4. **Test the service**

```bash
curl http://localhost:8081/api/analytics/health
```

Response:
```json
{
  "status": "up",
  "service": "finora-analytics-microservice",
  "port": "8081"
}
```

## Docker Deployment

### Build Docker Image

```bash
# From backend-java directory
docker build -t finora-analytics:latest .
```

### Run with Docker

```bash
docker run -p 8081:8081 \
  -e FINORA_API_URL=https://nithiyon-finora-backend.hf.space \
  finora-analytics:latest
```

### Docker Compose (Full Stack)

See root `docker-compose.yml` for complete stack setup with FastAPI + Java + SQLite.

## Integration with Frontend

### Update Next.js Environment

Add to `.env.local`:

```env
NEXT_PUBLIC_ANALYTICS_API=http://localhost:8081
# Or in production:
# NEXT_PUBLIC_ANALYTICS_API=https://finora-analytics-service.com
```

### Call from React Component

```typescript
// Example: Get monthly summary
async function fetchMonthlySummary(userId: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ANALYTICS_API}/api/analytics/monthly-summary/${userId}?month=10&year=2025`
  );
  return response.json();
}

// In your component
useEffect(() => {
  fetchMonthlySummary(1).then(data => {
    console.log(data);
    // Update UI with analytics data
  });
}, []);
```

## Project Structure

```
backend-java/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/finora/
│   │   │       ├── FinoraAnalyticsApplication.java (Main class)
│   │   │       ├── analytics/
│   │   │       │   ├── controller/ (REST endpoints)
│   │   │       │   │   └── AnalyticsController.java
│   │   │       │   ├── service/ (Business logic)
│   │   │       │   │   └── AnalyticsService.java
│   │   │       │   └── model/ (DTOs)
│   │   │       │       ├── TransactionDTO.java
│   │   │       │       ├── MonthlySummary.java
│   │   │       │       ├── SpendingForecast.java
│   │   │       │       └── CategoryBreakdown.java
│   │   │       └── config/
│   │   └── resources/
│   │       └── application.properties
│   └── test/ (Unit tests)
├── pom.xml (Maven dependencies)
├── Dockerfile
├── .gitignore
└── README.md
```

## Configuration

Edit `src/main/resources/application.properties`:

```properties
# Server Port
server.port=8081

# Main Backend URL
finora.api.url=https://nithiyon-finora-backend.hf.space

# Logging Level
logging.level.com.finora=DEBUG
```

## Production Deployment

### Option 1: Docker to Heroku

```bash
heroku create finora-analytics
heroku container:push web -a finora-analytics
heroku container:release web -a finora-analytics
```

### Option 2: Railway / Render

Upload `docker-compose.yml` and service automatically builds and deploys.

### Option 3: AWS / GCP / Azure

Build Docker image and push to container registry, then deploy to:
- **AWS**: ECS / Fargate
- **GCP**: Cloud Run
- **Azure**: Container Instances

## Performance Metrics

- **Startup Time**: ~3-5 seconds
- **Memory Usage**: ~200-300 MB
- **Requests/sec**: ~1000+ (with proper hardware)
- **Response Time**: <100ms for analytics endpoints

## Troubleshooting

### Port 8081 Already in Use

```bash
# Find process using port 8081
lsof -i :8081

# Kill the process
kill -9 <PID>
```

### Build Fails

```bash
# Clean and rebuild
mvn clean install -U

# Skip tests
mvn clean install -DskipTests
```

### CORS Issues

Ensure `application.properties` has correct frontend URL:

```properties
# Update allowed origins in FinoraAnalyticsApplication.java
configuration.setAllowedOrigins(Arrays.asList(
    "https://finora-six.vercel.app",
    "http://localhost:3000"
));
```

## Contributing

1. Create feature branch: `git checkout -b feature/analytics-feature`
2. Make changes
3. Test locally: `mvn test`
4. Commit: `git commit -m "Add analytics feature"`
5. Push: `git push origin feature/analytics-feature`

## License

Same as Finora main project.

## Support

For issues or questions:
- GitHub Issues: [Finora Repository](https://github.com/Nithyon/Finora/issues)
- Documentation: See parent project README.md
