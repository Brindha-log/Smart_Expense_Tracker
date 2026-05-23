package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findAllByOrderByDateDesc();

    Page<Expense> findByUserId(Long userId, Pageable pageable);

    List<Expense> findByUserIdOrderByDateDesc(Long userId);

    @Modifying
    @Query("DELETE FROM Expense e WHERE e.userId = :userId")
    void deleteAllByUserId(Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.userId = :userId AND e.type = 'income'")
    Double sumIncomeByUserId(Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.userId = :userId AND e.type = 'expense'")
    Double sumExpenseByUserId(Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.userId = :userId AND e.type = 'income' AND EXTRACT(MONTH FROM e.date) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM e.date) = EXTRACT(YEAR FROM CURRENT_DATE)")
    Double sumIncomeByUserIdAndCurrentMonth(Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.userId = :userId AND e.type = 'expense' AND EXTRACT(MONTH FROM e.date) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM e.date) = EXTRACT(YEAR FROM CURRENT_DATE)")
    Double sumExpenseByUserIdAndCurrentMonth(Long userId);

    @Query("SELECT new com.expensetracker.backend.dto.CategoryBreakdownDTO(e.category, SUM(e.amount)) " +
           "FROM Expense e WHERE e.userId = :userId AND e.type = :type GROUP BY e.category ORDER BY SUM(e.amount) DESC")
    List<com.expensetracker.backend.dto.CategoryBreakdownDTO> findCategoryBreakdown(Long userId, String type);

    @Query("SELECT e FROM Expense e WHERE e.userId = :userId AND e.date >= :startDate AND e.date <= :endDate ORDER BY e.date ASC")
    List<Expense> findByUserIdAndDateBetween(Long userId, java.time.LocalDate startDate, java.time.LocalDate endDate);
}