package com.finora.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.Map;

/**
 * Monthly Summary Response - Aggregated financial data for a month
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlySummary {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netIncome;
    private Map<String, BigDecimal> byCategory;
    private int transactionCount;
    private String month;
    private String year;
}
