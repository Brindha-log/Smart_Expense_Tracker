package com.expensetracker.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    
    // "TOTAL_MONTHLY" or specific category like "Food"
    private String category;
    
    private Double limitAmount;
    
    // Format: "YYYY-MM"
    private String month;

    public Budget() {}

    public Budget(Long userId, String category, Double limitAmount, String month) {
        this.userId = userId;
        this.category = category;
        this.limitAmount = limitAmount;
        this.month = month;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Double getLimitAmount() { return limitAmount; }
    public void setLimitAmount(Double limitAmount) { this.limitAmount = limitAmount; }
    
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
}
