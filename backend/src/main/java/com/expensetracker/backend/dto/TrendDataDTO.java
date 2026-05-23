package com.expensetracker.backend.dto;

public class TrendDataDTO {
    private String label; // "Mon", "Tue" or "Jan", "Feb" or "Week 1"
    private Double income;
    private Double expense;

    public TrendDataDTO() {}

    public TrendDataDTO(String label, Double income, Double expense) {
        this.label = label;
        this.income = income;
        this.expense = expense;
    }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public Double getIncome() { return income; }
    public void setIncome(Double income) { this.income = income; }

    public Double getExpense() { return expense; }
    public void setExpense(Double expense) { this.expense = expense; }
}
