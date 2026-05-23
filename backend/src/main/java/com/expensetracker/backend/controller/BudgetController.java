package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.BudgetRequestDTO;
import com.expensetracker.backend.dto.BudgetResponseDTO;
import com.expensetracker.backend.entity.Budget;
import com.expensetracker.backend.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping("/{userId}")
    public ResponseEntity<BudgetResponseDTO> getBudgets(
            @PathVariable Long userId,
            @RequestParam String month) {
        return ResponseEntity.ok(budgetService.getBudgets(userId, month));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Budget> saveBudget(
            @PathVariable Long userId,
            @RequestBody BudgetRequestDTO dto) {
        return ResponseEntity.ok(budgetService.saveOrUpdateBudget(userId, dto));
    }

    @DeleteMapping("/{budgetId}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long budgetId) {
        budgetService.deleteBudget(budgetId);
        return ResponseEntity.ok().build();
    }
}
