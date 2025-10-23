package com.finora.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Transaction
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private Long userId;
    private String description;
    private Double amount;
    private String category;
    private String type; // "expense" or "income"
    private LocalDateTime date;
    private String notes;
}
