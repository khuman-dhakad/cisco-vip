package com.cisco.vip.cybersecurity.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "securityPolicies")
public class SecurityPolicy {

    @Id
    private String id;
    private String name;
    private String source; // e.g. "10.10.10.0/24", "WORKLOAD:APP_A", "ROLE:FACULTY", "0.0.0.0/0", "VPC:VPC_3"
    private String destination; // e.g. "10.10.30.0/24", "WORKLOAD:APP_B", "WORKLOAD:DATABASE_CORE"
    private String protocol; // "TCP", "UDP", "ICMP", "ANY"
    private String port; // e.g. "443", "5432", "80", "22", "ANY"
    private String action; // "ALLOW", "DENY"
    private int priority; // 1 to 1000 (lower number = higher precedence)
    private String description;
    private boolean enabled = true;
    private String scope; // "ENTERPRISE_GATEWAY", "HYBRID_LINK", "PRIVATE_DC", "PUBLIC_CLOUD_SG", "K8S_NETWORK_POLICY"
    private String ruleCategory; // "ZERO_TRUST", "MICROSEGMENTATION", "IAM_EGRESS", "LATERAL_CONTAINMENT"
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public SecurityPolicy() {
    }

    public SecurityPolicy(String name, String source, String destination, String protocol, String port, String action, int priority, String description, boolean enabled, String scope, String ruleCategory) {
        this.name = name;
        this.source = source;
        this.destination = destination;
        this.protocol = protocol;
        this.port = port;
        this.action = action;
        this.priority = priority;
        this.description = description;
        this.enabled = enabled;
        this.scope = scope;
        this.ruleCategory = ruleCategory;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
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
