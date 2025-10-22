# Java Integration in Finora - Without Disrupting Current Workflow

## Current Architecture
```
Frontend: Next.js 14 (React/TypeScript)
    ↓
Backend: FastAPI (Python)
    ↓
Database: SQLite
```

---

## Option 1: Replace Backend with Java Spring Boot (Clean Replacement)
**Difficulty**: Medium | **Time**: 2-3 hours | **Risk**: Low if done carefully

### Step 1: Create New Java Backend Service
Keep FastAPI running, create **separate** Java microservice:

```
Project Structure:
finora/
├── frontend/              (Next.js - NO CHANGES)
├── backend/               (FastAPI - NO CHANGES - can keep running)
├── backend-java/          (NEW Spring Boot service)
│   ├── src/
│   │   ├── main/java/
│   │   │   └── com/finora/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── model/
│   │   │       ├── repository/
│   │   │       └── FinoraApplication.java
│   │   └── resources/
│   │       └── application.properties
│   ├── pom.xml
│   └── Dockerfile
└── docker-compose.yml     (updated to run both)
```

### Step 2: Create Java Spring Boot Backend

**File: `backend-java/pom.xml`**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.finora</groupId>
    <artifactId>finora-api</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <name>Finora Budget API</name>
    <description>Java Spring Boot Backend for Finora</description>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.5</version>
        <relativePath/>
    </parent>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <!-- SQLite -->
        <dependency>
            <groupId>org.xerial</groupId>
            <artifactId>sqlite-jdbc</artifactId>
            <version>3.44.0.0</version>
        </dependency>
        
        <!-- Lombok for cleaner code -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### Step 3: Create Java Models (Same as Python)

**File: `backend-java/src/main/java/com/finora/model/Transaction.java`**
```java
package com.finora.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "account_id")
    private Long accountId;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Column(name = "transaction_type")
    private String transactionType; // "income" or "expense"
    
    @Column(nullable = false)
    private String category;
    
    @Column
    private String description;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

**File: `backend-java/src/main/java/com/finora/model/Budget.java`**
```java
package com.finora.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Column
    private String period; // "monthly", "yearly"
    
    @Column
    private BigDecimal spent = BigDecimal.ZERO;
    
    @Column
    private BigDecimal remaining;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

### Step 4: Create Java Repositories (JPA)

**File: `backend-java/src/main/java/com/finora/repository/TransactionRepository.java`**
```java
package com.finora.repository;

import com.finora.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);
    
    List<Transaction> findByUserIdAndCategory(Long userId, String category);
    
    List<Transaction> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    
    List<Transaction> findByUserIdAndTransactionType(Long userId, String type);
}
```

**File: `backend-java/src/main/java/com/finora/repository/BudgetRepository.java`**
```java
package com.finora.repository;

import com.finora.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserId(Long userId);
    
    Optional<Budget> findByUserIdAndCategory(Long userId, String category);
    
    List<Budget> findByUserIdAndPeriod(Long userId, String period);
}
```

### Step 5: Create Java Controllers (REST API)

**File: `backend-java/src/main/java/com/finora/controller/TransactionController.java`**
```java
package com.finora.controller;

import com.finora.model.Transaction;
import com.finora.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        Transaction created = transactionService.createTransaction(transaction);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransaction(@PathVariable Long id) {
        return transactionService.getTransaction(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(
            @RequestParam Long userId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        List<Transaction> transactions = transactionService.getTransactions(userId, category, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction transaction) {
        Transaction updated = transactionService.updateTransaction(id, transaction);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
```

**File: `backend-java/src/main/java/com/finora/controller/BudgetController.java`**
```java
package com.finora.controller;

import com.finora.model.Budget;
import com.finora.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
public class BudgetController {
    
    @Autowired
    private BudgetService budgetService;
    
    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody Budget budget) {
        Budget created = budgetService.createBudget(budget);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<Budget>> getBudgets(
            @RequestParam Long userId,
            @RequestParam(required = false) String period) {
        List<Budget> budgets = budgetService.getBudgets(userId, period);
        return ResponseEntity.ok(budgets);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable Long id,
            @RequestBody Budget budget) {
        Budget updated = budgetService.updateBudget(id, budget);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Step 6: Create Java Services

**File: `backend-java/src/main/java/com/finora/service/TransactionService.java`**
```java
package com.finora.service;

import com.finora.model.Transaction;
import com.finora.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public Transaction createTransaction(Transaction transaction) {
        // Validation
        if (transaction.getAmount() == null || transaction.getAmount().signum() <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        
        if (transaction.getCategory() == null || transaction.getCategory().isEmpty()) {
            throw new IllegalArgumentException("Category is required");
        }
        
        transaction.setCreatedAt(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }
    
    public Optional<Transaction> getTransaction(Long id) {
        return transactionRepository.findById(id);
    }
    
    public List<Transaction> getTransactions(Long userId, String category, LocalDate startDate, LocalDate endDate) {
        if (category != null && startDate != null && endDate != null) {
            return transactionRepository.findByUserIdAndCategory(userId, category);
        } else if (startDate != null && endDate != null) {
            return transactionRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        } else if (category != null) {
            return transactionRepository.findByUserIdAndCategory(userId, category);
        }
        return transactionRepository.findByUserId(userId);
    }
    
    public Transaction updateTransaction(Long id, Transaction transaction) {
        Transaction existing = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (transaction.getAmount() != null) {
            existing.setAmount(transaction.getAmount());
        }
        if (transaction.getCategory() != null) {
            existing.setCategory(transaction.getCategory());
        }
        if (transaction.getDescription() != null) {
            existing.setDescription(transaction.getDescription());
        }
        
        return transactionRepository.save(existing);
    }
    
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
```

**File: `backend-java/src/main/java/com/finora/service/BudgetService.java`**
```java
package com.finora.service;

import com.finora.model.Budget;
import com.finora.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BudgetService {
    
    @Autowired
    private BudgetRepository budgetRepository;
    
    public Budget createBudget(Budget budget) {
        if (budget.getAmount() == null || budget.getAmount().signum() <= 0) {
            throw new IllegalArgumentException("Budget amount must be positive");
        }
        
        if (budget.getPeriod() == null) {
            budget.setPeriod("monthly");
        }
        
        return budgetRepository.save(budget);
    }
    
    public List<Budget> getBudgets(Long userId, String period) {
        if (period != null) {
            return budgetRepository.findByUserIdAndPeriod(userId, period);
        }
        return budgetRepository.findByUserId(userId);
    }
    
    public Budget updateBudget(Long id, Budget budget) {
        Budget existing = budgetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (budget.getAmount() != null) {
            existing.setAmount(budget.getAmount());
        }
        if (budget.getSpent() != null) {
            existing.setSpent(budget.getSpent());
        }
        
        return budgetRepository.save(existing);
    }
    
    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
}
```

### Step 7: Create Application Properties

**File: `backend-java/src/main/resources/application.properties`**
```properties
# Spring Boot Application
spring.application.name=finora-api
server.port=8001

# SQLite Database Configuration
spring.datasource.url=jdbc:sqlite:./finora.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Logging
logging.level.root=INFO
logging.level.com.finora=DEBUG

# CORS Configuration
server.servlet.context-path=/api
```

### Step 8: Create Main Application Class

**File: `backend-java/src/main/java/com/finora/FinoraApplication.java`**
```java
package com.finora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class FinoraApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(FinoraApplication.class, args);
    }
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("*")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*");
            }
        };
    }
}
```

### Step 9: Create Dockerfile for Java Backend

**File: `backend-java/Dockerfile`**
```dockerfile
# Stage 1: Build
FROM maven:3.8.1-openjdk-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ ./src/
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/finora-api-1.0.0.jar app.jar
EXPOSE 8001
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Step 10: Update docker-compose.yml

**File: `docker-compose.yml`**
```yaml
version: '3.8'

services:
  # Python FastAPI (Original)
  backend-python:
    build:
      context: .
      dockerfile: backend/Dockerfile
    container_name: finora-backend-python
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./finora.db
    volumes:
      - ./backend:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000

  # Java Spring Boot (New)
  backend-java:
    build:
      context: ./backend-java
      dockerfile: Dockerfile
    container_name: finora-backend-java
    ports:
      - "8001:8001"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:sqlite:./finora.db
    volumes:
      - ./backend-java:/app
    depends_on:
      - backend-python

  # Frontend (No changes)
  frontend:
    image: node:18-alpine
    container_name: finora-frontend
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    working_dir: /app
    command: npm run dev
```

---

## Option 2: Add Java Microservice for Advanced Features (Recommended!)
**Difficulty**: Easy | **Time**: 1-2 hours | **Risk**: Zero

Create a **separate Java service** for specific features:

### Use Cases for Java Microservice:
1. **Advanced Analytics** - Heavy computations
2. **Report Generation** - PDF, Excel exports
3. **Batch Processing** - Monthly analysis
4. **Machine Learning** - Spending predictions
5. **Email Notifications** - Background tasks

### Architecture:
```
Frontend (Next.js) → FastAPI (Main) → Java Service (Specialized)
                                   ↓
                                SQLite
```

**Example: Java Microservice for Advanced Analytics**

```java
@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @GetMapping("/monthly-summary/{userId}")
    public ResponseEntity<Map<String, Object>> getMonthlySummary(@PathVariable Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        
        Map<String, Object> summary = new HashMap<>();
        
        // Calculate totals
        BigDecimal totalIncome = transactions.stream()
            .filter(t -> "income".equals(t.getTransactionType()))
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalExpense = transactions.stream()
            .filter(t -> "expense".equals(t.getTransactionType()))
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("netIncome", totalIncome.subtract(totalExpense));
        
        // Category breakdown
        Map<String, BigDecimal> byCategory = transactions.stream()
            .filter(t -> "expense".equals(t.getTransactionType()))
            .collect(Collectors.groupingBy(
                Transaction::getCategory,
                Collectors.mapping(
                    Transaction::getAmount,
                    Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                )
            ));
        
        summary.put("byCategory", byCategory);
        
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/spending-forecast/{userId}")
    public ResponseEntity<Map<String, Object>> getSpendingForecast(@PathVariable Long userId) {
        // Advanced ML predictions here
        Map<String, Object> forecast = new HashMap<>();
        
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        
        // Calculate average spending per category
        Map<String, Double> averageSpending = transactions.stream()
            .filter(t -> "expense".equals(t.getTransactionType()))
            .collect(Collectors.groupingBy(
                Transaction::getCategory,
                Collectors.averagingDouble(t -> t.getAmount().doubleValue())
            ));
        
        forecast.put("predictedMonthlySpending", averageSpending);
        forecast.put("recommendation", "Based on your spending patterns...");
        
        return ResponseEntity.ok(forecast);
    }
}
```

---

## Option 3: Migrate Gradually (Hybrid Approach)
**Difficulty**: Easy | **Time**: 4-5 hours | **Risk**: Low

**Phase 1 (Week 1)**: Keep FastAPI, add Java for new features
**Phase 2 (Week 2)**: Migrate Users & Accounts to Java
**Phase 3 (Week 3)**: Migrate Transactions & Budgets to Java
**Phase 4 (Week 4)**: Retire FastAPI, Java fully operational

---

## How to Start (Step-by-Step)

### 1. Install Java & Maven
```bash
# Download from java.oracle.com
# Download Maven from maven.apache.org

# Verify installation
java -version
mvn -version
```

### 2. Create Java Project
```bash
# In project root
mkdir backend-java
cd backend-java

# Create Maven project structure
mvn archetype:generate \
  -DgroupId=com.finora \
  -DartifactId=finora-api \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false
```

### 3. Copy pom.xml Content
Use the pom.xml content from above

### 4. Create Package Structure
```bash
mkdir -p src/main/java/com/finora/{model,repository,service,controller}
mkdir -p src/main/resources
```

### 5. Add Code Files
Create Transaction.java, Budget.java, etc. as shown above

### 6. Build Project
```bash
mvn clean package
```

### 7. Run Locally
```bash
mvn spring-boot:run
```

### 8. Test API
```bash
curl -X POST http://localhost:8001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "amount": 500,
    "category": "Food",
    "transactionType": "expense"
  }'
```

---

## Switching Frontend to Java Backend

### Option A: Run Both in Parallel
```bash
# Terminal 1: Keep FastAPI running
python backend/main.py

# Terminal 2: Run Java backend on different port
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8001"

# Terminal 3: Frontend connects to either
# Update env variable to point to Java backend when ready
```

### Option B: Switch in .env
**File: `.env.local`**
```
# Use Python backend
NEXT_PUBLIC_API_URL=https://nithiyon-finora-backend.hf.space

# OR Switch to Java (when ready)
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Option C: Reverse Proxy (Keep Everything Working)
Use Kong or nginx to route requests:
- `/api/transactions` → Java service
- `/api/budgets` → Java service  
- `/api/users` → FastAPI (still)
- `/api/chat` → FastAPI (still)

---

## Why Java Makes Sense Here

✅ **Type Safety** - Like TypeScript, Java has strong typing
✅ **Performance** - Faster for complex calculations
✅ **Scalability** - Spring Boot handles high traffic
✅ **Enterprise-Ready** - Professional features
✅ **Easy Migration** - Same models & database
✅ **No Breaking Changes** - Coexists with FastAPI
✅ **Learning Experience** - Backend diversity for PBL II

---

## Estimated Impact

| Aspect | Impact |
|--------|--------|
| Frontend Code | ❌ Zero changes needed |
| FastAPI Backend | ❌ Can keep running |
| Current Database | ❌ No changes |
| Deployment | ✅ Docker handles both |
| Development | ✅ Learn Java/Spring Boot |
| Performance | ✅ Potentially faster |
| Learning Value | ✅ Multi-language backend |

---

## Summary

You can integrate Java in **3 ways**:

1. **Replace FastAPI** - Full Java backend (1-2 days)
2. **Microservice** - Java for specific features (1-2 hours)
3. **Hybrid** - Gradually migrate (1 week)

**All without touching your working frontend!** ✅

Would you like me to help you with any of these approaches?
