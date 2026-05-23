package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.AnalyticsResponseDTO;
import com.expensetracker.backend.dto.CategoryBreakdownDTO;
import com.expensetracker.backend.dto.TrendDataDTO;
import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.IsoFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public AnalyticsResponseDTO getAnalytics(Long userId, String period) {
        List<Expense> allExpenses = expenseRepository.findByUserIdOrderByDateDesc(userId);

        AnalyticsResponseDTO response = new AnalyticsResponseDTO();

        if (allExpenses == null || allExpenses.isEmpty()) {
            response.setHasData(false);
            return response;
        }

        response.setHasData(true);
        allExpenses.sort(Comparator.comparing(Expense::getDate));

        // 0. Calculate Specific Period Summary (Growth + Totals)
        response.setSummary(calculateSummary(allExpenses, period));

        // 1. Calculate Monthly Analysis
        AnalyticsResponseDTO.MonthlyAnalysis monthlyAnalysis = calculateMonthlyAnalysis(allExpenses);
        response.setMonthly(monthlyAnalysis);

        // 2. Spending Trends (Daily, Weekly, Monthly, Yearly)
        AnalyticsResponseDTO.SpendingTrends trends = calculateTrends(allExpenses);
        response.setTrends(trends);

        // 3. Savings Analysis
        AnalyticsResponseDTO.SavingsAnalysis savings = calculateSavings(allExpenses, trends.getMonthly());
        response.setSavings(savings);

        // 4. Patterns
        AnalyticsResponseDTO.ExpensePatterns patterns = calculatePatterns(allExpenses);
        response.setPatterns(patterns);

        // 5. Predictions
        AnalyticsResponseDTO.PredictionData prediction = calculatePredictions(allExpenses, trends.getMonthly());
        response.setPrediction(prediction);

        // 6. Categories
        AnalyticsResponseDTO.CategoryAnalysis categoryAnalysis = calculateCategories(allExpenses);
        response.setCategoryAnalysis(categoryAnalysis);

        // 7. Insights & Warnings
        response.setInsights(generateInsights(trends.getMonthly()));
        response.setWarnings(generateWarnings(prediction, monthlyAnalysis, categoryAnalysis));

        return response;
    }

    private AnalyticsResponseDTO.SummaryData calculateSummary(List<Expense> expenses, String period) {
        AnalyticsResponseDTO.SummaryData summary = new AnalyticsResponseDTO.SummaryData();
        LocalDate anchorDate = LocalDate.now();
        
        LocalDate currentStart = null;
        LocalDate currentEnd = anchorDate;
        LocalDate previousStart = null;
        LocalDate previousEnd = null;
        
        if ("daily".equalsIgnoreCase(period)) {
            currentStart = anchorDate;
            previousStart = anchorDate.minusDays(1);
            previousEnd = anchorDate.minusDays(1);
        } else if ("weekly".equalsIgnoreCase(period)) {
            // ISO week usually starts Monday. Let's just do last 7 days vs previous 7 days for simplicity
            currentStart = anchorDate.minusDays(6);
            previousStart = anchorDate.minusDays(13);
            previousEnd = anchorDate.minusDays(7);
        } else if ("yearly".equalsIgnoreCase(period)) {
            currentStart = anchorDate.withDayOfYear(1);
            previousStart = anchorDate.minusYears(1).withDayOfYear(1);
            previousEnd = anchorDate.minusYears(1).withDayOfYear(anchorDate.minusYears(1).lengthOfYear());
        } else {
            // monthly
            currentStart = anchorDate.withDayOfMonth(1);
            previousStart = anchorDate.minusMonths(1).withDayOfMonth(1);
            previousEnd = anchorDate.minusMonths(1).withDayOfMonth(anchorDate.minusMonths(1).lengthOfMonth());
        }

        double currIncome = 0;
        double currExpense = 0;
        double prevIncome = 0;
        double prevExpense = 0;

        for (Expense e : expenses) {
            LocalDate d = e.getDate();
            if (!d.isBefore(currentStart) && !d.isAfter(currentEnd)) {
                if ("income".equalsIgnoreCase(e.getType())) currIncome += e.getAmount();
                else currExpense += e.getAmount();
            } else if (!d.isBefore(previousStart) && !d.isAfter(previousEnd)) {
                if ("income".equalsIgnoreCase(e.getType())) prevIncome += e.getAmount();
                else prevExpense += e.getAmount();
            }
        }

        summary.setTotalIncome(currIncome);
        summary.setTotalExpense(currExpense);
        
        double currBalance = currIncome - currExpense;
        double prevBalance = prevIncome - prevExpense;
        summary.setBalance(currBalance);

        if (currIncome > 0) {
            summary.setSavingsRate(Math.round((currBalance / currIncome * 100) * 10.0) / 10.0);
        }

        Double prevSavings = null;
        if (prevIncome > 0) {
            prevSavings = (prevBalance / prevIncome) * 100;
        }

        summary.setIncomeGrowth(calculateGrowth(currIncome, prevIncome));
        summary.setExpenseGrowth(calculateGrowth(currExpense, prevExpense));
        summary.setBalanceGrowth(calculateGrowth(currBalance, prevBalance));
        summary.setSavingsGrowth(calculateGrowth(summary.getSavingsRate() != null ? summary.getSavingsRate() : 0, prevSavings != null ? prevSavings : 0));

        return summary;
    }

    private Double calculateGrowth(double current, double previous) {
        if (previous == 0) return null;
        return Math.round((((current - previous) / Math.abs(previous)) * 100) * 10.0) / 10.0;
    }

    private AnalyticsResponseDTO.MonthlyAnalysis calculateMonthlyAnalysis(List<Expense> expenses) {
        AnalyticsResponseDTO.MonthlyAnalysis analysis = new AnalyticsResponseDTO.MonthlyAnalysis();
        double totalIncome = 0;
        double totalExpense = 0;

        Map<String, Double> monthlyExpenses = new HashMap<>();

        for (Expense e : expenses) {
            if ("income".equalsIgnoreCase(e.getType())) {
                totalIncome += e.getAmount();
            } else {
                totalExpense += e.getAmount();
                String monthKey = e.getDate().format(DateTimeFormatter.ofPattern("MMM yyyy"));
                monthlyExpenses.put(monthKey, monthlyExpenses.getOrDefault(monthKey, 0.0) + e.getAmount());
            }
        }

        analysis.setTotalIncome(totalIncome);
        analysis.setTotalExpenses(totalExpense);
        analysis.setBalance(totalIncome - totalExpense);

        if (totalIncome > 0) {
            analysis.setSavingsRate(Math.round(((totalIncome - totalExpense) / totalIncome * 100) * 10.0) / 10.0);
        }

        String highestMonth = null;
        double highestAmount = -1;
        String lowestMonth = null;
        double lowestAmount = Double.MAX_VALUE;

        for (Map.Entry<String, Double> entry : monthlyExpenses.entrySet()) {
            if (entry.getValue() > highestAmount) {
                highestAmount = entry.getValue();
                highestMonth = entry.getKey();
            }
            if (entry.getValue() < lowestAmount) {
                lowestAmount = entry.getValue();
                lowestMonth = entry.getKey();
            }
        }

        analysis.setHighestSpendingMonth(highestMonth);
        analysis.setLowestSpendingMonth(lowestMonth);
        return analysis;
    }

    private AnalyticsResponseDTO.SpendingTrends calculateTrends(List<Expense> expenses) {
        AnalyticsResponseDTO.SpendingTrends trends = new AnalyticsResponseDTO.SpendingTrends();
        
        Map<String, TrendDataDTO> daily = new LinkedHashMap<>();
        Map<String, TrendDataDTO> weekly = new LinkedHashMap<>();
        Map<String, TrendDataDTO> monthly = new LinkedHashMap<>();
        Map<String, TrendDataDTO> yearly = new LinkedHashMap<>();

        DateTimeFormatter dailyFormatter = DateTimeFormatter.ofPattern("MMM dd");
        DateTimeFormatter monthlyFormatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (Expense e : expenses) {
            boolean isIncome = "income".equalsIgnoreCase(e.getType());
            double amt = e.getAmount();

            // Daily
            String dKey = e.getDate().format(dailyFormatter);
            TrendDataDTO dDto = daily.getOrDefault(dKey, new TrendDataDTO(dKey, 0.0, 0.0));
            if (isIncome) dDto.setIncome(dDto.getIncome() + amt); else dDto.setExpense(dDto.getExpense() + amt);
            daily.put(dKey, dDto);

            // Weekly
            int week = e.getDate().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
            String wKey = e.getDate().getYear() + "-W" + String.format("%02d", week);
            TrendDataDTO wDto = weekly.getOrDefault(wKey, new TrendDataDTO(wKey, 0.0, 0.0));
            if (isIncome) wDto.setIncome(wDto.getIncome() + amt); else wDto.setExpense(wDto.getExpense() + amt);
            weekly.put(wKey, wDto);

            // Monthly
            String mKey = e.getDate().format(monthlyFormatter);
            TrendDataDTO mDto = monthly.getOrDefault(mKey, new TrendDataDTO(mKey, 0.0, 0.0));
            if (isIncome) mDto.setIncome(mDto.getIncome() + amt); else mDto.setExpense(mDto.getExpense() + amt);
            monthly.put(mKey, mDto);

            // Yearly
            String yKey = String.valueOf(e.getDate().getYear());
            TrendDataDTO yDto = yearly.getOrDefault(yKey, new TrendDataDTO(yKey, 0.0, 0.0));
            if (isIncome) yDto.setIncome(yDto.getIncome() + amt); else yDto.setExpense(yDto.getExpense() + amt);
            yearly.put(yKey, yDto);
        }

        trends.setDaily(new ArrayList<>(daily.values()));
        trends.setWeekly(new ArrayList<>(weekly.values()));
        trends.setMonthly(new ArrayList<>(monthly.values()));
        trends.setYearly(new ArrayList<>(yearly.values()));

        return trends;
    }

    private AnalyticsResponseDTO.SavingsAnalysis calculateSavings(List<Expense> expenses, List<TrendDataDTO> monthlyTrends) {
        AnalyticsResponseDTO.SavingsAnalysis savings = new AnalyticsResponseDTO.SavingsAnalysis();
        if (monthlyTrends.isEmpty()) return savings;

        double totalRate = 0;
        int validMonths = 0;
        int deficitMonths = 0;
        
        String bestMonth = null;
        double bestRate = -Double.MAX_VALUE;
        String worstMonth = null;
        double worstRate = Double.MAX_VALUE;

        for (TrendDataDTO month : monthlyTrends) {
            double income = month.getIncome();
            double expense = month.getExpense();
            double balance = income - expense;
            
            if (balance < 0) deficitMonths++;

            if (income > 0) {
                double rate = (balance / income) * 100;
                totalRate += rate;
                validMonths++;

                if (rate > bestRate) {
                    bestRate = rate;
                    bestMonth = month.getLabel();
                }
                if (rate < worstRate) {
                    worstRate = rate;
                    worstMonth = month.getLabel();
                }
            }
        }

        if (validMonths > 0) {
            savings.setAverageSavingsRate(Math.round((totalRate / validMonths) * 10.0) / 10.0);
            savings.setBestSavingsMonth(bestMonth);
            savings.setWorstSavingsMonth(worstMonth);
        }
        savings.setDeficitMonthsCount(deficitMonths);

        return savings;
    }

    private AnalyticsResponseDTO.ExpensePatterns calculatePatterns(List<Expense> expenses) {
        AnalyticsResponseDTO.ExpensePatterns patterns = new AnalyticsResponseDTO.ExpensePatterns();
        
        Map<DayOfWeek, Double> dayMap = new HashMap<>();
        Map<String, Double> catMap = new HashMap<>();
        
        double weekendTotal = 0;
        double weekdayTotal = 0;
        double overallTotal = 0;

        for (Expense e : expenses) {
            if ("expense".equalsIgnoreCase(e.getType())) {
                DayOfWeek day = e.getDate().getDayOfWeek();
                dayMap.put(day, dayMap.getOrDefault(day, 0.0) + e.getAmount());
                catMap.put(e.getCategory(), catMap.getOrDefault(e.getCategory(), 0.0) + e.getAmount());

                if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
                    weekendTotal += e.getAmount();
                } else {
                    weekdayTotal += e.getAmount();
                }
                overallTotal += e.getAmount();
            }
        }

        // Highest Day
        DayOfWeek highestDay = null;
        double highestDayAmt = -1;
        for (Map.Entry<DayOfWeek, Double> entry : dayMap.entrySet()) {
            if (entry.getValue() > highestDayAmt) {
                highestDayAmt = entry.getValue();
                highestDay = entry.getKey();
            }
        }
        if (highestDay != null) patterns.setHighestSpendingDay(highestDay.toString());

        // Highest Category
        String highestCat = null;
        double highestCatAmt = -1;
        for (Map.Entry<String, Double> entry : catMap.entrySet()) {
            if (entry.getValue() > highestCatAmt) {
                highestCatAmt = entry.getValue();
                highestCat = entry.getKey();
            }
        }
        patterns.setHighestSpendingCategory(highestCat);

        if (overallTotal > 0) {
            patterns.setWeekendSpendingPercentage(Math.round((weekendTotal / overallTotal * 100) * 10.0) / 10.0);
            patterns.setWeekdaySpendingPercentage(Math.round((weekdayTotal / overallTotal * 100) * 10.0) / 10.0);
        }

        return patterns;
    }

    private AnalyticsResponseDTO.PredictionData calculatePredictions(List<Expense> expenses, List<TrendDataDTO> monthlyTrends) {
        AnalyticsResponseDTO.PredictionData prediction = new AnalyticsResponseDTO.PredictionData();
        
        // 1. Moving Average for Next Month Expense (SMA of last 3 months)
        int monthsToConsider = Math.min(3, monthlyTrends.size());
        if (monthsToConsider > 0) {
            double sumRecentExpenses = 0;
            // Iterate from end
            for (int i = monthlyTrends.size() - 1; i >= monthlyTrends.size() - monthsToConsider; i--) {
                sumRecentExpenses += monthlyTrends.get(i).getExpense();
            }
            prediction.setPredictedNextMonthExpense(Math.round(sumRecentExpenses / monthsToConsider));
        }

        // 2. End of Month Balance (Daily burn rate for current month)
        LocalDate anchorDate = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(anchorDate);
        
        double currentMonthSpent = 0;
        double currentMonthIncome = 0;
        
        for (Expense e : expenses) {
            if (e.getDate().getYear() == anchorDate.getYear() && e.getDate().getMonth() == anchorDate.getMonth()) {
                if ("expense".equalsIgnoreCase(e.getType())) {
                    currentMonthSpent += e.getAmount();
                } else {
                    currentMonthIncome += e.getAmount();
                }
            }
        }

        int daysElapsed = anchorDate.getDayOfMonth();
        int totalDays = currentMonth.lengthOfMonth();
        
        if (daysElapsed > 0) {
            double dailyBurnRate = currentMonthSpent / daysElapsed;
            double projectedTotalSpent = currentMonthSpent + (dailyBurnRate * (totalDays - daysElapsed));
            prediction.setPredictedEndBalance(Math.round(currentMonthIncome - projectedTotalSpent));
        }

        return prediction;
    }

    private AnalyticsResponseDTO.CategoryAnalysis calculateCategories(List<Expense> expenses) {
        AnalyticsResponseDTO.CategoryAnalysis analysis = new AnalyticsResponseDTO.CategoryAnalysis();
        
        Map<String, Double> incMap = new HashMap<>();
        Map<String, Double> expMap = new HashMap<>();
        double totalInc = 0;
        double totalExp = 0;

        for (Expense e : expenses) {
            if ("income".equalsIgnoreCase(e.getType())) {
                incMap.put(e.getCategory(), incMap.getOrDefault(e.getCategory(), 0.0) + e.getAmount());
                totalInc += e.getAmount();
            } else {
                expMap.put(e.getCategory(), expMap.getOrDefault(e.getCategory(), 0.0) + e.getAmount());
                totalExp += e.getAmount();
            }
        }

        analysis.setIncomeCategories(convertToCategoryList(incMap, totalInc));
        analysis.setExpenseCategories(convertToCategoryList(expMap, totalExp));
        return analysis;
    }

    private List<CategoryBreakdownDTO> convertToCategoryList(Map<String, Double> map, double total) {
        return map.entrySet().stream()
            .map(e -> {
                CategoryBreakdownDTO dto = new CategoryBreakdownDTO(e.getKey(), e.getValue());
                if (total > 0) {
                    dto.setPercentage(Math.round((e.getValue() / total * 100) * 10.0) / 10.0);
                } else {
                    dto.setPercentage(0.0);
                }
                return dto;
            })
            .sorted((a, b) -> Double.compare(b.getAmount(), a.getAmount()))
            .collect(Collectors.toList());
    }

    private List<AnalyticsResponseDTO.InsightDTO> generateInsights(List<TrendDataDTO> monthlyTrends) {
        List<AnalyticsResponseDTO.InsightDTO> insights = new ArrayList<>();
        if (monthlyTrends.size() >= 2) {
            TrendDataDTO lastMonth = monthlyTrends.get(monthlyTrends.size() - 2);
            TrendDataDTO thisMonth = monthlyTrends.get(monthlyTrends.size() - 1);
            
            double diff = thisMonth.getExpense() - lastMonth.getExpense();
            if (diff > 0) {
                if (lastMonth.getExpense() > 0) {
                    double pct = (diff / lastMonth.getExpense()) * 100;
                    insights.add(new AnalyticsResponseDTO.InsightDTO(
                        String.format("Expenses increased by %.1f%% this month compared to last month.", pct), "negative"
                    ));
                } else {
                    insights.add(new AnalyticsResponseDTO.InsightDTO("Expenses increased significantly compared to last month (No previous data).", "negative"));
                }
            } else if (diff < 0) {
                if (lastMonth.getExpense() > 0) {
                    double pct = (Math.abs(diff) / lastMonth.getExpense()) * 100;
                    insights.add(new AnalyticsResponseDTO.InsightDTO(
                        String.format("Great job! Expenses decreased by %.1f%% this month.", pct), "positive"
                    ));
                } else {
                     insights.add(new AnalyticsResponseDTO.InsightDTO("Great job! Expenses decreased this month.", "positive"));
                }
            }
        } else {
            insights.add(new AnalyticsResponseDTO.InsightDTO("Not enough historical data to generate monthly comparison insights.", "neutral"));
        }
        return insights;
    }

    private List<AnalyticsResponseDTO.WarningDTO> generateWarnings(AnalyticsResponseDTO.PredictionData prediction, AnalyticsResponseDTO.MonthlyAnalysis monthly, AnalyticsResponseDTO.CategoryAnalysis categories) {
        List<AnalyticsResponseDTO.WarningDTO> warnings = new ArrayList<>();
        
        if (prediction.getPredictedEndBalance() < 0) {
            warnings.add(new AnalyticsResponseDTO.WarningDTO("You are projected to end this month with a negative balance (Deficit).", "high"));
        }
        
        if (monthly.getBalance() < 0) {
            warnings.add(new AnalyticsResponseDTO.WarningDTO("You are currently spending more than your income.", "high"));
        }

        if (categories.getExpenseCategories() != null && !categories.getExpenseCategories().isEmpty()) {
            CategoryBreakdownDTO topCat = categories.getExpenseCategories().get(0);
            if (topCat.getPercentage() > 50.0) {
                warnings.add(new AnalyticsResponseDTO.WarningDTO(
                    String.format("High concentration risk: %s makes up %.1f%% of all your expenses.", topCat.getCategory(), topCat.getPercentage()), "medium"
                ));
            }
        }
        return warnings;
    }
}
