package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.RegisterRequest;
import com.expensetracker.backend.dto.LoginRequest;
import com.expensetracker.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        String response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Delegate authentication checking to the service layer
        boolean isAuthenticated = authService.authenticate(loginRequest);

        if (!isAuthenticated) {
            // Returns a 401 Unauthorized status, forcing Axios straight into its catch() block
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid Password");
        }

        // If login is successful, return a 200 OK
        return ResponseEntity.ok("Login successful!");
    }
}