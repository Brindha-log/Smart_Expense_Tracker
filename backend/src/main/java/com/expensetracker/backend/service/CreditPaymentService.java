package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.CreditPaymentDTO;
import com.expensetracker.backend.entity.CreditCard;
import com.expensetracker.backend.entity.CreditPayment;
import com.expensetracker.backend.entity.RecordStatus;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.CreditCardRepository;
import com.expensetracker.backend.repository.CreditPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CreditPaymentService {

    private final CreditPaymentRepository creditPaymentRepository;
    private final CreditCardRepository creditCardRepository;
    private final CreditCardService creditCardService;

    public Page<CreditPayment> getPayments(String email, Pageable pageable) {
        User user = creditCardService.getUserByEmail(email);
        CreditCard card = creditCardRepository.findByUserId(user.getId()).orElse(null);
        if (card == null) {
            return Page.empty();
        }
        return creditPaymentRepository.findByCardIdAndStatusOrderByPaymentDateDesc(card.getId(), RecordStatus.ACTIVE, pageable);
    }

    @Transactional
    public CreditPayment addPayment(String email, CreditPaymentDTO dto) {
        User user = creditCardService.getUserByEmail(email);
        CreditCard card = creditCardRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Credit card not found for user"));

        if (dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive");
        }

        BigDecimal outstandingBalance = card.getCreditLimit().subtract(card.getAvailableLimit());
        if (dto.getAmount().compareTo(outstandingBalance) > 0) {
            throw new IllegalArgumentException("Payment amount cannot exceed the outstanding balance of ₹" + outstandingBalance);
        }

        // Increase available limit securely
        card.setAvailableLimit(card.getAvailableLimit().add(dto.getAmount()));
        creditCardRepository.save(card);

        CreditPayment payment = new CreditPayment();
        payment.setCardId(card.getId());
        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setStatus(RecordStatus.ACTIVE);

        return creditPaymentRepository.save(payment);
    }

    @Transactional
    public void deletePayment(String email, Long paymentId) {
        User user = creditCardService.getUserByEmail(email);
        CreditCard card = creditCardRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Credit card not found for user"));

        CreditPayment payment = creditPaymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!payment.getCardId().equals(card.getId())) {
            throw new RuntimeException("Unauthorized: Payment does not belong to user's credit card");
        }

        if (payment.getStatus() != RecordStatus.ACTIVE) {
            throw new IllegalArgumentException("Payment is already deleted or reversed");
        }

        // Deduct from available limit (since we are reversing a payment, limit drops)
        if (card.getAvailableLimit().subtract(payment.getAmount()).compareTo(BigDecimal.ZERO) < 0) {
             throw new IllegalArgumentException("Cannot reverse payment: doing so would result in negative available limit");
        }

        card.setAvailableLimit(card.getAvailableLimit().subtract(payment.getAmount()));
        
        // Soft delete
        payment.setStatus(RecordStatus.REVERSED);

        creditCardRepository.save(card);
        creditPaymentRepository.save(payment);
    }
}
