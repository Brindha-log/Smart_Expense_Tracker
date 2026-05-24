package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175","https://*.vercel.app"})
public class UserController {

    private final UserRepository userRepository;

    @PutMapping("/{id}/income")
    public ResponseEntity<User> setIncome(@PathVariable Long id, @RequestBody Map<String, Double> payload) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setMonthlyIncome(payload.get("monthlyIncome"));
        return ResponseEntity.ok(userRepository.save(user));
    }
}
