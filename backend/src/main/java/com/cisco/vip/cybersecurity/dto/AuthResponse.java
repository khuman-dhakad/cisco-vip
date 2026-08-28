package com.cisco.vip.cybersecurity.dto;

import com.cisco.vip.cybersecurity.model.Role;

import java.util.List;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private String userId;
    private String username;
    private String fullName;
    private String email;
    private Role role;
    private String department;
    private boolean mfaEnabled;
    private List<String> permissions;

    public AuthResponse() {
    }

    public AuthResponse(String token, String userId, String username, String fullName, String email, Role role, String department, boolean mfaEnabled, List<String> permissions) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.department = department;
        this.mfaEnabled = mfaEnabled;
        this.permissions = permissions;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public boolean isMfaEnabled() {
        return mfaEnabled;
    }

    public void setMfaEnabled(boolean mfaEnabled) {
        this.mfaEnabled = mfaEnabled;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }
}
