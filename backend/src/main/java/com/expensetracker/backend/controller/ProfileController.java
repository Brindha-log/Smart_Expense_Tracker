package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.service.ProfileService;
import com.expensetracker.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175","https://*.vercel.app"})
public class ProfileController {

    private final ProfileService profileService;
    private final AuthService authService;

    private String getAuthenticatedEmail() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        String email = getAuthenticatedEmail();
        User user = profileService.getProfile(email);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        // Exclude password from response
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody User updateDetails) {
        String email = getAuthenticatedEmail();
        User updatedUser = profileService.updateProfile(email, updateDetails);
        updatedUser.setPassword(null);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/update-email")
    public ResponseEntity<?> updateEmail(@RequestBody Map<String, String> request) {
        String newEmail = request.get("newEmail");
        String password = request.get("password");
        String otp = request.get("otp");
        String currentEmail = getAuthenticatedEmail();
        
        if (newEmail == null || password == null || otp == null) {
            return ResponseEntity.badRequest().body("New email, password, and OTP are required");
        }
        
        try {
            String newToken = authService.updateEmail(currentEmail, newEmail, password, otp);
            Map<String, String> response = new HashMap<>();
            response.put("token", newToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
                return ResponseEntity.badRequest().body("Only JPG and PNG are allowed");
            }

            String uploadsDir = "uploads/";
            File dir = new File(uploadsDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = Paths.get(uploadsDir, filename);

            Files.copy(file.getInputStream(), filePath);

            String fileUrl = "/uploads/" + filename;
            profileService.updateProfileImage(getAuthenticatedEmail(), fileUrl);

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", fileUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload image");
        }
    }
}
