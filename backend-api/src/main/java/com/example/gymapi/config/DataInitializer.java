package com.example.gymapi.config;

import com.example.gymapi.entity.User;
import com.example.gymapi.enums.Role;
import com.example.gymapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@gym.com")) {
            User admin = User.builder()
                    .nom("Admin")
                    .prenom("Super")
                    .email("admin@gym.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin créé : admin@gym.com / admin123");
        }
    }
}