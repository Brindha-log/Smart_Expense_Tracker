package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByEmailAndCode(String email, String code);
    Optional<Otp> findFirstByEmailOrderByExpiryTimeDesc(String email);
    
    @Transactional
    void deleteByEmail(String email);
}
