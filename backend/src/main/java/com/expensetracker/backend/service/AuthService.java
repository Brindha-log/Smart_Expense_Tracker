package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.RegisterRequest;
import com.expensetracker.backend.dto.LoginRequest;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.security.JwtService;
import com.expensetracker.backend.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;

    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // HASH PASSWORD
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return "User Registered Successfully";
    }

    public String authenticateAndGetToken(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return null;
        }
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (passwordMatches) {
            return jwtService.generateToken(user.getEmail());
        }
        return null;
    }

    public void changePassword(String email, String oldPassword, String newPassword, String otpCode) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Incorrect old password");
        }
        
        if (!otpService.verifyOtp(email, otpCode)) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void resetPassword(String email, String newPassword, String otpCode) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!otpService.verifyOtp(email, otpCode)) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Single use enforcement
        otpService.clearOtp(email);
    }

    public String updateEmail(String currentEmail, String newEmail, String password, String otpCode) {
        User user = userRepository.findByEmail(currentEmail).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Incorrect password");
        }
        
        if (userRepository.findByEmail(newEmail).isPresent()) {
            throw new RuntimeException("Email is already in use");
        }
        
        if (!otpService.verifyOtp(newEmail, otpCode)) {
            throw new RuntimeException("Invalid or expired OTP for new email");
        }
        
        user.setEmail(newEmail);
        userRepository.save(user);
        
        return jwtService.generateToken(newEmail);
    }
}