package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Otp;
import com.expensetracker.backend.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final JavaMailSender mailSender;

    public void sendOtp(String email) {
        // Enforce cooldown (e.g., 60 seconds)
        Optional<Otp> existingOtp = otpRepository.findFirstByEmailOrderByExpiryTimeDesc(email);
        if (existingOtp.isPresent()) {
            LocalDateTime sentTime = existingOtp.get().getExpiryTime().minusMinutes(5); // Original sent time
            if (sentTime.plusSeconds(60).isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Please wait at least 60 seconds before requesting a new OTP.");
            }
        }

        // Generate 6 digit OTP
        String otpCode = String.format("%06d", new Random().nextInt(999999));
        
        // Remove existing OTPs for email
        otpRepository.deleteByEmail(email);
        
        // Save new OTP
        Otp otp = new Otp(email, otpCode, LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otp);
        
        // Send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your Verification Code - Smart Expense Tracker");
        message.setText("Your OTP code is: " + otpCode + "\n\nThis code will expire in 5 minutes.");
        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String code) {
        Optional<Otp> otpOptional = otpRepository.findFirstByEmailOrderByExpiryTimeDesc(email);
        
        if (otpOptional.isPresent()) {
            Otp otp = otpOptional.get();
            
            // Check expiry
            if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
                return false;
            }

            // Check if already used
            if (otp.isVerified()) {
                // If it was already successfully verified but not consumed, it's still "valid" for the password reset flow.
                // However, we also enforce single-use by deleting it AFTER reset. 
                // So returning true here if code matches (or if it's just checking).
                return otp.getCode().equals(code);
            }

            // Check max attempts
            if (otp.getAttempts() >= 3) {
                return false;
            }

            // Increment attempts
            otp.setAttempts(otp.getAttempts() + 1);
            
            if (otp.getCode().equals(code)) {
                otp.setVerified(true);
                otpRepository.save(otp);
                return true;
            } else {
                otpRepository.save(otp);
                return false;
            }
        }
        return false;
    }

    public void clearOtp(String email) {
        // Hard delete after successful use
        otpRepository.deleteByEmail(email);
    }
    
    public boolean isVerified(String email) {
        // check if there's a verified OTP within last 10 minutes
        // For simplicity, we just find any verified OTP that hasn't expired too long ago
        return otpRepository.findAll().stream()
                .anyMatch(o -> o.getEmail().equals(email) && o.isVerified() && o.getExpiryTime().plusMinutes(10).isAfter(LocalDateTime.now()));
    }
}
