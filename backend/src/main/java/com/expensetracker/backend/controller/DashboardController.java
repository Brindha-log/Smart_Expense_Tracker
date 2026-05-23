package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.DashboardResponseDTO;
import com.expensetracker.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/{userId}/{period}")
    public ResponseEntity<DashboardResponseDTO> getDashboardData(
            @PathVariable Long userId,
            @PathVariable String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(dashboardService.getDashboardData(userId, period, startDate, endDate));
    }
}
