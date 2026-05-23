package com.expensetracker.backend.dto;

public class CategoryBreakdownDTO {
    private String category;
    private Double amount;
    private Double percentage;

    public CategoryBreakdownDTO() {}

    public CategoryBreakdownDTO(String category, Double amount) {
        this.category = category;
        this.amount = amount;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
}
