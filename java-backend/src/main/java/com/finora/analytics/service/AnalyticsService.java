package com.finora.analytics.service;

import com.finora.analytics.model.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Advanced analytics service for financial data analysis
 */
@Service
public class AnalyticsService {

    /**
     * Calculate monthly summary for a given month
     */
    public MonthlySummary getMonthlySummary(List<TransactionDTO> transactions, String month) {
        YearMonth yearMonth = YearMonth.parse(month);
        
        List<TransactionDTO> monthTransactions = transactions.stream()
                .filter(t -> YearMonth.from(t.getDate()).equals(yearMonth))
                .collect(Collectors.toList());

        Double totalIncome = monthTransactions.stream()
                .filter(t -> "income".equals(t.getType()))
                .mapToDouble(TransactionDTO::getAmount)
                .sum();

        Double totalExpense = monthTransactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .mapToDouble(TransactionDTO::getAmount)
                .sum();

        Double netSavings = totalIncome - totalExpense;
        Double savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

        // Category breakdown
        List<CategoryBreakdown> categoryBreakdown = getCategoryBreakdown(monthTransactions, totalExpense);

        // Largest expense
        var largestExpenseOptional = monthTransactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .max(Comparator.comparingDouble(TransactionDTO::getAmount));

        String largestExpenseCategory = largestExpenseOptional.map(TransactionDTO::getCategory).orElse("N/A");
        Double largestExpense = largestExpenseOptional.map(TransactionDTO::getAmount).orElse(0.0);

        return new MonthlySummary(
                month,
                totalIncome,
                totalExpense,
                netSavings,
                savingsRate,
                categoryBreakdown,
                largestExpense,
                largestExpenseCategory,
                monthTransactions.size()
        );
    }

    /**
     * Get category breakdown
     */
    private List<CategoryBreakdown> getCategoryBreakdown(List<TransactionDTO> transactions, Double totalExpense) {
        return transactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .collect(Collectors.groupingBy(
                        TransactionDTO::getCategory,
                        Collectors.summingDouble(TransactionDTO::getAmount)
                ))
                .entrySet().stream()
                .map(entry -> {
                    Double percentage = totalExpense > 0 ? (entry.getValue() / totalExpense) * 100 : 0;
                    long count = transactions.stream()
                            .filter(t -> "expense".equals(t.getType()) && entry.getKey().equals(t.getCategory()))
                            .count();
                    
                    return new CategoryBreakdown(
                            entry.getKey(),
                            entry.getValue(),
                            percentage,
                            getCategoryEmoji(entry.getKey()),
                            getCategoryColor(entry.getKey()),
                            (int) count
                    );
                })
                .sorted(Comparator.comparingDouble(CategoryBreakdown::getAmount).reversed())
                .collect(Collectors.toList());
    }

    /**
     * Get spending forecast for next month
     */
    public SpendingForecast getSpendingForecast(List<TransactionDTO> transactions, String currentMonth) {
        YearMonth currentYearMonth = YearMonth.parse(currentMonth);
        
        // Get last 3 months of data
        List<TransactionDTO> recentTransactions = transactions.stream()
                .filter(t -> {
                    YearMonth txnMonth = YearMonth.from(t.getDate());
                    return txnMonth.isAfter(currentYearMonth.minusMonths(3)) && 
                           txnMonth.isBefore(currentYearMonth.plusMonths(1));
                })
                .collect(Collectors.toList());

        YearMonth nextMonth = currentYearMonth.plusMonths(1);
        
        // Calculate averages
        Double avgIncome = calculateAverageIncome(recentTransactions);
        Double avgExpense = calculateAverageExpense(recentTransactions);
        Double avgSavings = avgIncome - avgExpense;

        // Category forecasts
        Map<String, Double> categoryForecasts = forecastCategorySpending(recentTransactions);

        // Generate insights
        List<String> insights = generateInsights(recentTransactions);
        String recommendation = generateRecommendation(avgIncome, avgExpense, categoryForecasts);

        return new SpendingForecast(
                nextMonth.toString(),
                avgIncome,
                avgExpense,
                avgSavings,
                categoryForecasts,
                0.85, // confidence level
                insights,
                recommendation
        );
    }

    /**
     * Calculate average monthly income
     */
    private Double calculateAverageIncome(List<TransactionDTO> transactions) {
        Set<String> months = transactions.stream()
                .map(t -> YearMonth.from(t.getDate()).toString())
                .collect(Collectors.toSet());

        if (months.isEmpty()) return 0.0;

        Double totalIncome = transactions.stream()
                .filter(t -> "income".equals(t.getType()))
                .mapToDouble(TransactionDTO::getAmount)
                .sum();

        return totalIncome / months.size();
    }

    /**
     * Calculate average monthly expense
     */
    private Double calculateAverageExpense(List<TransactionDTO> transactions) {
        Set<String> months = transactions.stream()
                .map(t -> YearMonth.from(t.getDate()).toString())
                .collect(Collectors.toSet());

        if (months.isEmpty()) return 0.0;

        Double totalExpense = transactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .mapToDouble(TransactionDTO::getAmount)
                .sum();

        return totalExpense / months.size();
    }

    /**
     * Forecast spending by category
     */
    private Map<String, Double> forecastCategorySpending(List<TransactionDTO> transactions) {
        return transactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .collect(Collectors.groupingBy(
                        TransactionDTO::getCategory,
                        Collectors.averagingDouble(TransactionDTO::getAmount)
                ))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> Math.round(e.getValue() * 100.0) / 100.0
                ));
    }

    /**
     * Generate financial insights
     */
    private List<String> generateInsights(List<TransactionDTO> transactions) {
        List<String> insights = new ArrayList<>();

        Double totalExpense = transactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .mapToDouble(TransactionDTO::getAmount)
                .sum();

        Double avgTransaction = transactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .mapToDouble(TransactionDTO::getAmount)
                .average()
                .orElse(0.0);

        if (avgTransaction < 50) {
            insights.add("Many small transactions detected - consider consolidating purchases");
        }

        // Find top spending category
        var topCategory = transactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .collect(Collectors.groupingBy(
                        TransactionDTO::getCategory,
                        Collectors.summingDouble(TransactionDTO::getAmount)
                ))
                .entrySet().stream()
                .max(Comparator.comparingDouble(Map.Entry::getValue));

        if (topCategory.isPresent()) {
            insights.add("Top spending category: " + topCategory.get().getKey());
        }

        insights.add("Transactions analyzed: " + transactions.size());
        return insights;
    }

    /**
     * Generate personalized recommendation
     */
    private String generateRecommendation(Double income, Double expense, Map<String, Double> forecasts) {
        if (expense > income) {
            return "You're spending more than you earn. Review your expenses and create a budget.";
        } else if (income - expense < income * 0.2) {
            return "Consider reducing discretionary spending to improve savings rate.";
        } else {
            return "Good savings rate! Consider investing the surplus for future growth.";
        }
    }

    /**
     * Get category emoji
     */
    private String getCategoryEmoji(String category) {
        Map<String, String> emojiMap = Map.ofEntries(
                Map.entry("Groceries", "🛒"),
                Map.entry("Entertainment", "🎬"),
                Map.entry("Transport", "🚗"),
                Map.entry("Utilities", "⚡"),
                Map.entry("Dining", "🍽️"),
                Map.entry("Shopping", "🛍️"),
                Map.entry("Gas", "⛽")
        );
        return emojiMap.getOrDefault(category, "💰");
    }

    /**
     * Get category color
     */
    private String getCategoryColor(String category) {
        Map<String, String> colorMap = Map.ofEntries(
                Map.entry("Groceries", "#3b82f6"),
                Map.entry("Entertainment", "#ec4899"),
                Map.entry("Transport", "#f59e0b"),
                Map.entry("Utilities", "#8b5cf6"),
                Map.entry("Dining", "#14b8a6"),
                Map.entry("Shopping", "#f97316"),
                Map.entry("Gas", "#ef4444")
        );
        return colorMap.getOrDefault(category, "#6b7280");
    }
}
