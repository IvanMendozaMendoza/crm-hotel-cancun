package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.model.Role;
import com.example.demo.model.UserRole;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserRoleRepository;
import com.example.demo.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Configuration
public class DatabaseSeeder {
    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository, UserService userService, UserRoleRepository userRoleRepository) {
        return args -> {
            // Seed roles
            String[] roles = {"ADMIN", "USER", "SUPERVISOR", "MANAGER", "GUEST"};
            for (String roleName : roles) {
                userRoleRepository.findByName(roleName)
                    .orElseGet(() -> {
                        UserRole role = new UserRole();
                        role.setName(roleName);
                        return userRoleRepository.save(role);
                    });
            }
            UserRole adminRole = userRoleRepository.findByName("ADMIN").get();
            UserRole userRole = userRoleRepository.findByName("USER").get();
            // Admin user
            User admin = userRepository.findByUsername("admin").orElse(null);
            if (admin == null) {
                admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                admin.setPassword("admin123");
            }
            admin.setRoles(Set.of(adminRole, userRole)); // Admin has both ADMIN and USER roles
            admin.setPassword("admin123"); // Always reset to plain text
            userService.registerUser(admin);
            // Regular user
            User user = userRepository.findByUsername("user").orElse(null);
            if (user == null) {
                user = new User();
                user.setUsername("user");
                user.setEmail("user@example.com");
                user.setPassword("user123");
            }
            user.setRoles(Set.of(userRole)); // User has only USER role
            user.setPassword("user123"); // Always reset to plain text
            userService.registerUser(user);
        };
    }
} 