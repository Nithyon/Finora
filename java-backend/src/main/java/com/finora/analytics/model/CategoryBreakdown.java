package com.finora.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Spending breakdown by category
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryBreakdown {
    private String category;
    private Double amount;
    private Double percentage;
    private String emoji;
    private String color;
    private Integer transactionCount;
}
