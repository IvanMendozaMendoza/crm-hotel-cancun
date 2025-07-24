package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import com.example.demo.security.JwtUtil;
import com.example.demo.dto.UserResponseDTO;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/v1/users")
public class UsersController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Value("${app.env:dev}")
    private String appEnv;

    @Value("${refresh.token.expiration.seconds:604800}")
    private int refreshTokenExpirationSeconds;

    @Autowired
    public UsersController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
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
        List<UserResponseDTO> users = userService.getAllUsers().stream().map(user -> {
            UserResponseDTO dto = new UserResponseDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setRoles(user.getRoles().stream().map(r -> r.getName()).collect(Collectors.toSet()));
            return dto;
        }).collect(Collectors.toList());
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("results", users.size());
        response.put("users", users);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        if (principal instanceof com.example.demo.model.User user) {
            return ResponseEntity.ok(new java.util.HashMap<>() {
                {
                    put("id", user.getId());
                    put("username", user.getUsername());
                    put("email", user.getEmail());
                    put("roles", user.getRoles().stream().map(r -> r.getName()).toList());
                }
            });
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody Map<String, String> updates, HttpServletResponse response) {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        if (!(principal instanceof com.example.demo.model.User user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        boolean changed = false;
        if (updates.containsKey("username")) {
            user.setUsername(updates.get("username"));
            changed = true;
        }
        if (updates.containsKey("email")) {
            user.setEmail(updates.get("email"));
            changed = true;
        }
        if (changed) {
            userService.registerUser(user); // Save changes
            String jwt = jwtUtil.generateToken(user.getUsername());
            String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
            Cookie jwtCookie = new Cookie("jwt", jwt);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(jwtUtil.getJwtExpirationSeconds());
            jwtCookie.setSecure("prod".equals(appEnv));
            response.addCookie(jwtCookie);
            Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
            refreshCookie.setHttpOnly(true);
            refreshCookie.setPath("/");
            refreshCookie.setMaxAge(refreshTokenExpirationSeconds);
            refreshCookie.setSecure("prod".equals(appEnv));
            response.addCookie(refreshCookie);
            return ResponseEntity.ok(new java.util.HashMap<>() {
                {
                    put("id", user.getId());
                    put("username", user.getUsername());
                    put("email", user.getEmail());
                    put("roles", user.getRoles().stream().map(r -> r.getName()).toList());
                    put("token", jwt);
                    put("refreshToken", refreshToken);
                }
            });
        }
        return ResponseEntity.ok(new java.util.HashMap<>() {
            {
                put("id", user.getId());
                put("username", user.getUsername());
                put("email", user.getEmail());
                put("roles", user.getRoles().stream().map(r -> r.getName()).toList());
            }
        });
    }

    @PatchMapping("/me/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> body, HttpServletResponse response) {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
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
        String jwt = jwtUtil.generateToken(user.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
        Cookie jwtCookie = new Cookie("jwt", jwt);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(jwtUtil.getJwtExpirationSeconds());
        jwtCookie.setSecure("prod".equals(appEnv));
        response.addCookie(jwtCookie);
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(refreshTokenExpirationSeconds);
        refreshCookie.setSecure("prod".equals(appEnv));
        response.addCookie(refreshCookie);
        return ResponseEntity.ok(new java.util.HashMap<>() {
            {
                put("id", user.getId());
                put("username", user.getUsername());
                put("email", user.getEmail());
                put("roles", user.getRoles().stream().map(r -> r.getName()).toList());
                put("token", jwt);
                put("refreshToken", refreshToken);
            }
        });
    }
}