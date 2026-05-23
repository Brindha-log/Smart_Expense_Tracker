package com.expensetracker.backend.dto;

import java.util.List;

public class BudgetResponseDTO {
    private boolean hasBudgets;
    private BudgetSummary globalBudget;
    private List<BudgetSummary> categoryBudgets;
    private BudgetAnalytics analytics;
    private List<BudgetWarning> warnings;

    public boolean isHasBudgets() { return hasBudgets; }
    public void setHasBudgets(boolean hasBudgets) { this.hasBudgets = hasBudgets; }
    public BudgetSummary getGlobalBudget() { return globalBudget; }
    public void setGlobalBudget(BudgetSummary globalBudget) { this.globalBudget = globalBudget; }
    public List<BudgetSummary> getCategoryBudgets() { return categoryBudgets; }
    public void setCategoryBudgets(List<BudgetSummary> categoryBudgets) { this.categoryBudgets = categoryBudgets; }
    public BudgetAnalytics getAnalytics() { return analytics; }
    public void setAnalytics(BudgetAnalytics analytics) { this.analytics = analytics; }
    public List<BudgetWarning> getWarnings() { return warnings; }
    public void setWarnings(List<BudgetWarning> warnings) { this.warnings = warnings; }

    public static class BudgetSummary {
        private Long id;
        private String category;
        private double limitAmount;
        private double spentAmount;
        private double remainingAmount;
        private double utilizationPercentage;
        private boolean isExceeded;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public double getLimitAmount() { return limitAmount; }
        public void setLimitAmount(double limitAmount) { this.limitAmount = limitAmount; }
        public double getSpentAmount() { return spentAmount; }
        public void setSpentAmount(double spentAmount) { this.spentAmount = spentAmount; }
        public double getRemainingAmount() { return remainingAmount; }
        public void setRemainingAmount(double remainingAmount) { this.remainingAmount = remainingAmount; }
        public double getUtilizationPercentage() { return utilizationPercentage; }
        public void setUtilizationPercentage(double utilizationPercentage) { this.utilizationPercentage = utilizationPercentage; }
        public boolean isExceeded() { return isExceeded; }
        public void setExceeded(boolean isExceeded) { this.isExceeded = isExceeded; }
    }

    public static class BudgetAnalytics {
        private double totalBudgeted;
        private double totalSpent;
        private double overallUtilization;
        private String mostExceededCategory;
        private String safestCategory;

        public double getTotalBudgeted() { return totalBudgeted; }
        public void setTotalBudgeted(double totalBudgeted) { this.totalBudgeted = totalBudgeted; }
        public double getTotalSpent() { return totalSpent; }
        public void setTotalSpent(double totalSpent) { this.totalSpent = totalSpent; }
        public double getOverallUtilization() { return overallUtilization; }
        public void setOverallUtilization(double overallUtilization) { this.overallUtilization = overallUtilization; }
        public String getMostExceededCategory() { return mostExceededCategory; }
        public void setMostExceededCategory(String mostExceededCategory) { this.mostExceededCategory = mostExceededCategory; }
        public String getSafestCategory() { return safestCategory; }
        public void setSafestCategory(String safestCategory) { this.safestCategory = safestCategory; }
    }

    public static class BudgetWarning {
        private String message;
        private String severity; // warning (70-90%), critical (90-100%), exceeded (>100%)

        public BudgetWarning(String message, String severity) {
            this.message = message;
            this.severity = severity;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
    }
}
