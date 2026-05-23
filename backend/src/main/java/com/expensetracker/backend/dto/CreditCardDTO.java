package com.expensetracker.backend.dto;

import com.expensetracker.backend.entity.CardType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class CreditCardDTO {

    @NotBlank(message = "Card name is required")
    private String cardName;

    @NotBlank(message = "Bank name is required")
    private String bankName;

    @NotNull(message = "Card type is required")
    private CardType cardType;

    @NotNull(message = "Credit limit is required")
    @Positive(message = "Credit limit must be positive")
    private BigDecimal creditLimit;

    @NotNull(message = "Billing date is required")
    @Min(value = 1, message = "Billing date must be between 1 and 31")
    @Max(value = 31, message = "Billing date must be between 1 and 31")
    private Integer billingDate;

    @NotNull(message = "Due date is required")
    @Min(value = 1, message = "Due date must be between 1 and 31")
    @Max(value = 31, message = "Due date must be between 1 and 31")
    private Integer dueDate;

    @NotNull(message = "Interest rate is required")
    @Min(value = 0, message = "Interest rate cannot be negative")
    private BigDecimal interestRate;

    // Getters and Setters

    public String getCardName() {
        return cardName;
    }

    public void setCardName(String cardName) {
        this.cardName = cardName;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public CardType getCardType() {
        return cardType;
    }

    public void setCardType(CardType cardType) {
        this.cardType = cardType;
    }

    public BigDecimal getCreditLimit() {
        return creditLimit;
    }

    public void setCreditLimit(BigDecimal creditLimit) {
        this.creditLimit = creditLimit;
    }

    public Integer getBillingDate() {
        return billingDate;
    }

    public void setBillingDate(Integer billingDate) {
        this.billingDate = billingDate;
    }

    public Integer getDueDate() {
        return dueDate;
    }

    public void setDueDate(Integer dueDate) {
        this.dueDate = dueDate;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }
}
