package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.CreditPayment;
import com.expensetracker.backend.entity.RecordStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CreditPaymentRepository extends JpaRepository<CreditPayment, Long> {

    @Query("SELECT p FROM CreditPayment p WHERE p.cardId = :cardId AND p.status = :status ORDER BY p.paymentDate DESC, p.createdAt DESC")
    Page<CreditPayment> findByCardIdAndStatusOrderByPaymentDateDesc(
            @Param("cardId") Long cardId, 
            @Param("status") RecordStatus status, 
            Pageable pageable
    );

    @Query("SELECT p FROM CreditPayment p WHERE p.cardId = :cardId AND p.status = 'ACTIVE' AND p.paymentDate >= :startDate AND p.paymentDate <= :endDate")
    List<CreditPayment> findActivePaymentsInDateRange(
            @Param("cardId") Long cardId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
