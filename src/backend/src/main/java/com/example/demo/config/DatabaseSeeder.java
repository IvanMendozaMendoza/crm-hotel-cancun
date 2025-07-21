package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.model.Role;
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
            User admin = userRepository.findByUsername("admin").orElse(null);
            if (admin == null) {
                admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                admin.setPassword("admin123");
            }
            admin.setRole(Role.ADMIN);
            admin.setPassword("admin123"); // Always reset to plain text
            userService.registerUser(admin);

            User user = userRepository.findByUsername("user").orElse(null);
            if (user == null) {
                user = new User();
                user.setUsername("user");
                user.setEmail("user@example.com");
                user.setPassword("user123");
            }
            user.setRole(Role.USER);
            user.setPassword("user123"); // Always reset to plain text
            userService.registerUser(user);
        };
    }
} 