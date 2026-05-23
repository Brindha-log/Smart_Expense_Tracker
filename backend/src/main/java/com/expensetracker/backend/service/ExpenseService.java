package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.FinancialSummaryDTO;
import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public Page<Expense> getExpensesByUserId(Long userId, Pageable pageable) {
        return expenseRepository.findByUserId(userId, pageable);
    }

    public List<Expense> getAllExpensesByUserId(Long userId) {
        return expenseRepository.findByUserIdOrderByDateDesc(userId);
    }

    public List<Expense> getExpensesByMonth(Long userId, int month, int year) {
        return expenseRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .filter(e -> e.getDate().getMonthValue() == month && e.getDate().getYear() == year)
                .collect(java.util.stream.Collectors.toList());
    }

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        return expenseRepository.findById(id).map(expense -> {
            expense.setTitle(updatedExpense.getTitle());
            expense.setAmount(updatedExpense.getAmount());
            expense.setCategory(updatedExpense.getCategory());
            expense.setDate(updatedExpense.getDate());
            expense.setType(updatedExpense.getType());
            return expenseRepository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    @Transactional
    public void deleteExpensesByUserId(Long userId) {
        expenseRepository.deleteAllByUserId(userId);
    }

    public FinancialSummaryDTO getFinancialSummary(Long userId) {

        List<Expense> expensesList = expenseRepository.findByUserIdOrderByDateDesc(userId);

        double totalIncome = 0;
        double totalExpense = 0;

        for (Expense expense : expensesList) {

            if ("income".equalsIgnoreCase(expense.getType())) {
                totalIncome += expense.getAmount();
            }

            else if ("expense".equalsIgnoreCase(expense.getType())) {
                totalExpense += expense.getAmount();
            }
        }

        double balance = totalIncome - totalExpense;

        return new FinancialSummaryDTO(
                balance,
                totalIncome,
                totalExpense
        );
    }
    
    @Transactional
    public void processCsv(MultipartFile file, Long userId) {
        System.out.println("Processing CSV for userId: " + userId);
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            // 1. delete old records for current user
            expenseRepository.deleteAllByUserId(userId);
            
            String line;
            boolean isFirstLine = true;
            List<Expense> expenses = new ArrayList<>();
            while ((line = reader.readLine()) != null) {
                System.out.println("Line: " + line);
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }
                String[] data = line.split(",");
                if (data.length >= 4) {
                    Expense expense = new Expense();
                    expense.setTitle(data[0].trim());
                    expense.setAmount(Double.parseDouble(data[1].trim()));
                    expense.setCategory(data[2].trim());
                    expense.setDate(LocalDate.parse(data[3].trim()));
                    if (data.length >= 5) {
                        expense.setType(data[4].trim());
                    } else {
                        expense.setType("expense");
                    }
                    expense.setUserId(userId);
                    expenses.add(expense);
                    System.out.println("Added expense: " + expense.getTitle());
                } else {
                    System.out.println("Invalid line length: " + data.length);
                }
            }
            expenseRepository.saveAll(expenses);
            System.out.println("Saved " + expenses.size() + " expenses to DB");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to process CSV file: " + e.getMessage());
        }
    }
}