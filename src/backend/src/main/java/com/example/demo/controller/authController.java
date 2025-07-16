package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import com.example.demo.model.LoginRequest;
import com.example.demo.model.JwtResponse;
import com.example.demo.security.JwtUtil;

@RestController
@RequestMapping("/api/v1/auth")
public class authController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public authController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty() || !userService.checkPassword(userOpt.get(), loginRequest.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        User user = userOpt.get();
        String jwt = jwtUtil.generateToken(user.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
        return ResponseEntity.ok(new JwtResponse(jwt, refreshToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody JwtResponse request) {
        String refreshToken = request.getRefreshToken();
        if (!jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
        String username = jwtUtil.extractUsername(refreshToken);
        Optional<User> userOpt = userService.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        String newJwt = jwtUtil.generateToken(username);
        String newRefreshToken = jwtUtil.generateRefreshToken(username);
        return ResponseEntity.ok(new JwtResponse(newJwt, newRefreshToken));
    }
} 