package com.expensetracker.backend.dto;

public class BudgetRequestDTO {
    private String category;
    private Double limitAmount;
    private String month;

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Double getLimitAmount() { return limitAmount; }
    public void setLimitAmount(Double limitAmount) { this.limitAmount = limitAmount; }
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
}
