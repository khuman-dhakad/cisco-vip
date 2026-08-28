package com.cisco.vip.cybersecurity.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "workloads")
public class Workload {

    @Id
    private String id;
    private String name; // e.g. "Workload-App-A (Academic Portal)", "Workload-App-B (Student Grading Engine)", "Database-Core-Oracle", "K8s-Payment-Service", etc.
    private String code; // "APP_A", "APP_B", "DB_CORE", "K8S_FRONTEND", "K8S_PAYMENTS", "K8S_RESEARCH", "VPC_ANALYTICS_NODE"
    private String segmentId;
    private String segmentName;
    private String ipAddress; // simulated private IP e.g. "10.10.10.15", "10.10.30.5", "10.20.1.10"
    private String namespace; // "academic", "grading", "finance", "database", "analytics", "default"
    private String type; // "VM", "KUBERNETES_POD", "DATABASE_INSTANCE", "MICROSERVICE", "API_GATEWAY"
    private String status; // "HEALTHY", "WARNING", "COMPROMISED", "QUARANTINED"
    private boolean isCompromised = false;
    private boolean isQuarantined = false;
    private int riskScore; // 0 to 100
    private List<String> vulnerabilities;
    private int activePoliciesCount;
    private List<String> portServices;
    private String environment; // "PRIVATE_DATACENTER", "PUBLIC_CLOUD"

    public Workload() {
    }

    public Workload(String name, String code, String segmentId, String segmentName, String ipAddress, String namespace, String type, String status, boolean isCompromised, boolean isQuarantined, int riskScore, List<String> vulnerabilities, int activePoliciesCount, List<String> portServices, String environment) {
        this.name = name;
        this.code = code;
        this.segmentId = segmentId;
        this.segmentName = segmentName;
        this.ipAddress = ipAddress;
        this.namespace = namespace;
        this.type = type;
        this.status = status;
        this.isCompromised = isCompromised;
        this.isQuarantined = isQuarantined;
        this.riskScore = riskScore;
        this.vulnerabilities = vulnerabilities;
        this.activePoliciesCount = activePoliciesCount;
        this.portServices = portServices;
        this.environment = environment;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getSegmentId() {
        return segmentId;
    }

    public void setSegmentId(String segmentId) {
        this.segmentId = segmentId;
    }

    public String getSegmentName() {
        return segmentName;
    }

    public void setSegmentName(String segmentName) {
        this.segmentName = segmentName;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isCompromised() {
        return isCompromised;
    }

    public void setCompromised(boolean compromised) {
        isCompromised = compromised;
    }

    public boolean isQuarantined() {
        return isQuarantined;
    }

    public void setQuarantined(boolean quarantined) {
        isQuarantined = quarantined;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
    }

    public List<String> getVulnerabilities() {
        return vulnerabilities;
    }

    public void setVulnerabilities(List<String> vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }

    public int getActivePoliciesCount() {
        return activePoliciesCount;
    }

    public void setActivePoliciesCount(int activePoliciesCount) {
        this.activePoliciesCount = activePoliciesCount;
    }

    public List<String> getPortServices() {
        return portServices;
    }

    public void setPortServices(List<String> portServices) {
        this.portServices = portServices;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }
}
