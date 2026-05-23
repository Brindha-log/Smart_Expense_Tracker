package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserIdAndMonth(Long userId, String month);
    Optional<Budget> findByUserIdAndMonthAndCategory(Long userId, String month, String category);
}
