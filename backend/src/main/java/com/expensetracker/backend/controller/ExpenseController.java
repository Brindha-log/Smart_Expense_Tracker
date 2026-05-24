package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.FinancialSummaryDTO;
import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor

public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Expense>> getAllExpenses(@PathVariable Long userId) {
        return ResponseEntity.ok(expenseService.getAllExpensesByUserId(userId));
    }

    @GetMapping("/user/{userId}/filter")
    public ResponseEntity<List<Expense>> getExpensesByMonth(
            @PathVariable Long userId,
            @RequestParam int month,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(expenseService.getExpensesByMonth(userId, month, year));
    }
    
    @GetMapping("/user/{userId}/page")
    public ResponseEntity<Page<Expense>> getExpensesPage(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(expenseService.getExpensesByUserId(userId, PageRequest.of(page, size)));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Expense> addExpense(@PathVariable Long userId, @RequestBody Expense expense) {
        expense.setUserId(userId);
        return ResponseEntity.ok(expenseService.saveExpense(expense));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.updateExpense(id, expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/user/{userId}/clear-csv")
    public ResponseEntity<Void> clearUserExpenses(@PathVariable Long userId) {
        expenseService.deleteExpensesByUserId(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<FinancialSummaryDTO> getSummary(@PathVariable Long userId) {
        return ResponseEntity.ok(expenseService.getFinancialSummary(userId));
    }

    @PostMapping("/user/{userId}/upload-csv")
    public ResponseEntity<String> uploadCsv(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        expenseService.processCsv(file, userId);
        return ResponseEntity.ok("File uploaded successfully");
    }
}
