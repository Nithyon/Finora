package com.finora.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

/**
 * Spending forecast and predictions
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpendingForecast {
    private String month;
    private Double predictedIncome;
    private Double predictedExpense;
    private Double predictedSavings;
    private Map<String, Double> categoryForecasts; // category -> predicted amount
    private Double confidence; // 0.0 to 1.0
    private List<String> insights;
    private String recommendation;
}
