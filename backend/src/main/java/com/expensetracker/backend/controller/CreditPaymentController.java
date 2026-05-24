package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.CreditPaymentDTO;
import com.expensetracker.backend.entity.CreditPayment;
import com.expensetracker.backend.service.CreditPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/credit-payment")
@RequiredArgsConstructor

public class CreditPaymentController {

    private final CreditPaymentService creditPaymentService;

    @GetMapping
    public ResponseEntity<Page<CreditPayment>> getPayments(
            @AuthenticationPrincipal String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(creditPaymentService.getPayments(email, PageRequest.of(page, size)));
    }

    @PostMapping
    public ResponseEntity<CreditPayment> addPayment(
            @AuthenticationPrincipal String email, 
            @Valid @RequestBody CreditPaymentDTO paymentDTO) {
        return ResponseEntity.ok(creditPaymentService.addPayment(email, paymentDTO));
    }

    @DeleteMapping("/{paymentId}")
    public ResponseEntity<Void> deletePayment(
            @AuthenticationPrincipal String email, 
            @PathVariable Long paymentId) {
        creditPaymentService.deletePayment(email, paymentId);
        return ResponseEntity.ok().build();
    }
}
