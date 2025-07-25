package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration.seconds:900}")
    private int jwtExpirationSeconds;

    @Value("${refresh.token.expiration.seconds:604800}")
    private int refreshTokenExpirationSeconds;

    public SecretKey getSigningKey() {
        return (SecretKey) Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    private Date calculateAccessTokenExpirationDate() {
        return new Date(System.currentTimeMillis() + jwtExpirationSeconds * 1000L); // 15  minutes
    }

    private Date calculateRefreshTokenExpirationDate() {
        return new Date(System.currentTimeMillis() + refreshTokenExpirationSeconds * 1000L); // 7 days
    }

    public String generateToken(String userId) {
        return Jwts.builder()
                .subject(userId)
                .issuedAt(new Date())
                .expiration(calculateAccessTokenExpirationDate())
                .signWith(getSigningKey())
                .compact();
    }

    public String generateRefreshToken(String userId) {
        return Jwts.builder()
                .subject(userId)
                .issuedAt(new Date())
                .expiration(calculateRefreshTokenExpirationDate())
                .signWith(getSigningKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
        return claimsResolver.apply(claims);
    }

    public int getJwtExpirationSeconds() { return jwtExpirationSeconds; }
} 