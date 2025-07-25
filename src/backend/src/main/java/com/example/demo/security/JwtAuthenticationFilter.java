package com.example.demo.security;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import io.jsonwebtoken.Claims;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // Extract JWT from Authorization header
        String jwt = null;
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        }
        String userId = null;
        if (jwt != null) {
            userId = jwtUtil.extractUserId(jwt);
        }
        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UUID uuid = UUID.fromString(userId);
                Optional<User> userOpt = userRepository.findById(uuid);
                if (userOpt.isPresent() && jwtUtil.validateToken(jwt)) {
                    User user = userOpt.get();
                    // Check JWT iat vs user.lastSession
                    Claims claims = io.jsonwebtoken.Jwts.parser().verifyWith(jwtUtil.getSigningKey()).build().parseSignedClaims(jwt).getPayload();
                    Instant jwtIat = claims.getIssuedAt().toInstant();
                    if (user.getLastSession() != null && jwtIat.isBefore(user.getLastSession())) {
                        // Token is too old, do not authenticate
                    } else {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                user, null, user.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (IllegalArgumentException e) {
                // Invalid UUID, do nothing (token will be rejected)
            }
        }
        filterChain.doFilter(request, response);
    }
} 