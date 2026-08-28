package com.cisco.vip.cybersecurity.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "securityEvents")
public class SecurityEvent {

    @Id
    private String id;
    private Instant timestamp = Instant.now();
    private String eventType; // "TRAFFIC_FLOW", "POLICY_VIOLATION", "AUTH_ATTEMPT", "ATTACK_CONTAINED", "QUARANTINE_TRIGGERED", "POSTURE_UPDATED", "HYBRID_LINK_ALERT"
    private String severity; // "CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"
    private String actor; // username, "SYSTEM", "K8S_CNI", "AWS_VPC_ROUTER", "SIMULATOR"
    private String source; // IP, Subnet, Workload name
    private String target; // IP, Subnet, Workload name
    private String action; // "ALLOW", "DENY", "DROP", "QUARANTINE", "LOGIN_SUCCESS", "LOGIN_FAILED", "POLICY_EDIT"
    private String result; // "SUCCESS", "BLOCKED", "ALERTED", "FAILED"
    private String details;
    private String clientIp;

    public SecurityEvent() {
    }

    public SecurityEvent(String eventType, String severity, String actor, String source, String target, String action, String result, String details, String clientIp) {
        this.timestamp = Instant.now();
        this.eventType = eventType;
        this.severity = severity;
        this.actor = actor;
        this.source = source;
        this.target = target;
        this.action = action;
        this.result = result;
        this.details = details;
        this.clientIp = clientIp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getClientIp() {
        return clientIp;
    }

    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }
}
