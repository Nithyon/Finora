package com.finora.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

/**
 * Category Breakdown Response - Detailed spending analysis by category
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryBreakdown {
    private String category;
    private Double totalAmount;
    private Double percentage;
    private Integer transactionCount;
    private String trend; // "increasing", "decreasing", "stable"
    private List<String> recentTransactions;
}
