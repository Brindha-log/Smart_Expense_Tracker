package com.expensetracker.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreditBillingSummaryDTO {
    private BigDecimal currentBillAmount;
    private BigDecimal outstandingBalance;
    private BigDecimal remainingLimit;
    private BigDecimal minimumDue;
    private BigDecimal totalPayments;
    private BigDecimal carryForwardUnpaidBalance;
    private BigDecimal remainingPayableAmount;
    private LocalDate billingCycleStart;
    private LocalDate billingCycleEnd;

    // Getters and Setters
    public BigDecimal getCurrentBillAmount() {
        return currentBillAmount;
    }

    public void setCurrentBillAmount(BigDecimal currentBillAmount) {
        this.currentBillAmount = currentBillAmount;
    }

    public BigDecimal getOutstandingBalance() {
        return outstandingBalance;
    }

    public void setOutstandingBalance(BigDecimal outstandingBalance) {
        this.outstandingBalance = outstandingBalance;
    }

    public BigDecimal getRemainingLimit() {
        return remainingLimit;
    }

    public void setRemainingLimit(BigDecimal remainingLimit) {
        this.remainingLimit = remainingLimit;
    }

    public BigDecimal getMinimumDue() {
        return minimumDue;
    }

    public void setMinimumDue(BigDecimal minimumDue) {
        this.minimumDue = minimumDue;
    }

    public BigDecimal getTotalPayments() {
        return totalPayments;
    }

    public void setTotalPayments(BigDecimal totalPayments) {
        this.totalPayments = totalPayments;
    }

    public BigDecimal getCarryForwardUnpaidBalance() {
        return carryForwardUnpaidBalance;
    }

    public void setCarryForwardUnpaidBalance(BigDecimal carryForwardUnpaidBalance) {
        this.carryForwardUnpaidBalance = carryForwardUnpaidBalance;
    }

    public BigDecimal getRemainingPayableAmount() {
        return remainingPayableAmount;
    }

    public void setRemainingPayableAmount(BigDecimal remainingPayableAmount) {
        this.remainingPayableAmount = remainingPayableAmount;
    }

    public LocalDate getBillingCycleStart() {
        return billingCycleStart;
    }

    public void setBillingCycleStart(LocalDate billingCycleStart) {
        this.billingCycleStart = billingCycleStart;
    }

    public LocalDate getBillingCycleEnd() {
        return billingCycleEnd;
    }

    public void setBillingCycleEnd(LocalDate billingCycleEnd) {
        this.billingCycleEnd = billingCycleEnd;
    }
}
