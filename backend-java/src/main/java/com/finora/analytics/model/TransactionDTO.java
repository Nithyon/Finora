package com.finora.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Transaction DTO - Represents a financial transaction
 * Communicates with FastAPI backend via REST API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private Long userId;
    private Long accountId;
    private String category;
    private BigDecimal amount;
    private String description;
    private String transactionType; // "income" or "expense"
    private LocalDateTime date;
}
