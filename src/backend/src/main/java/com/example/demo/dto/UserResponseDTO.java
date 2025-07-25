package com.example.demo.dto;

import java.util.Set;
import java.util.UUID;
import java.time.Instant;

public class UserResponseDTO {
    private UUID id;
    private String username;
    private String email;
    private Set<String> roles;
    private Instant lastSession;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public Instant getLastSession() { return lastSession; }
    public void setLastSession(Instant lastSession) { this.lastSession = lastSession; }
} 