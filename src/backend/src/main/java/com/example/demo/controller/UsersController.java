package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import com.example.demo.security.JwtUtil;
import com.example.demo.dto.UserResponseDTO;
import com.example.demo.dto.CreateUserDTO;
import com.example.demo.model.UserRole;
import com.example.demo.repository.UserRoleRepository;
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
import java.util.HashSet;
import java.util.Set;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
public class UsersController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final UserRoleRepository userRoleRepository;

    @Value("${app.env:dev}")
    private String appEnv;

    @Value("${refresh.token.expiration.seconds:604800}")
    private int refreshTokenExpirationSeconds;

    @Autowired
    public UsersController(UserService userService, JwtUtil jwtUtil, UserRoleRepository userRoleRepository) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.userRoleRepository = userRoleRepository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserDTO dto) {
        if (userService.findByUsername(dto.getUsername()).isPresent() ||
                userService.findByEmail(dto.getEmail()).isPresent()) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("status", "fail");
            errorResponse.put("message", "Username or email already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        Set<UserRole> roles = new HashSet<>();
        if (dto.getRoles() != null) {
            for (String roleName : dto.getRoles()) {
                UserRole role = userRoleRepository.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                roles.add(role);
            }
        }
        user.setRoles(roles);
        User savedUser = userService.registerUser(user);
        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("id", savedUser.getId());
        userMap.put("username", savedUser.getUsername());
        userMap.put("email", savedUser.getEmail());
        userMap.put("roles", savedUser.getRoles().stream().map(r -> r.getName()).toList());
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("status", "success");
        resp.put("user", userMap);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
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
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof com.example.demo.model.User user) {
            Map<String, Object> userMap = new LinkedHashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("roles", user.getRoles().stream().map(r -> r.getName()).toList());
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "success");
            response.put("user", userMap);
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("status", "fail");
            errorResponse.put("message", "User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody Map<String, String> updates, HttpServletResponse response) {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof com.example.demo.model.User user)) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("status", "fail");
            errorResponse.put("message", "User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
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
            Map<String, Object> userMap = new LinkedHashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("roles", user.getRoles().stream().map(r -> r.getName()).toList());
            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("status", "success");
            resp.put("user", userMap);
            resp.put("token", jwt);
            resp.put("refreshToken", refreshToken);
            return ResponseEntity.ok(resp);
        }
        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("email", user.getEmail());
        userMap.put("roles", user.getRoles().stream().map(r -> r.getName()).toList());
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("status", "success");
        resp.put("user", userMap);
        return ResponseEntity.ok(resp);
    }

    @PatchMapping("/me/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> body, HttpServletResponse response) {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof com.example.demo.model.User user)) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("status", "fail");
            errorResponse.put("message", "User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("password");
        String passwordConfirm = body.get("passwordConfirm");
        if (currentPassword == null || newPassword == null || passwordConfirm == null) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("status", "fail");
            errorResponse.put("message", "All fields are required");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        if (!userService.checkPassword(user, currentPassword)) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("status", "fail");
            errorResponse.put("message", "Current password is incorrect");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        }
        if (!newPassword.equals(passwordConfirm)) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("status", "fail");
            errorResponse.put("message", "Passwords do not match");
            return ResponseEntity.badRequest().body(errorResponse);
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
        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("email", user.getEmail());
        userMap.put("roles", user.getRoles().stream().map(r -> r.getName()).toList());
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("status", "success");
        resp.put("user", userMap);
        resp.put("token", jwt);
        resp.put("refreshToken", refreshToken);
        return ResponseEntity.ok(resp);
    }
}