package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.CreditBillingSummaryDTO;
import com.expensetracker.backend.dto.CreditCardDTO;
import com.expensetracker.backend.entity.CreditCard;
import com.expensetracker.backend.service.CreditCardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/credit-card")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175","https://*.vercel.app"})
public class CreditCardController {

    private final CreditCardService creditCardService;

    @GetMapping
    public ResponseEntity<CreditCard> getCreditCard(@AuthenticationPrincipal String email) {
        CreditCard card = creditCardService.getCreditCard(email);
        if (card != null) {
            return ResponseEntity.ok(card);
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<CreditCard> createOrUpdateCreditCard(
            @AuthenticationPrincipal String email, 
            @Valid @RequestBody CreditCardDTO creditCardDTO) {
        return ResponseEntity.ok(creditCardService.saveOrUpdateCreditCard(email, creditCardDTO));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteCreditCard(@AuthenticationPrincipal String email) {
        creditCardService.deleteCreditCard(email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/billing-summary")
    public ResponseEntity<CreditBillingSummaryDTO> getBillingSummary(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(creditCardService.getBillingSummary(email));
    }
}
