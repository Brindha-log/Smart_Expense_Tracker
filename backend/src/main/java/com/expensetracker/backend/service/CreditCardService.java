package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.CreditBillingSummaryDTO;
import com.expensetracker.backend.dto.CreditCardDTO;
import com.expensetracker.backend.entity.CreditCard;
import com.expensetracker.backend.entity.CreditPayment;
import com.expensetracker.backend.entity.CreditTransaction;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.CreditCardRepository;
import com.expensetracker.backend.repository.CreditPaymentRepository;
import com.expensetracker.backend.repository.CreditTransactionRepository;
import com.expensetracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreditCardService {

    private final CreditCardRepository creditCardRepository;
    private final UserRepository userRepository;
    private final CreditTransactionRepository creditTransactionRepository;
    private final CreditPaymentRepository creditPaymentRepository;

    @Value("${credit.card.minimum.due.percentage:5.0}")
    private BigDecimal minimumDuePercentage;

    public CreditCard getCreditCard(String email) {
        User user = getUserByEmail(email);
        return creditCardRepository.findByUserId(user.getId()).orElse(null);
    }

    @Transactional
    public CreditCard saveOrUpdateCreditCard(String email, CreditCardDTO dto) {
        User user = getUserByEmail(email);
        CreditCard existingCard = creditCardRepository.findByUserId(user.getId()).orElse(null);

        if (existingCard != null) {
            existingCard.setCardName(dto.getCardName());
            existingCard.setBankName(dto.getBankName());
            existingCard.setCardType(dto.getCardType());
            existingCard.setBillingDate(dto.getBillingDate());
            existingCard.setDueDate(dto.getDueDate());
            existingCard.setInterestRate(dto.getInterestRate());
            // creditLimit and availableLimit are NOT manually updated here to prevent inconsistencies
            return creditCardRepository.save(existingCard);
        } else {
            CreditCard newCard = new CreditCard();
            newCard.setUserId(user.getId());
            newCard.setCardName(dto.getCardName());
            newCard.setBankName(dto.getBankName());
            newCard.setCardType(dto.getCardType());
            newCard.setCreditLimit(dto.getCreditLimit());
            newCard.setAvailableLimit(dto.getCreditLimit()); // Initially full limit
            newCard.setBillingDate(dto.getBillingDate());
            newCard.setDueDate(dto.getDueDate());
            newCard.setInterestRate(dto.getInterestRate());
            return creditCardRepository.save(newCard);
        }
    }

    @Transactional
    public void deleteCreditCard(String email) {
        User user = getUserByEmail(email);
        creditCardRepository.findByUserId(user.getId()).ifPresent(creditCardRepository::delete);
    }

    public CreditBillingSummaryDTO getBillingSummary(String email) {
        User user = getUserByEmail(email);
        CreditCard card = creditCardRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Credit card not found"));

        int billingDate = card.getBillingDate();
        LocalDate today = LocalDate.now();

        LocalDate cycleEnd;
        LocalDate cycleStart;

        // Calculate billing cycle boundaries safely using YearMonth to prevent invalid dates (e.g. Feb 31)
        if (today.getDayOfMonth() <= billingDate) {
            cycleEnd = resolveSafeDate(today.getYear(), today.getMonthValue(), billingDate);
            YearMonth prevMonth = YearMonth.from(today).minusMonths(1);
            cycleStart = resolveSafeDate(prevMonth.getYear(), prevMonth.getMonthValue(), billingDate).plusDays(1);
        } else {
            YearMonth nextMonth = YearMonth.from(today).plusMonths(1);
            cycleEnd = resolveSafeDate(nextMonth.getYear(), nextMonth.getMonthValue(), billingDate);
            cycleStart = resolveSafeDate(today.getYear(), today.getMonthValue(), billingDate).plusDays(1);
        }

        // Fetch transactions and payments in current cycle
        List<CreditTransaction> cycleTransactions = creditTransactionRepository
                .findActiveTransactionsInDateRange(card.getId(), cycleStart, cycleEnd);
        List<CreditPayment> cyclePayments = creditPaymentRepository
                .findActivePaymentsInDateRange(card.getId(), cycleStart, cycleEnd);

        BigDecimal currentBillAmount = cycleTransactions.stream()
                .map(CreditTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPayments = cyclePayments.stream()
                .map(CreditPayment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Derive Outstanding Balance based on used limit
        // Outstanding Balance = Credit Limit - Available Limit
        BigDecimal outstandingBalance = card.getCreditLimit().subtract(card.getAvailableLimit());
        
        // Ensure outstanding balance doesn't show slightly negative due to precision
        if (outstandingBalance.compareTo(BigDecimal.ZERO) < 0) {
            outstandingBalance = BigDecimal.ZERO;
        }

        // Minimum due calculation
        BigDecimal minimumDue = outstandingBalance.multiply(minimumDuePercentage).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        // Carry forward approx
        BigDecimal previousOutstanding = outstandingBalance.subtract(currentBillAmount).add(totalPayments);
        if (previousOutstanding.compareTo(BigDecimal.ZERO) < 0) {
            previousOutstanding = BigDecimal.ZERO;
        }

        CreditBillingSummaryDTO summary = new CreditBillingSummaryDTO();
        summary.setBillingCycleStart(cycleStart);
        summary.setBillingCycleEnd(cycleEnd);
        summary.setCurrentBillAmount(currentBillAmount);
        summary.setTotalPayments(totalPayments);
        summary.setOutstandingBalance(outstandingBalance);
        summary.setMinimumDue(minimumDue);
        summary.setRemainingLimit(card.getAvailableLimit());
        summary.setCarryForwardUnpaidBalance(previousOutstanding);
        summary.setRemainingPayableAmount(outstandingBalance);

        // Architectural Note: This is a dynamically derived billing snapshot. Modifying historical transactions 
        // will retroactively alter these figures. For an immutable ledger, generating and saving statement entities is required.

        return summary;
    }

    protected User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Unauthorized: User not found"));
    }

    private LocalDate resolveSafeDate(int year, int month, int targetDay) {
        YearMonth ym = YearMonth.of(year, month);
        int safeDay = Math.min(targetDay, ym.lengthOfMonth());
        return LocalDate.of(year, month, safeDay);
    }
}
