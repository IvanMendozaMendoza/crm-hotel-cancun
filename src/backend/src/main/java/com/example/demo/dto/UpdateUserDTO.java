package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class UpdateUserDTO {
    @Size(min = 3, message = "Username must be at least 3 characters")
    private String username;

    @Email(message = "Email must be valid")
    private String email;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
} 