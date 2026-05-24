package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.CreditTransactionDTO;
import com.expensetracker.backend.entity.CreditTransaction;
import com.expensetracker.backend.service.CreditTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/credit-transaction")
@RequiredArgsConstructor
(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175","https://*.vercel.app"})
public class CreditTransactionController {

    private final CreditTransactionService creditTransactionService;

    @GetMapping
    public ResponseEntity<Page<CreditTransaction>> getTransactions(
            @AuthenticationPrincipal String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(creditTransactionService.getTransactions(email, PageRequest.of(page, size)));
    }

    @PostMapping
    public ResponseEntity<CreditTransaction> addTransaction(
            @AuthenticationPrincipal String email, 
            @Valid @RequestBody CreditTransactionDTO transactionDTO) {
        return ResponseEntity.ok(creditTransactionService.addTransaction(email, transactionDTO));
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(
            @AuthenticationPrincipal String email, 
            @PathVariable Long transactionId) {
        creditTransactionService.deleteTransaction(email, transactionId);
        return ResponseEntity.ok().build();
    }
}
