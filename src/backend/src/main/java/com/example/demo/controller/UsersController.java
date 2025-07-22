package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UsersController {
    private final UserService userService;

    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userService.findByUsername(user.getUsername()).isPresent() ||
            userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username or email already exists");
        }
        User savedUser = userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof com.example.demo.model.User user) {
            return ResponseEntity.ok(new java.util.HashMap<>() {{
                put("id", user.getId());
                put("username", user.getUsername());
                put("email", user.getEmail());
                put("role", user.getRole().getName());
            }});
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody Map<String, String> updates) {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof com.example.demo.model.User user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        boolean changed = false;
        if (updates.containsKey("username")) {
            user.setUsername(updates.get("username"));
            changed = true;
        }
        // Do not allow email update anymore
        if (changed) {
            userService.registerUser(user); // Save changes
        }
        return ResponseEntity.ok(new java.util.HashMap<>() {{
            put("id", user.getId());
            put("username", user.getUsername());
            put("email", user.getEmail());
            put("role", user.getRole().getName());
        }});
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/me/email")
    public ResponseEntity<?> updateMyEmail(@RequestBody Map<String, String> updates) {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof com.example.demo.model.User user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        if (!updates.containsKey("email")) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        user.setEmail(updates.get("email"));
        userService.registerUser(user);
        return ResponseEntity.ok(new java.util.HashMap<>() {{
            put("id", user.getId());
            put("username", user.getUsername());
            put("email", user.getEmail());
            put("role", user.getRole().getName());
        }});
    }

    @PatchMapping("/me/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> body) {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof com.example.demo.model.User user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("password");
        String passwordConfirm = body.get("passwordConfirm");
        if (currentPassword == null || newPassword == null || passwordConfirm == null) {
            return ResponseEntity.badRequest().body("All fields are required");
        }
        if (!userService.checkPassword(user, currentPassword)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Current password is incorrect");
        }
        if (!newPassword.equals(passwordConfirm)) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }
        user.setPassword(newPassword);
        userService.registerUser(user);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
} 