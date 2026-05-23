package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    public User getProfile(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User updateProfile(String email, User updateDetails) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (updateDetails.getName() != null) user.setName(updateDetails.getName());
        if (updateDetails.getPhoneNumber() != null) user.setPhoneNumber(updateDetails.getPhoneNumber());
        if (updateDetails.getCurrency() != null) user.setCurrency(updateDetails.getCurrency());
        return userRepository.save(user);
    }

    public void updateProfileImage(String email, String imagePath) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfileImage(imagePath);
        userRepository.save(user);
    }
}
