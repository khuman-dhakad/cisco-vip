package com.cisco.vip.cybersecurity.controller;

import com.cisco.vip.cybersecurity.dto.AuthRequest;
import com.cisco.vip.cybersecurity.dto.AuthResponse;
import com.cisco.vip.cybersecurity.dto.UserDTO;
import com.cisco.vip.cybersecurity.service.AuthService;
import com.cisco.vip.cybersecurity.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/demo-switch/{username}")
    public ResponseEntity<AuthResponse> demoSwitch(@PathVariable String username) {
        AuthResponse response = authService.switchRoleDemo(username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        UserDTO user = userService.getAllUsers().stream()
                .filter(u -> u.getUsername().equalsIgnoreCase(authentication.getName()))
                .findFirst()
                .orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
}
