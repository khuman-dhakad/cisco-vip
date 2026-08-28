package com.cisco.vip.cybersecurity.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "networkSegments")
public class NetworkSegment {

    @Id
    private String id;
    private String name; // e.g. "Private DC - Management", "Private DC - App Segment A", "Public Cloud - VPC 1 (Prod Web)"
    private String environment; // "PRIVATE_DATACENTER", "PUBLIC_CLOUD"
    private String cidr; // "10.10.0.0/24", "10.10.10.0/24", "10.20.1.0/24", etc.
    private String vpcId; // e.g. "VPC-CORE-DC", "VPC-PROD-WEB", "VPC-K8S-MICRO", "VPC-ANALYTICS"
    private String subnetType; // "MANAGEMENT", "APPLICATION", "DATABASE", "PUBLIC_WEB", "MICROSERVICES", "ANALYTICS"
    private boolean isolationMode = false; // Emergency network quarantine flag
    private int workloadCount;
    private String description;
    private List<String> allowedInbound;
    private List<String> allowedOutbound;
    private String status; // "HEALTHY", "WARNING", "ISOLATED", "ATTACK_TARGET"
    private String riskLevel; // "LOW", "MEDIUM", "HIGH", "CRITICAL"

    public NetworkSegment() {
    }

    public NetworkSegment(String name, String environment, String cidr, String vpcId, String subnetType, boolean isolationMode, int workloadCount, String description, List<String> allowedInbound, List<String> allowedOutbound, String status, String riskLevel) {
        this.name = name;
        this.environment = environment;
        this.cidr = cidr;
        this.vpcId = vpcId;
        this.subnetType = subnetType;
        this.isolationMode = isolationMode;
        this.workloadCount = workloadCount;
        this.description = description;
        this.allowedInbound = allowedInbound;
        this.allowedOutbound = allowedOutbound;
        this.status = status;
        this.riskLevel = riskLevel;
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

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getCidr() {
        return cidr;
    }

    public void setCidr(String cidr) {
        this.cidr = cidr;
    }

    public String getVpcId() {
        return vpcId;
    }

    public void setVpcId(String vpcId) {
        this.vpcId = vpcId;
    }

    public String getSubnetType() {
        return subnetType;
    }

    public void setSubnetType(String subnetType) {
        this.subnetType = subnetType;
    }

    public boolean isIsolationMode() {
        return isolationMode;
    }

    public void setIsolationMode(boolean isolationMode) {
        this.isolationMode = isolationMode;
    }

    public int getWorkloadCount() {
        return workloadCount;
    }

    public void setWorkloadCount(int workloadCount) {
        this.workloadCount = workloadCount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getAllowedInbound() {
        return allowedInbound;
    }

    public void setAllowedInbound(List<String> allowedInbound) {
        this.allowedInbound = allowedInbound;
    }

    public List<String> getAllowedOutbound() {
        return allowedOutbound;
    }

    public void setAllowedOutbound(List<String> allowedOutbound) {
        this.allowedOutbound = allowedOutbound;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}
