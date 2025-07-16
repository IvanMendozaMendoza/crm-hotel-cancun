package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Configuration
public class DatabaseSeeder {
    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository, UserService userService) {
        return args -> {
            // Ensure admin user exists and has correct roles
            User admin = userRepository.findByUsername("admin").orElse(null);
            if (admin == null) {
                admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                admin.setPassword("admin123");
            }
            admin.setRoles(Set.of("ADMIN", "USER"));
            admin.setPassword("admin123"); // Will be encoded by service
            userService.registerUser(admin);

            // Ensure regular user exists and has correct roles
            User user = userRepository.findByUsername("user").orElse(null);
            if (user == null) {
                user = new User();
                user.setUsername("user");
                user.setEmail("user@example.com");
                user.setPassword("user123");
            }
            user.setRoles(Set.of("USER"));
            user.setPassword("user123"); // Will be encoded by service
            userService.registerUser(user);
            // Add more seed logic here as needed
        };
    }
} 