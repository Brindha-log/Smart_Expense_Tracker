package com.expensetracker.backend.dto;

import java.util.List;

public class AnalyticsResponseDTO {
    
    private boolean hasData;
    private SummaryData summary;
    private SpendingTrends trends;
    private MonthlyAnalysis monthly;
    private SavingsAnalysis savings;
    private ExpensePatterns patterns;
    private PredictionData prediction;
    private List<InsightDTO> insights;
    private List<WarningDTO> warnings;
    private CategoryAnalysis categoryAnalysis;

    // Getters and Setters
    public boolean isHasData() { return hasData; }
    public void setHasData(boolean hasData) { this.hasData = hasData; }
    
    public SummaryData getSummary() { return summary; }
    public void setSummary(SummaryData summary) { this.summary = summary; }
    
    public SpendingTrends getTrends() { return trends; }
    public void setTrends(SpendingTrends trends) { this.trends = trends; }
    
    public MonthlyAnalysis getMonthly() { return monthly; }
    public void setMonthly(MonthlyAnalysis monthly) { this.monthly = monthly; }
    
    public SavingsAnalysis getSavings() { return savings; }
    public void setSavings(SavingsAnalysis savings) { this.savings = savings; }
    
    public ExpensePatterns getPatterns() { return patterns; }
    public void setPatterns(ExpensePatterns patterns) { this.patterns = patterns; }
    
    public PredictionData getPrediction() { return prediction; }
    public void setPrediction(PredictionData prediction) { this.prediction = prediction; }
    
    public List<InsightDTO> getInsights() { return insights; }
    public void setInsights(List<InsightDTO> insights) { this.insights = insights; }
    
    public List<WarningDTO> getWarnings() { return warnings; }
    public void setWarnings(List<WarningDTO> warnings) { this.warnings = warnings; }
    
    public CategoryAnalysis getCategoryAnalysis() { return categoryAnalysis; }
    public void setCategoryAnalysis(CategoryAnalysis categoryAnalysis) { this.categoryAnalysis = categoryAnalysis; }

    // --- NESTED DTO CLASSES ---

    public static class SummaryData {
        private double totalIncome;
        private double totalExpense;
        private double balance;
        private Double savingsRate;
        private Double incomeGrowth;
        private Double expenseGrowth;
        private Double balanceGrowth;
        private Double savingsGrowth;
        
        public double getTotalIncome() { return totalIncome; }
        public void setTotalIncome(double totalIncome) { this.totalIncome = totalIncome; }
        public double getTotalExpense() { return totalExpense; }
        public void setTotalExpense(double totalExpense) { this.totalExpense = totalExpense; }
        public double getBalance() { return balance; }
        public void setBalance(double balance) { this.balance = balance; }
        public Double getSavingsRate() { return savingsRate; }
        public void setSavingsRate(Double savingsRate) { this.savingsRate = savingsRate; }
        public Double getIncomeGrowth() { return incomeGrowth; }
        public void setIncomeGrowth(Double incomeGrowth) { this.incomeGrowth = incomeGrowth; }
        public Double getExpenseGrowth() { return expenseGrowth; }
        public void setExpenseGrowth(Double expenseGrowth) { this.expenseGrowth = expenseGrowth; }
        public Double getBalanceGrowth() { return balanceGrowth; }
        public void setBalanceGrowth(Double balanceGrowth) { this.balanceGrowth = balanceGrowth; }
        public Double getSavingsGrowth() { return savingsGrowth; }
        public void setSavingsGrowth(Double savingsGrowth) { this.savingsGrowth = savingsGrowth; }
    }

    public static class SpendingTrends {
        private List<TrendDataDTO> daily;
        private List<TrendDataDTO> weekly;
        private List<TrendDataDTO> monthly;
        private List<TrendDataDTO> yearly;

        public List<TrendDataDTO> getDaily() { return daily; }
        public void setDaily(List<TrendDataDTO> daily) { this.daily = daily; }
        public List<TrendDataDTO> getWeekly() { return weekly; }
        public void setWeekly(List<TrendDataDTO> weekly) { this.weekly = weekly; }
        public List<TrendDataDTO> getMonthly() { return monthly; }
        public void setMonthly(List<TrendDataDTO> monthly) { this.monthly = monthly; }
        public List<TrendDataDTO> getYearly() { return yearly; }
        public void setYearly(List<TrendDataDTO> yearly) { this.yearly = yearly; }
    }

    public static class MonthlyAnalysis {
        private double totalIncome;
        private double totalExpenses;
        private double balance;
        private Double savingsRate;
        private String highestSpendingMonth;
        private String lowestSpendingMonth;
        
        public double getTotalIncome() { return totalIncome; }
        public void setTotalIncome(double totalIncome) { this.totalIncome = totalIncome; }
        public double getTotalExpenses() { return totalExpenses; }
        public void setTotalExpenses(double totalExpenses) { this.totalExpenses = totalExpenses; }
        public double getBalance() { return balance; }
        public void setBalance(double balance) { this.balance = balance; }
        public Double getSavingsRate() { return savingsRate; }
        public void setSavingsRate(Double savingsRate) { this.savingsRate = savingsRate; }
        public String getHighestSpendingMonth() { return highestSpendingMonth; }
        public void setHighestSpendingMonth(String highestSpendingMonth) { this.highestSpendingMonth = highestSpendingMonth; }
        public String getLowestSpendingMonth() { return lowestSpendingMonth; }
        public void setLowestSpendingMonth(String lowestSpendingMonth) { this.lowestSpendingMonth = lowestSpendingMonth; }
    }

    public static class SavingsAnalysis {
        private Double averageSavingsRate;
        private String bestSavingsMonth;
        private String worstSavingsMonth;
        private int deficitMonthsCount;

        public Double getAverageSavingsRate() { return averageSavingsRate; }
        public void setAverageSavingsRate(Double averageSavingsRate) { this.averageSavingsRate = averageSavingsRate; }
        public String getBestSavingsMonth() { return bestSavingsMonth; }
        public void setBestSavingsMonth(String bestSavingsMonth) { this.bestSavingsMonth = bestSavingsMonth; }
        public String getWorstSavingsMonth() { return worstSavingsMonth; }
        public void setWorstSavingsMonth(String worstSavingsMonth) { this.worstSavingsMonth = worstSavingsMonth; }
        public int getDeficitMonthsCount() { return deficitMonthsCount; }
        public void setDeficitMonthsCount(int deficitMonthsCount) { this.deficitMonthsCount = deficitMonthsCount; }
    }

    public static class ExpensePatterns {
        private String highestSpendingDay;
        private String highestSpendingCategory;
        private double weekendSpendingPercentage;
        private double weekdaySpendingPercentage;

        public String getHighestSpendingDay() { return highestSpendingDay; }
        public void setHighestSpendingDay(String highestSpendingDay) { this.highestSpendingDay = highestSpendingDay; }
        public String getHighestSpendingCategory() { return highestSpendingCategory; }
        public void setHighestSpendingCategory(String highestSpendingCategory) { this.highestSpendingCategory = highestSpendingCategory; }
        public double getWeekendSpendingPercentage() { return weekendSpendingPercentage; }
        public void setWeekendSpendingPercentage(double weekendSpendingPercentage) { this.weekendSpendingPercentage = weekendSpendingPercentage; }
        public double getWeekdaySpendingPercentage() { return weekdaySpendingPercentage; }
        public void setWeekdaySpendingPercentage(double weekdaySpendingPercentage) { this.weekdaySpendingPercentage = weekdaySpendingPercentage; }
    }

    public static class PredictionData {
        private double predictedNextMonthExpense;
        private double predictedEndBalance;
        
        public double getPredictedNextMonthExpense() { return predictedNextMonthExpense; }
        public void setPredictedNextMonthExpense(double predictedNextMonthExpense) { this.predictedNextMonthExpense = predictedNextMonthExpense; }
        public double getPredictedEndBalance() { return predictedEndBalance; }
        public void setPredictedEndBalance(double predictedEndBalance) { this.predictedEndBalance = predictedEndBalance; }
    }

    public static class InsightDTO {
        private String text;
        private String type; // positive, negative, neutral

        public InsightDTO(String text, String type) {
            this.text = text;
            this.type = type;
        }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
    }

    public static class WarningDTO {
        private String text;
        private String severity; // high, medium, low

        public WarningDTO(String text, String severity) {
            this.text = text;
            this.severity = severity;
        }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
    }

    public static class CategoryAnalysis {
        private List<CategoryBreakdownDTO> incomeCategories;
        private List<CategoryBreakdownDTO> expenseCategories;

        public List<CategoryBreakdownDTO> getIncomeCategories() { return incomeCategories; }
        public void setIncomeCategories(List<CategoryBreakdownDTO> incomeCategories) { this.incomeCategories = incomeCategories; }
        public List<CategoryBreakdownDTO> getExpenseCategories() { return expenseCategories; }
        public void setExpenseCategories(List<CategoryBreakdownDTO> expenseCategories) { this.expenseCategories = expenseCategories; }
    }
}
