package com.expensetracker.backend.controller;

import com.expensetracker.backend.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175","https://*.vercel.app"})
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null) return ResponseEntity.badRequest().body("Email required");
        try {
            otpService.sendOtp(email);
            return ResponseEntity.ok("OTP sent successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to send OTP email: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        if (email == null || code == null) return ResponseEntity.badRequest().body("Email and code required");
        
        boolean isValid = otpService.verifyOtp(email, code);
        if (isValid) {
            return ResponseEntity.ok("OTP verified");
        }
        return ResponseEntity.badRequest().body("Invalid or expired OTP");
    }
}
