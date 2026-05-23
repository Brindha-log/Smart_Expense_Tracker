package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.CategoryBreakdownDTO;
import com.expensetracker.backend.dto.DashboardResponseDTO;
import com.expensetracker.backend.dto.TrendDataDTO;
import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.IsoFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public DashboardResponseDTO getDashboardData(Long userId, String period, LocalDate startDate, LocalDate endDate) {
        List<Expense> allExpenses;

        // 1. Fetch Data from Database
        if (startDate != null && endDate != null) {
            allExpenses = expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        } else {
            allExpenses = expenseRepository.findByUserIdOrderByDateDesc(userId);
        }

        // 2. FILTER by period (BEFORE calculating totals) — THIS IS THE FIX
        LocalDate now = LocalDate.now();

        if ("monthly".equalsIgnoreCase(period)) {
            // Filter to current month only
            LocalDate startOfMonth = now.withDayOfMonth(1);
            LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());
            allExpenses = allExpenses.stream()
                    .filter(e -> !e.getDate().isBefore(startOfMonth) && !e.getDate().isAfter(endOfMonth))
                    .collect(Collectors.toList());
        }
        else if ("weekly".equalsIgnoreCase(period)) {
            // Filter to current week only (Monday to Sunday)
            LocalDate startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1);
            LocalDate endOfWeek = startOfWeek.plusDays(6);
            allExpenses = allExpenses.stream()
                    .filter(e -> !e.getDate().isBefore(startOfWeek) && !e.getDate().isAfter(endOfWeek))
                    .collect(Collectors.toList());
        }
        else if ("yearly".equalsIgnoreCase(period)) {
            // Filter to current year only
            LocalDate startOfYear = now.withDayOfYear(1);
            LocalDate endOfYear = now.withDayOfYear(now.lengthOfYear());
            allExpenses = allExpenses.stream()
                    .filter(e -> !e.getDate().isBefore(startOfYear) && !e.getDate().isAfter(endOfYear))
                    .collect(Collectors.toList());
        }
        // If period = "all", no filtering needed

        // 3. Calculate Totals (now using FILTERED data)
        double totalIncome = 0;
        double totalExpense = 0;

        for (Expense e : allExpenses) {
            if ("income".equalsIgnoreCase(e.getType())) {
                totalIncome += e.getAmount();
            } else if ("expense".equalsIgnoreCase(e.getType())) {
                totalExpense += e.getAmount();
            }
        }

        double balance = totalIncome - totalExpense;
        System.out.println("TOTAL INCOME = " + totalIncome);
        System.out.println("TOTAL EXPENSE = " + totalExpense);
        System.out.println("BALANCE = " + balance);
        System.out.println("PERIOD = " + period);

        Double savingsRate = null;
        if (totalIncome > 0) {
            savingsRate = Math.round((balance / totalIncome * 100) * 10.0) / 10.0;
        }

        // 4. Category Breakdown (Expenses only)
        Map<String, Double> categoryMap = allExpenses.stream()
                .filter(e -> "expense".equalsIgnoreCase(e.getType()))
                .collect(Collectors.groupingBy(Expense::getCategory, Collectors.summingDouble(Expense::getAmount)));

        final double finalTotalExpense = totalExpense;
        List<CategoryBreakdownDTO> categories = categoryMap.entrySet().stream()
                .map(e -> {
                    CategoryBreakdownDTO dto = new CategoryBreakdownDTO(e.getKey(), e.getValue());
                    if (finalTotalExpense > 0) {
                        dto.setPercentage(Math.round((e.getValue() / finalTotalExpense * 100) * 10.0) / 10.0);
                    } else {
                        dto.setPercentage(0.0);
                    }
                    return dto;
                })
                .sorted((a, b) -> Double.compare(b.getAmount(), a.getAmount()))
                .collect(Collectors.toList());

        // 5. Trend Data (Grouping by period)
        Map<String, TrendDataDTO> trendMap = new LinkedHashMap<>();

        // Sort expenses ascending by date for chronological charts
        allExpenses.sort(Comparator.comparing(Expense::getDate));

        for (Expense e : allExpenses) {
            String label = getLabelForPeriod(e.getDate(), period);

            TrendDataDTO dto = trendMap.getOrDefault(label, new TrendDataDTO(label, 0.0, 0.0));
            if ("income".equalsIgnoreCase(e.getType())) {
                dto.setIncome(dto.getIncome() + e.getAmount());
            } else if ("expense".equalsIgnoreCase(e.getType())) {
                dto.setExpense(dto.getExpense() + e.getAmount());
            }
            trendMap.put(label, dto);
        }

        // Build Response
        DashboardResponseDTO response = new DashboardResponseDTO();
        response.setIncome(totalIncome);
        response.setExpenses(totalExpense);
        response.setBalance(balance);
        response.setSavingsRate(savingsRate);
        response.setTopCategories(categories);
        response.setChartData(new ArrayList<>(trendMap.values()));

        return response;
    }

    private String getLabelForPeriod(LocalDate date, String period) {
        if ("weekly".equalsIgnoreCase(period)) {
            int week = date.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
            return date.getYear() + "-W" + String.format("%02d", week);
        } else if ("yearly".equalsIgnoreCase(period)) {
            return String.valueOf(date.getYear());
        } else {
            // Default Monthly
            return date.format(DateTimeFormatter.ofPattern("MMM yyyy"));
        }
    }
}
