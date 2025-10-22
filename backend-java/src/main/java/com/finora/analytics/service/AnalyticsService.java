package com.finora.analytics.service;

import com.finora.analytics.model.CategoryBreakdown;
import com.finora.analytics.model.MonthlySummary;
import com.finora.analytics.model.SpendingForecast;
import com.finora.analytics.model.TransactionDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Analytics Service - Core business logic for financial analytics
 * Communicates with FastAPI backend for transaction data
 */
@Service
public class AnalyticsService {

    @Value("${finora.api.url:https://nithiyon-finora-backend.hf.space}")
    private String finoraApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Get monthly summary for a specific user
     * Aggregates all transactions for income, expense, and net calculations
     */
    public MonthlySummary getMonthlySummary(Long userId, String month, String year) {
        try {
            // Fetch transactions from FastAPI backend
            List<TransactionDTO> transactions = fetchUserTransactions(userId);

            // Filter by month/year
            YearMonth targetMonth = YearMonth.of(Integer.parseInt(year), Integer.parseInt(month));
            List<TransactionDTO> monthlyTransactions = transactions.stream()
                .filter(t -> YearMonth.from(t.getDate()).equals(targetMonth))
                .collect(Collectors.toList());

            // Calculate totals
            BigDecimal totalIncome = monthlyTransactions.stream()
                .filter(t -> "income".equalsIgnoreCase(t.getTransactionType()))
                .map(TransactionDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalExpense = monthlyTransactions.stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getTransactionType()))
                .map(TransactionDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal netIncome = totalIncome.subtract(totalExpense);

            // Category breakdown
            Map<String, BigDecimal> byCategory = monthlyTransactions.stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getTransactionType()))
                .collect(Collectors.groupingBy(
                    TransactionDTO::getCategory,
                    Collectors.mapping(
                        TransactionDTO::getAmount,
                        Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                    )
                ));

            return MonthlySummary.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netIncome(netIncome)
                .byCategory(byCategory)
                .transactionCount(monthlyTransactions.size())
                .month(month)
                .year(year)
                .build();

        } catch (Exception e) {
            return MonthlySummary.builder()
                .totalIncome(BigDecimal.ZERO)
                .totalExpense(BigDecimal.ZERO)
                .netIncome(BigDecimal.ZERO)
                .byCategory(new HashMap<>())
                .transactionCount(0)
                .month(month)
                .year(year)
                .build();
        }
    }

    /**
     * Get spending forecast based on historical data
     * Predicts future spending patterns using averages
     */
    public SpendingForecast getSpendingForecast(Long userId) {
        try {
            List<TransactionDTO> transactions = fetchUserTransactions(userId);

            // Calculate average spending per category
            Map<String, Double> averageSpending = transactions.stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getTransactionType()))
                .collect(Collectors.groupingBy(
                    TransactionDTO::getCategory,
                    Collectors.averagingDouble(t -> t.getAmount().doubleValue())
                ));

            // Calculate average monthly expense
            double totalExpense = transactions.stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getTransactionType()))
                .mapToDouble(t -> t.getAmount().doubleValue())
                .sum();

            double averageMonthly = totalExpense / Math.max(1, transactions.size() / 30);

            // Generate recommendation
            String recommendation = generateRecommendation(averageSpending);

            // Analyze trends
            Map<String, Object> trends = analyzeTrends(transactions);

            return SpendingForecast.builder()
                .predictedMonthlySpending(averageSpending)
                .averageMonthlyExpense(averageMonthly)
                .recommendation(recommendation)
                .trends(trends)
                .build();

        } catch (Exception e) {
            return SpendingForecast.builder()
                .predictedMonthlySpending(new HashMap<>())
                .averageMonthlyExpense(0.0)
                .recommendation("Unable to generate forecast at this time")
                .trends(new HashMap<>())
                .build();
        }
    }

    /**
     * Get detailed category breakdown with trends
     */
    public List<CategoryBreakdown> getCategoryBreakdown(Long userId, String month, String year) {
        try {
            List<TransactionDTO> transactions = fetchUserTransactions(userId);

            YearMonth targetMonth = YearMonth.of(Integer.parseInt(year), Integer.parseInt(month));
            List<TransactionDTO> monthlyTransactions = transactions.stream()
                .filter(t -> YearMonth.from(t.getDate()).equals(targetMonth) && 
                           "expense".equalsIgnoreCase(t.getTransactionType()))
                .collect(Collectors.toList());

            double totalExpense = monthlyTransactions.stream()
                .mapToDouble(t -> t.getAmount().doubleValue())
                .sum();

            return monthlyTransactions.stream()
                .collect(Collectors.groupingBy(TransactionDTO::getCategory))
                .entrySet().stream()
                .map(entry -> {
                    String category = entry.getKey();
                    List<TransactionDTO> categoryTransactions = entry.getValue();
                    
                    double categoryTotal = categoryTransactions.stream()
                        .mapToDouble(t -> t.getAmount().doubleValue())
                        .sum();

                    double percentage = totalExpense > 0 ? (categoryTotal / totalExpense) * 100 : 0;

                    return CategoryBreakdown.builder()
                        .category(category)
                        .totalAmount(categoryTotal)
                        .percentage(percentage)
                        .transactionCount(categoryTransactions.size())
                        .trend(calculateCategoryTrend(categoryTransactions))
                        .recentTransactions(
                            categoryTransactions.stream()
                                .sorted(Comparator.comparing(TransactionDTO::getDate).reversed())
                                .limit(5)
                                .map(TransactionDTO::getDescription)
                                .collect(Collectors.toList())
                        )
                        .build();
                })
                .sorted(Comparator.comparingDouble(CategoryBreakdown::getTotalAmount).reversed())
                .collect(Collectors.toList());

        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    /**
     * Helper: Fetch user transactions from FastAPI backend
     */
    private List<TransactionDTO> fetchUserTransactions(Long userId) {
        // TODO: Replace with actual FastAPI call
        // This would typically call: GET /api/transactions?user_id={userId}
        return new ArrayList<>();
    }

    /**
     * Helper: Generate personalized spending recommendation
     */
    private String generateRecommendation(Map<String, Double> categorySpending) {
        double maxCategory = categorySpending.values().stream()
            .max(Double::compareTo)
            .orElse(0.0);

        return String.format(
            "Your highest spending category is at ₹%.2f. Consider setting a budget limit to manage expenses better.",
            maxCategory
        );
    }

    /**
     * Helper: Analyze spending trends (increasing, decreasing, stable)
     */
    private Map<String, Object> analyzeTrends(List<TransactionDTO> transactions) {
        Map<String, Object> trends = new HashMap<>();
        
        // Calculate week-over-week trend
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneWeekAgo = now.minusWeeks(1);
        LocalDateTime twoWeeksAgo = now.minusWeeks(2);

        double currentWeek = transactions.stream()
            .filter(t -> t.getDate().isAfter(oneWeekAgo))
            .mapToDouble(t -> t.getAmount().doubleValue())
            .sum();

        double previousWeek = transactions.stream()
            .filter(t -> t.getDate().isAfter(twoWeeksAgo) && t.getDate().isBefore(oneWeekAgo))
            .mapToDouble(t -> t.getAmount().doubleValue())
            .sum();

        String weekTrend = currentWeek > previousWeek ? "increasing" : 
                          currentWeek < previousWeek ? "decreasing" : "stable";
        
        trends.put("weeklyTrend", weekTrend);
        trends.put("currentWeekSpending", currentWeek);
        trends.put("previousWeekSpending", previousWeek);
        
        return trends;
    }

    /**
     * Helper: Calculate trend for a specific category
     */
    private String calculateCategoryTrend(List<TransactionDTO> categoryTransactions) {
        if (categoryTransactions.size() < 2) return "stable";

        List<TransactionDTO> sorted = categoryTransactions.stream()
            .sorted(Comparator.comparing(TransactionDTO::getDate))
            .collect(Collectors.toList());

        int midpoint = sorted.size() / 2;
        
        double firstHalf = sorted.stream()
            .limit(midpoint)
            .mapToDouble(t -> t.getAmount().doubleValue())
            .average()
            .orElse(0.0);

        double secondHalf = sorted.stream()
            .skip(midpoint)
            .mapToDouble(t -> t.getAmount().doubleValue())
            .average()
            .orElse(0.0);

        return secondHalf > firstHalf * 1.1 ? "increasing" : 
               secondHalf < firstHalf * 0.9 ? "decreasing" : "stable";
    }

    /**
     * Get spending insights - AI-powered financial advice
     */
    public Map<String, Object> getSpendingInsights(Long userId) {
        Map<String, Object> insights = new HashMap<>();
        
        try {
            List<TransactionDTO> transactions = fetchUserTransactions(userId);
            
            insights.put("message", "Analyzing your spending patterns...");
            insights.put("totalTransactions", transactions.size());
            
            // Find highest spending day
            LocalDateTime highestDay = transactions.stream()
                .max(Comparator.comparingDouble(t -> t.getAmount().doubleValue()))
                .map(TransactionDTO::getDate)
                .orElse(LocalDateTime.now());
            
            insights.put("highestSpendingDay", highestDay);
            insights.put("status", "success");
            
        } catch (Exception e) {
            insights.put("message", "Unable to generate insights");
            insights.put("status", "error");
        }
        
        return insights;
    }
}
