package com.cisco.vip.cybersecurity.service;

import com.cisco.vip.cybersecurity.dto.UserCreateRequest;
import com.cisco.vip.cybersecurity.dto.UserDTO;
import com.cisco.vip.cybersecurity.model.Role;
import com.cisco.vip.cybersecurity.model.User;
import com.cisco.vip.cybersecurity.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        return UserDTO.fromEntity(user);
    }

    public UserDTO createUser(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already in use: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use: " + request.getEmail());
        }

        List<String> permissions = request.getPermissions();
        if (permissions == null || permissions.isEmpty()) {
            permissions = getDefaultPermissionsForRole(request.getRole());
        }

        User user = new User(
                request.getUsername(),
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole(),
                request.getDepartment(),
                request.isMfaEnabled(),
                permissions
        );

        User saved = userRepository.save(user);

        auditLogService.logEvent(
                "USER_CREATED",
                "INFO",
                "SECURITY_ADMIN",
                saved.getUsername(),
                saved.getDepartment(),
                "CREATE_USER",
                "SUCCESS",
                "User account " + saved.getUsername() + " created with role " + saved.getRole(),
                "127.0.0.1"
        );

        return UserDTO.fromEntity(saved);
    }

    public UserDTO toggleMfa(String id, boolean mfaEnabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        user.setMfaEnabled(mfaEnabled);
        User saved = userRepository.save(user);

        auditLogService.logEvent(
                "MFA_STATUS_CHANGED",
                "INFO",
                "SECURITY_ADMIN",
                saved.getUsername(),
                "IAM_GATEWAY",
                mfaEnabled ? "ENABLE_MFA" : "DISABLE_MFA",
                "SUCCESS",
                "MFA status updated for user " + saved.getUsername(),
                "127.0.0.1"
        );

        return UserDTO.fromEntity(saved);
    }

    public UserDTO updateRole(String id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        user.setRole(role);
        user.setPermissions(getDefaultPermissionsForRole(role));
        User saved = userRepository.save(user);

        auditLogService.logEvent(
                "ROLE_CHANGED",
                "HIGH",
                "SECURITY_ADMIN",
                saved.getUsername(),
                "RBAC_GATEWAY",
                "ASSIGN_ROLE",
                "SUCCESS",
                "Role changed to " + role + " for user " + saved.getUsername(),
                "127.0.0.1"
        );

        return UserDTO.fromEntity(saved);
    }

    public List<String> getDefaultPermissionsForRole(Role role) {
        List<String> perms = new ArrayList<>();
        if (role == null) return perms;

        switch (role) {
            case SECURITY_ADMIN:
                perms.addAll(Arrays.asList(
                        "VIEW_DASHBOARD", "VIEW_ARCHITECTURE", "MANAGE_IAM", "MANAGE_POLICIES",
                        "RUN_ATTACK_SIMULATION", "CONTAIN_INCIDENTS", "ISOLATE_WORKLOADS",
                        "VIEW_AUDIT_LOGS", "MANAGE_HYBRID_LINK", "VIEW_MONITORING"
                ));
                break;
            case NETWORK_ADMIN:
                perms.addAll(Arrays.asList(
                        "VIEW_DASHBOARD", "VIEW_ARCHITECTURE", "MANAGE_POLICIES", "MANAGE_SEGMENTS",
                        "RUN_ATTACK_SIMULATION", "MANAGE_HYBRID_LINK", "VIEW_MONITORING"
                ));
                break;
            case CLOUD_ADMIN:
                perms.addAll(Arrays.asList(
                        "VIEW_DASHBOARD", "VIEW_ARCHITECTURE", "MANAGE_SEGMENTS", "VIEW_WORKLOADS",
                        "VIEW_MONITORING"
                ));
                break;
            case DEVELOPER:
                perms.addAll(Arrays.asList(
                        "VIEW_DASHBOARD", "VIEW_WORKLOADS", "DEPLOY_APP", "VIEW_LOGS"
                ));
                break;
            case FACULTY:
                perms.addAll(Arrays.asList(
                        "VIEW_DASHBOARD", "ACCESS_TEACHING_PORTAL", "VIEW_GRADES"
                ));
                break;
            case AUDITOR:
                perms.addAll(Arrays.asList(
                        "VIEW_DASHBOARD", "VIEW_ARCHITECTURE", "VIEW_AUDIT_LOGS", "VIEW_POLICIES",
                        "VIEW_INCIDENTS", "VIEW_SECURITY_POSTURE"
                ));
                break;
        }
        return perms;
    }
}
