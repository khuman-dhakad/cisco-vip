package com.cisco.vip.cybersecurity.service;

import com.cisco.vip.cybersecurity.dto.AuthRequest;
import com.cisco.vip.cybersecurity.dto.AuthResponse;
import com.cisco.vip.cybersecurity.model.User;
import com.cisco.vip.cybersecurity.repository.UserRepository;
import com.cisco.vip.cybersecurity.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       UserRepository userRepository,
                       AuditLogService auditLogService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUsername()));

        user.setLastLogin(Instant.now());
        userRepository.save(user);

        auditLogService.logEvent(
                "USER_LOGIN_SUCCESS",
                "INFO",
                user.getUsername(),
                "127.0.0.1",
                "IAM_PORTAL",
                "AUTHENTICATE",
                "SUCCESS",
                "User " + user.getUsername() + " successfully authenticated with role " + user.getRole(),
                "127.0.0.1"
        );

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment(),
                user.isMfaEnabled(),
                user.getPermissions()
        );
    }

    public AuthResponse switchRoleDemo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Demo user not found: " + username));

        String jwt = tokenProvider.generateTokenForUsername(user.getUsername());

        auditLogService.logEvent(
                "DEMO_ROLE_SWITCH",
                "INFO",
                user.getUsername(),
                "127.0.0.1",
                "IAM_PORTAL",
                "DEMO_SWITCH",
                "SUCCESS",
                "Switched active demo context to user: " + user.getUsername() + " (" + user.getRole() + ")",
                "127.0.0.1"
        );

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment(),
                user.isMfaEnabled(),
                user.getPermissions()
        );
    }
}
