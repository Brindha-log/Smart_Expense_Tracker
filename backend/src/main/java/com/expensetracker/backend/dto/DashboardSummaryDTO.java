package com.expensetracker.backend.dto;

public class DashboardSummaryDTO {
    private Double totalIncome;
    private Double totalExpense;
    private Double balance;
    private Double savingsRate; // (Income - Expense) / Income * 100
    private Double highestExpense;
    private Double monthlyGrowth; // Placeholder for growth calculation

    // Getters and Setters
    public Double getTotalIncome() { return totalIncome; }
    public void setTotalIncome(Double totalIncome) { this.totalIncome = totalIncome; }

    public Double getTotalExpense() { return totalExpense; }
    public void setTotalExpense(Double totalExpense) { this.totalExpense = totalExpense; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }

    public Double getSavingsRate() { return savingsRate; }
    public void setSavingsRate(Double savingsRate) { this.savingsRate = savingsRate; }

    public Double getHighestExpense() { return highestExpense; }
    public void setHighestExpense(Double highestExpense) { this.highestExpense = highestExpense; }

    public Double getMonthlyGrowth() { return monthlyGrowth; }
    public void setMonthlyGrowth(Double monthlyGrowth) { this.monthlyGrowth = monthlyGrowth; }
}
