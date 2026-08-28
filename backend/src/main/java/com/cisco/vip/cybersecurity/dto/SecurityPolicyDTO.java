package com.cisco.vip.cybersecurity.dto;

import com.cisco.vip.cybersecurity.model.SecurityPolicy;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public class SecurityPolicyDTO {
    private String id;

    @NotBlank(message = "Policy name is required")
    private String name;

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotBlank(message = "Protocol is required")
    private String protocol; // "TCP", "UDP", "ICMP", "ANY"

    @NotBlank(message = "Port is required")
    private String port; // e.g. "443", "ANY"

    @NotBlank(message = "Action is required")
    private String action; // "ALLOW", "DENY"

    private int priority; // 1-1000
    private String description;
    private boolean enabled = true;
    private String scope;
    private String ruleCategory;
    private Instant createdAt;
    private Instant updatedAt;

    public SecurityPolicyDTO() {
    }

    public static SecurityPolicyDTO fromEntity(SecurityPolicy policy) {
        SecurityPolicyDTO dto = new SecurityPolicyDTO();
        dto.setId(policy.getId());
        dto.setName(policy.getName());
        dto.setSource(policy.getSource());
        dto.setDestination(policy.getDestination());
        dto.setProtocol(policy.getProtocol());
        dto.setPort(policy.getPort());
        dto.setAction(policy.getAction());
        dto.setPriority(policy.getPriority());
        dto.setDescription(policy.getDescription());
        dto.setEnabled(policy.isEnabled());
        dto.setScope(policy.getScope());
        dto.setRuleCategory(policy.getRuleCategory());
        dto.setCreatedAt(policy.getCreatedAt());
        dto.setUpdatedAt(policy.getUpdatedAt());
        return dto;
    }

    public SecurityPolicy toEntity() {
        SecurityPolicy policy = new SecurityPolicy();
        policy.setId(this.id);
        policy.setName(this.name);
        policy.setSource(this.source);
        policy.setDestination(this.destination);
        policy.setProtocol(this.protocol != null ? this.protocol.toUpperCase() : "ANY");
        policy.setPort(this.port);
        policy.setAction(this.action != null ? this.action.toUpperCase() : "DENY");
        policy.setPriority(this.priority > 0 ? this.priority : 500);
        policy.setDescription(this.description);
        policy.setEnabled(this.enabled);
        policy.setScope(this.scope != null ? this.scope : "ENTERPRISE_GATEWAY");
        policy.setRuleCategory(this.ruleCategory != null ? this.ruleCategory : "ZERO_TRUST");
        policy.setCreatedAt(this.createdAt != null ? this.createdAt : Instant.now());
        policy.setUpdatedAt(Instant.now());
        return policy;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getRuleCategory() {
        return ruleCategory;
    }

    public void setRuleCategory(String ruleCategory) {
        this.ruleCategory = ruleCategory;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
