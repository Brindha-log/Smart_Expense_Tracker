package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.BudgetRequestDTO;
import com.expensetracker.backend.dto.BudgetResponseDTO;
import com.expensetracker.backend.entity.Budget;
import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.repository.BudgetRepository;
import com.expensetracker.backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public Budget saveOrUpdateBudget(Long userId, BudgetRequestDTO dto) {
        Optional<Budget> existing = budgetRepository.findByUserIdAndMonthAndCategory(userId, dto.getMonth(), dto.getCategory());
        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setLimitAmount(dto.getLimitAmount());
        } else {
            budget = new Budget(userId, dto.getCategory(), dto.getLimitAmount(), dto.getMonth());
        }
        return budgetRepository.save(budget);
    }

    public void deleteBudget(Long budgetId) {
        budgetRepository.deleteById(budgetId);
    }

    public BudgetResponseDTO getBudgets(Long userId, String month) {
        List<Budget> budgets = budgetRepository.findByUserIdAndMonth(userId, month);
        BudgetResponseDTO response = new BudgetResponseDTO();

        if (budgets.isEmpty()) {
            response.setHasBudgets(false);
            return response;
        }

        response.setHasBudgets(true);

        // Fetch expenses to calculate dynamic spending
        List<Expense> allExpenses = expenseRepository.findByUserIdOrderByDateDesc(userId);
        
        List<BudgetResponseDTO.BudgetSummary> categoryBudgets = new ArrayList<>();
        BudgetResponseDTO.BudgetSummary globalBudget = null;

        double totalBudgeted = 0;
        double totalSpent = 0;
        String mostExceededCategory = null;
        double highestExceedPercentage = 0;
        String safestCategory = null;
        double lowestUtilization = Double.MAX_VALUE;

        List<BudgetResponseDTO.BudgetWarning> warnings = new ArrayList<>();

        for (Budget b : budgets) {
            double spent = calculateSpentForBudget(allExpenses, b.getCategory(), month);
            double remaining = b.getLimitAmount() - spent;
            double utilization = (spent / b.getLimitAmount()) * 100;
            boolean isExceeded = remaining < 0;

            BudgetResponseDTO.BudgetSummary summary = new BudgetResponseDTO.BudgetSummary();
            summary.setId(b.getId());
            summary.setCategory(b.getCategory());
            summary.setLimitAmount(b.getLimitAmount());
            summary.setSpentAmount(spent);
            summary.setRemainingAmount(remaining);
            summary.setUtilizationPercentage(Math.round(utilization * 10.0) / 10.0);
            summary.setExceeded(isExceeded);

            if ("TOTAL_MONTHLY".equals(b.getCategory())) {
                globalBudget = summary;
            } else {
                categoryBudgets.add(summary);
                totalBudgeted += b.getLimitAmount();
                totalSpent += spent;

                if (utilization > highestExceedPercentage) {
                    highestExceedPercentage = utilization;
                    mostExceededCategory = b.getCategory();
                }
                if (utilization < lowestUtilization && utilization > 0) {
                    lowestUtilization = utilization;
                    safestCategory = b.getCategory();
                }

                // Generate Warnings
                if (utilization > 100) {
                    warnings.add(new BudgetResponseDTO.BudgetWarning("Your " + b.getCategory() + " budget is completely exhausted and in deficit.", "exceeded"));
                } else if (utilization >= 90) {
                    warnings.add(new BudgetResponseDTO.BudgetWarning(b.getCategory() + " is almost exhausted (" + Math.round(utilization) + "%).", "critical"));
                } else if (utilization >= 70) {
                    warnings.add(new BudgetResponseDTO.BudgetWarning(b.getCategory() + " budget usage is high.", "warning"));
                }
            }
        }

        response.setGlobalBudget(globalBudget);
        response.setCategoryBudgets(categoryBudgets);
        response.setWarnings(warnings);

        // Global monthly budget calculations if present
        if (globalBudget != null) {
            if (globalBudget.getUtilizationPercentage() > 100) {
                warnings.add(new BudgetResponseDTO.BudgetWarning("OVERALL MONTHLY BUDGET EXCEEDED!", "exceeded"));
            }
            totalBudgeted = globalBudget.getLimitAmount();
            totalSpent = globalBudget.getSpentAmount();
        }

        BudgetResponseDTO.BudgetAnalytics analytics = new BudgetResponseDTO.BudgetAnalytics();
        analytics.setTotalBudgeted(totalBudgeted);
        analytics.setTotalSpent(totalSpent);
        if (totalBudgeted > 0) {
            analytics.setOverallUtilization(Math.round((totalSpent / totalBudgeted * 100) * 10.0) / 10.0);
        }
        analytics.setMostExceededCategory(mostExceededCategory);
        analytics.setSafestCategory(safestCategory);
        response.setAnalytics(analytics);

        return response;
    }

    private double calculateSpentForBudget(List<Expense> expenses, String category, String month) {
        double spent = 0;
        for (Expense e : expenses) {
            if ("expense".equalsIgnoreCase(e.getType())) {
                // Check if expense date matches the budget month (format: YYYY-MM)
                String expenseMonthStr = String.format("%d-%02d", e.getDate().getYear(), e.getDate().getMonthValue());
                if (expenseMonthStr.equals(month)) {
                    if ("TOTAL_MONTHLY".equals(category) || e.getCategory().equalsIgnoreCase(category)) {
                        spent += e.getAmount();
                    }
                }
            }
        }
        return spent;
    }
}
