package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.RegisterRequest;
import com.expensetracker.backend.dto.LoginRequest;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

    // CHANGED: Method renamed to 'authenticate' and return type changed to boolean
    public boolean authenticate(LoginRequest request) {

        // 1. Find user by email from the database
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        // If user is not found, return false (authentication failed)
        if (user == null) {
            return false;
        }

        // 2. Check if the raw password matches the hashed password from the database
        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        // Returns true if passwords match, false if they do not
        return passwordMatches;
    }
}