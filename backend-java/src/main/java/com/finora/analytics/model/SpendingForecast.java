package com.finora.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

/**
 * Spending Forecast Response - ML-powered predictions
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpendingForecast {
    private Map<String, Double> predictedMonthlySpending;
    private Double averageMonthlyExpense;
    private String recommendation;
    private Map<String, Object> trends;
}
