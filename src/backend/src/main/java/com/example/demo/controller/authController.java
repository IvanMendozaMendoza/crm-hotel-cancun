package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.Bean;

import java.util.Optional;
import com.example.demo.dto.LoginRequest;
import com.example.demo.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;

import java.util.Map;
import java.util.LinkedHashMap;
import java.util.UUID;
import java.time.Instant;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/v1/auth")
public class authController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Value("${app.env:dev}")
    private String appEnv;

    @Value("${refresh.token.expiration.seconds:604800}")
    private int refreshTokenExpirationSeconds;

    @Value("${frontend.origin:http://localhost:3000}")
    private String frontendOrigin;

    @Autowired
    public authController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty() || !userService.checkPassword(userOpt.get(), loginRequest.getPassword())) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("status", "fail");
            errorResponse.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
        User user = userOpt.get();
        String jwt = jwtUtil.generateToken(user.getId().toString());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId().toString());
        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("email", user.getEmail());
        // userMap.put("last_session", user.getLastSession());
        userMap.put("roles", user.getRoles().stream().map(r -> r.getName()).toList());
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("user", userMap);
        response.put("token", jwt);
        response.put("refreshToken", refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request, HttpServletResponse response) {
        String refreshToken = request.get("refreshToken");
        if (!jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
        String userId = jwtUtil.extractUserId(refreshToken);
        Optional<User> userOpt = userService.findById(UUID.fromString(userId));
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        User user = userOpt.get();
        String newJwt = jwtUtil.generateToken(user.getId().toString());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getId().toString());
        // Set new tokens as cookies
        Cookie jwtCookie = new Cookie("jwt", newJwt);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(jwtUtil.getJwtExpirationSeconds());
        jwtCookie.setSecure("prod".equals(appEnv));
        response.addCookie(jwtCookie);

        Cookie refreshCookie = new Cookie("refreshToken", newRefreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(refreshTokenExpirationSeconds);
        refreshCookie.setSecure("prod".equals(appEnv));
        response.addCookie(refreshCookie);
        // Return user info (not tokens)
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "last_session", user.getLastSession(),
            "roles", user.getRoles().stream().map(r -> r.getName()).toList()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            user.setLastSession(Instant.now());
            userService.registerUser(user);
        }
        Cookie jwtCookie = new Cookie("jwt", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);
        jwtCookie.setSecure("prod".equals(appEnv));
        response.addCookie(jwtCookie);

        Cookie refreshCookie = new Cookie("refreshToken", null);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(0);
        refreshCookie.setSecure("prod".equals(appEnv));
        response.addCookie(refreshCookie);

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("status", "success");
        resp.put("message", "Logged out");
        return ResponseEntity.ok(resp);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(frontendOrigin)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                        .allowCredentials(true);
            }
        };
    }
}