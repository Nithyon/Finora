package com.finora.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Monthly summary of financial metrics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummary {
    private String month; // "2025-10"
    private Double totalIncome;
    private Double totalExpense;
    private Double netSavings;
    private Double savingsRate;
    private List<CategoryBreakdown> categoryBreakdown;
    private Double largestExpense;
    private String largestExpenseCategory;
    private Integer transactionCount;
}
