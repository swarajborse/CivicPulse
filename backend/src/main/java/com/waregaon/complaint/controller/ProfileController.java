package com.waregaon.complaint.controller;

import com.waregaon.complaint.dto.UpdateProfileRequest;
import com.waregaon.complaint.dto.UserResponse;
import com.waregaon.complaint.entity.User;
import com.waregaon.complaint.repository.UserRepository;
import com.waregaon.complaint.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserResponse resp = new UserResponse();
        resp.setId(user.getId());
        resp.setEmail(user.getEmail());
        resp.setFullName(user.getFullName());
        resp.setPhone(user.getPhone());
        resp.setRole(user.getRole().name());
        resp.setEnabled(user.isEnabled());
        resp.setVillage(user.getVillage());
        resp.setAddress(user.getAddress());
        resp.setAvatarUrl(user.getAvatarUrl());
        return ResponseEntity.ok(resp);
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        authService.updateProfile(authentication.getName(), request);
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserResponse resp = new UserResponse();
        resp.setId(user.getId());
        resp.setEmail(user.getEmail());
        resp.setFullName(user.getFullName());
        resp.setPhone(user.getPhone());
        resp.setRole(user.getRole().name());
        resp.setEnabled(user.isEnabled());
        resp.setVillage(user.getVillage());
        resp.setAddress(user.getAddress());
        resp.setAvatarUrl(user.getAvatarUrl());
        return ResponseEntity.ok(resp);
    }
}
