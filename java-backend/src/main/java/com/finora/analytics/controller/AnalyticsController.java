package com.finora.analytics.controller;

import com.finora.analytics.model.*;
import com.finora.analytics.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for analytics endpoints
 * Provides APIs for financial analysis and reporting
 */
@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {"http://localhost:3000", "https://finora-six.vercel.app"})
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * Get monthly summary
     * GET /api/analytics/monthly-summary?month=2025-10
     */
    @GetMapping("/monthly-summary")
    public ResponseEntity<MonthlySummary> getMonthlySummary(
            @RequestParam String month,
            @RequestBody List<TransactionDTO> transactions) {
        MonthlySummary summary = analyticsService.getMonthlySummary(transactions, month);
        return ResponseEntity.ok(summary);
    }

    /**
     * Get spending forecast
     * POST /api/analytics/forecast?month=2025-10
     */
    @PostMapping("/forecast")
    public ResponseEntity<SpendingForecast> getSpendingForecast(
            @RequestParam String month,
            @RequestBody List<TransactionDTO> transactions) {
        SpendingForecast forecast = analyticsService.getSpendingForecast(transactions, month);
        return ResponseEntity.ok(forecast);
    }

    /**
     * Get category breakdown
     * POST /api/analytics/category-breakdown?month=2025-10
     */
    @PostMapping("/category-breakdown")
    public ResponseEntity<Map<String, Object>> getCategoryBreakdown(
            @RequestParam String month,
            @RequestBody List<TransactionDTO> transactions) {
        MonthlySummary summary = analyticsService.getMonthlySummary(transactions, month);
        return ResponseEntity.ok(Map.of(
                "month", summary.getMonth(),
                "categories", summary.getCategoryBreakdown(),
                "totalExpense", summary.getTotalExpense()
        ));
    }

    /**
     * Health check endpoint
     * GET /api/analytics/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Finora Analytics",
                "version", "1.0.0"
        ));
    }

    /**
     * Get insights
     * POST /api/analytics/insights
     */
    @PostMapping("/insights")
    public ResponseEntity<Map<String, Object>> getInsights(
            @RequestBody List<TransactionDTO> transactions) {
        // This is a simple implementation - can be extended
        return ResponseEntity.ok(Map.of(
                "totalTransactions", transactions.size(),
                "analysisStatus", "Complete",
                "timestamp", System.currentTimeMillis()
        ));
    }
}
