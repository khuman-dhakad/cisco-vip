package com.cisco.vip.cybersecurity.controller;

import com.cisco.vip.cybersecurity.dto.UserCreateRequest;
import com.cisco.vip.cybersecurity.dto.UserDTO;
import com.cisco.vip.cybersecurity.model.Role;
import com.cisco.vip.cybersecurity.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('SECURITY_ADMIN')")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreateRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    @PatchMapping("/{id}/mfa")
    @PreAuthorize("hasRole('SECURITY_ADMIN')")
    public ResponseEntity<UserDTO> toggleMfa(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        boolean mfa = body.getOrDefault("mfaEnabled", true);
        return ResponseEntity.ok(userService.toggleMfa(id, mfa));
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('SECURITY_ADMIN')")
    public ResponseEntity<UserDTO> updateRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        Role role = Role.valueOf(body.get("role").toUpperCase());
        return ResponseEntity.ok(userService.updateRole(id, role));
    }
}
