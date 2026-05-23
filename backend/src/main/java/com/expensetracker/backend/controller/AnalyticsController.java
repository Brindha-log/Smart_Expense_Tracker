package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.AnalyticsResponseDTO;
import com.expensetracker.backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175","https://smart-expense-tracker-2e5eak46q-brindha-s-projects1.vercel.app"})
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/{userId}")
    public ResponseEntity<AnalyticsResponseDTO> getAnalytics(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "monthly") String period) {
        return ResponseEntity.ok(analyticsService.getAnalytics(userId, period));
    }
}
