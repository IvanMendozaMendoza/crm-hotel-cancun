package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.model.UserRepository;
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
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                admin.setPassword("admin123");
                admin.setRoles(Set.of("ADMIN", "USER"));
                userService.registerUser(admin);
            }
            if (userRepository.findByUsername("user").isEmpty()) {
                User user = new User();
                user.setUsername("user");
                user.setEmail("user@example.com");
                user.setPassword("user123");
                user.setRoles(Set.of("USER"));
                userService.registerUser(user);
            }
            // Add more seed logic here as needed
        };
    }
} 