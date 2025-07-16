package com.example.demo.dto;

public class JwtResponse {
    private final String jwt;
    private final String refreshToken;

    public JwtResponse(String jwt, String refreshToken) {
        this.jwt = jwt;
        this.refreshToken = refreshToken;
    }

    public String getJwt() { return jwt; }
    public String getRefreshToken() { return refreshToken; }
} 