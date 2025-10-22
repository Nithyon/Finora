package com.finora.analytics.controller;

import com.finora.analytics.model.CategoryBreakdown;
import com.finora.analytics.model.MonthlySummary;
import com.finora.analytics.model.SpendingForecast;
import com.finora.analytics.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Analytics REST Controller
 * Exposes endpoints for advanced financial analytics
 * All endpoints require user_id for security
 * Base URL: /api/analytics
 */
@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {"https://finora-six.vercel.app", "http://localhost:3000", "*"})
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * GET /api/analytics/health
     * Health check endpoint
     * @return Service status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "up");
        response.put("service", "finora-analytics-microservice");
        response.put("port", "8081");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/analytics/monthly-summary/{userId}
     * Get monthly financial summary for a user
     * 
     * @param userId User ID
     * @param month Month (1-12)
     * @param year Year (YYYY)
     * @return Monthly summary with income, expense, breakdown by category
     */
    @GetMapping("/monthly-summary/{userId}")
    public ResponseEntity<MonthlySummary> getMonthlySummary(
        @PathVariable Long userId,
        @RequestParam(defaultValue = "10") String month,
        @RequestParam(defaultValue = "2025") String year
    ) {
        MonthlySummary summary = analyticsService.getMonthlySummary(userId, month, year);
        return ResponseEntity.ok(summary);
    }

    /**
     * GET /api/analytics/spending-forecast/{userId}
     * Get AI-powered spending forecast based on historical data
     * Predicts future spending patterns
     * 
     * @param userId User ID
     * @return Spending forecast with predictions and recommendations
     */
    @GetMapping("/spending-forecast/{userId}")
    public ResponseEntity<SpendingForecast> getSpendingForecast(@PathVariable Long userId) {
        SpendingForecast forecast = analyticsService.getSpendingForecast(userId);
        return ResponseEntity.ok(forecast);
    }

    /**
     * GET /api/analytics/category-breakdown/{userId}
     * Get detailed breakdown of spending by category
     * Shows trends and recent transactions per category
     * 
     * @param userId User ID
     * @param month Month (1-12)
     * @param year Year (YYYY)
     * @return List of categories with amounts and trends
     */
    @GetMapping("/category-breakdown/{userId}")
    public ResponseEntity<List<CategoryBreakdown>> getCategoryBreakdown(
        @PathVariable Long userId,
        @RequestParam(defaultValue = "10") String month,
        @RequestParam(defaultValue = "2025") String year
    ) {
        List<CategoryBreakdown> breakdown = analyticsService.getCategoryBreakdown(userId, month, year);
        return ResponseEntity.ok(breakdown);
    }

    /**
     * GET /api/analytics/insights/{userId}
     * Get personalized spending insights and recommendations
     * Analyzes patterns and provides AI-powered advice
     * 
     * @param userId User ID
     * @return Spending insights and recommendations
     */
    @GetMapping("/insights/{userId}")
    public ResponseEntity<Map<String, Object>> getSpendingInsights(@PathVariable Long userId) {
        Map<String, Object> insights = analyticsService.getSpendingInsights(userId);
        return ResponseEntity.ok(insights);
    }

    /**
     * GET /api/analytics/comparison/{userId}
     * Compare current month vs previous month spending
     * 
     * @param userId User ID
     * @return Comparison data with percentage changes
     */
    @GetMapping("/comparison/{userId}")
    public ResponseEntity<Map<String, Object>> getMonthlyComparison(@PathVariable Long userId) {
        Map<String, Object> comparison = new HashMap<>();
        
        // Get current month summary
        MonthlySummary currentMonth = analyticsService.getMonthlySummary(userId, "10", "2025");
        
        // Get previous month summary
        MonthlySummary previousMonth = analyticsService.getMonthlySummary(userId, "9", "2025");
        
        comparison.put("currentMonth", currentMonth);
        comparison.put("previousMonth", previousMonth);
        
        // Calculate percentage changes
        double expenseChange = 0;
        if (previousMonth.getTotalExpense().doubleValue() > 0) {
            expenseChange = ((currentMonth.getTotalExpense().doubleValue() - 
                            previousMonth.getTotalExpense().doubleValue()) / 
                            previousMonth.getTotalExpense().doubleValue()) * 100;
        }
        
        comparison.put("expenseChangePercent", expenseChange);
        comparison.put("trend", expenseChange > 0 ? "increasing" : "decreasing");
        
        return ResponseEntity.ok(comparison);
    }

    /**
     * GET /api/analytics/budget-tracking/{userId}
     * Track spending against budget limits
     * 
     * @param userId User ID
     * @return Budget vs actual spending
     */
    @GetMapping("/budget-tracking/{userId}")
    public ResponseEntity<Map<String, Object>> getBudgetTracking(@PathVariable Long userId) {
        Map<String, Object> tracking = new HashMap<>();
        
        MonthlySummary summary = analyticsService.getMonthlySummary(userId, "10", "2025");
        
        // Default budget (would come from user settings in real implementation)
        double budgetLimit = 50000; // ₹50,000
        double currentSpending = summary.getTotalExpense().doubleValue();
        double remaining = budgetLimit - currentSpending;
        double percentageUsed = (currentSpending / budgetLimit) * 100;
        
        tracking.put("budgetLimit", budgetLimit);
        tracking.put("currentSpending", currentSpending);
        tracking.put("remaining", remaining);
        tracking.put("percentageUsed", percentageUsed);
        tracking.put("status", percentageUsed > 100 ? "exceeded" : 
                               percentageUsed > 80 ? "warning" : "healthy");
        
        return ResponseEntity.ok(tracking);
    }

    /**
     * Error handling endpoint
     */
    @GetMapping("/**")
    public ResponseEntity<Map<String, String>> notFound() {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Endpoint not found");
        error.put("hint", "Available endpoints: /health, /monthly-summary, /spending-forecast, /category-breakdown, /insights, /comparison, /budget-tracking");
        return ResponseEntity.status(404).body(error);
    }
}
