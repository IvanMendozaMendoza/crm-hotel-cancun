package com.example.demo.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class SecurityHeadersFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if (response instanceof HttpServletResponse res) {
            // XSS Protection (legacy, but still useful for some browsers)
            res.setHeader("X-XSS-Protection", "1; mode=block");
            // Content Security Policy (modern, highly effective)
            res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'");
            // Prevent MIME type sniffing
            res.setHeader("X-Content-Type-Options", "nosniff");
        }
        chain.doFilter(request, response);
    }
} 