package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Otp;
import com.expensetracker.backend.repository.OtpRepository;
import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;

    @Value("${resend.api.key}")
    private String resendApiKey;

    public void sendOtp(String email) {
        // Enforce cooldown (e.g., 60 seconds)
        Optional<Otp> existingOtp = otpRepository.findFirstByEmailOrderByExpiryTimeDesc(email);
        if (existingOtp.isPresent()) {
            LocalDateTime sentTime = existingOtp.get().getExpiryTime().minusMinutes(5);
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

        // Send email via Resend HTTP API
        Resend resend = new Resend(resendApiKey);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("onboarding@resend.dev")
                .to(email)
                .subject("Your Verification Code - Smart Expense Tracker")
                .html("<p>Your OTP code is: <strong>" + otpCode + "</strong></p><p>This code will expire in 5 minutes.</p>")
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(params);
        } catch (Exception e) {
            throw new RuntimeException("Mail server connection failed. " + e.getMessage());
        }
    }

    public boolean verifyOtp(String email, String code) {
        Optional<Otp> otpOptional = otpRepository.findFirstByEmailOrderByExpiryTimeDesc(email);

        if (otpOptional.isPresent()) {
            Otp otp = otpOptional.get();

            if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
                return false;
            }

            if (otp.isVerified()) {
                return otp.getCode().equals(code);
            }

            if (otp.getAttempts() >= 3) {
                return false;
            }

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
        otpRepository.deleteByEmail(email);
    }

    public boolean isVerified(String email) {
        return otpRepository.findAll().stream()
                .anyMatch(o -> o.getEmail().equals(email) && o.isVerified() && o.getExpiryTime().plusMinutes(10).isAfter(LocalDateTime.now()));
    }
}
