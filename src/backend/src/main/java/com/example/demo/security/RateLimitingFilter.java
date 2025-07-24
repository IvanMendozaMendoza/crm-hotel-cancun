package com.example.demo.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class RateLimitingFilter implements Filter {
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @SuppressWarnings("deprecation")
    private Bucket resolveBucket(String key) {
        return buckets.computeIfAbsent(key, k -> Bucket4j.builder()
                .addLimit(Bandwidth.classic(20, Refill.greedy(20, Duration.ofMinutes(1))))
                .build());
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        String ip = ((HttpServletRequest) request).getRemoteAddr();
        Bucket bucket = resolveBucket(ip);

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            HttpServletResponse httpResp = (HttpServletResponse) response;
            httpResp.setStatus(429);
            httpResp.setContentType("application/json");
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("status", "fail");
            errorResponse.put("message", "Too Many Requests");
            ObjectMapper mapper = new ObjectMapper();
            httpResp.getWriter().write(mapper.writeValueAsString(errorResponse));
        }
    }
} 