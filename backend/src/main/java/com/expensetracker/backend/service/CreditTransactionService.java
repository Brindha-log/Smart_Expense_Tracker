package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.CreditTransactionDTO;
import com.expensetracker.backend.entity.CreditCard;
import com.expensetracker.backend.entity.CreditTransaction;
import com.expensetracker.backend.entity.RecordStatus;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.CreditCardRepository;
import com.expensetracker.backend.repository.CreditTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CreditTransactionService {

    private final CreditTransactionRepository creditTransactionRepository;
    private final CreditCardRepository creditCardRepository;
    private final CreditCardService creditCardService;

    public Page<CreditTransaction> getTransactions(String email, Pageable pageable) {
        User user = creditCardService.getUserByEmail(email);
        CreditCard card = creditCardRepository.findByUserId(user.getId()).orElse(null);
        if (card == null) {
            return Page.empty();
        }
        return creditTransactionRepository.findByCardIdAndStatusOrderByTransactionDateDesc(card.getId(), RecordStatus.ACTIVE, pageable);
    }

    @Transactional
    public CreditTransaction addTransaction(String email, CreditTransactionDTO dto) {
        User user = creditCardService.getUserByEmail(email);
        CreditCard card = creditCardRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Credit card not found for user"));

        if (dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transaction amount must be positive");
        }

        if (card.getAvailableLimit().compareTo(dto.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient available credit limit");
        }

        // Deduct from available limit securely
        card.setAvailableLimit(card.getAvailableLimit().subtract(dto.getAmount()));
        creditCardRepository.save(card);

        CreditTransaction transaction = new CreditTransaction();
        transaction.setCardId(card.getId());
        transaction.setAmount(dto.getAmount());
        transaction.setCategory(dto.getCategory());
        transaction.setMerchant(dto.getMerchant());
        transaction.setTransactionDate(dto.getTransactionDate());
        transaction.setDescription(dto.getDescription());
        transaction.setIsEmi(dto.getIsEmi());
        transaction.setStatus(RecordStatus.ACTIVE);

        return creditTransactionRepository.save(transaction);
    }

    @Transactional
    public void deleteTransaction(String email, Long transactionId) {
        User user = creditCardService.getUserByEmail(email);
        CreditCard card = creditCardRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Credit card not found for user"));

        CreditTransaction transaction = creditTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getCardId().equals(card.getId())) {
            throw new RuntimeException("Unauthorized: Transaction does not belong to user's credit card");
        }

        if (transaction.getStatus() != RecordStatus.ACTIVE) {
            throw new IllegalArgumentException("Transaction is already deleted or reversed");
        }

        // Soft Delete
        transaction.setStatus(RecordStatus.REVERSED);
        
        // Restore available limit securely
        card.setAvailableLimit(card.getAvailableLimit().add(transaction.getAmount()));
        
        creditCardRepository.save(card);
        creditTransactionRepository.save(transaction);
    }
}
