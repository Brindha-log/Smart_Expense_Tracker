package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.CreditTransaction;
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
public interface CreditTransactionRepository extends JpaRepository<CreditTransaction, Long> {
    
    @Query("SELECT t FROM CreditTransaction t WHERE t.cardId = :cardId AND t.status = :status ORDER BY t.transactionDate DESC, t.createdAt DESC")
    Page<CreditTransaction> findByCardIdAndStatusOrderByTransactionDateDesc(
            @Param("cardId") Long cardId, 
            @Param("status") RecordStatus status, 
            Pageable pageable
    );

    @Query("SELECT t FROM CreditTransaction t WHERE t.cardId = :cardId AND t.status = 'ACTIVE' AND t.transactionDate >= :startDate AND t.transactionDate <= :endDate")
    List<CreditTransaction> findActiveTransactionsInDateRange(
            @Param("cardId") Long cardId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
