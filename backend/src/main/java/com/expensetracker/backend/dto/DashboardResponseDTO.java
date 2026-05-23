package com.expensetracker.backend.dto;

import java.util.List;

public class DashboardResponseDTO {
    private Double income;
    private Double expenses;
    private Double balance;
    private Double savingsRate;
    private List<CategoryBreakdownDTO> topCategories;
    private List<TrendDataDTO> chartData;

    public DashboardResponseDTO() {}

    public Double getIncome() { return income; }
    public void setIncome(Double income) { this.income = income; }

    public Double getExpenses() { return expenses; }
    public void setExpenses(Double expenses) { this.expenses = expenses; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }

    public Double getSavingsRate() { return savingsRate; }
    public void setSavingsRate(Double savingsRate) { this.savingsRate = savingsRate; }

    public List<CategoryBreakdownDTO> getTopCategories() { return topCategories; }
    public void setTopCategories(List<CategoryBreakdownDTO> topCategories) { this.topCategories = topCategories; }

    public List<TrendDataDTO> getChartData() { return chartData; }
    public void setChartData(List<TrendDataDTO> chartData) { this.chartData = chartData; }
}
