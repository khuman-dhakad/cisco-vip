package com.cisco.vip.cybersecurity.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Map;

@Document(collection = "incidents")
public class Incident {

    @Id
    private String id;
    private String title;
    private String severity; // "CRITICAL", "HIGH", "MEDIUM", "LOW"
    private String status; // "DETECTED", "INVESTIGATING", "CONTAINED", "RESOLVED"
    private String sourceIp;
    private String targetIp;
    private String sourceWorkload;
    private String targetWorkload;
    private String attackType; // "LATERAL_MOVEMENT", "UNAUTHORIZED_DB_ACCESS", "CROSS_VPC_BREACH", "PRIVILEGE_ESCALATION", "C2_EXFILTRATION", "MALICIOUS_APP_EXPLOIT"
    private String detectionMechanism; // "FIREWALL_POLICY_ENGINE", "SECURITY_GROUP_NACL", "K8S_CALICO_CNI", "IAM_AUTHORIZATION_GUARD", "HYBRID_LINK_INSPECTOR"
    private String ruleTriggered;
    private String actionTaken; // "BLOCKED", "AUTO_QUARANTINED", "PORT_FILTERED", "SESSION_TERMINATED"
    private Map<String, Object> forensicPayload;
    private Instant timestamp = Instant.now();
    private Instant resolvedAt;
    private String resolvedBy;
    private String containmentNotes;

    public Incident() {
    }

    public Incident(String title, String severity, String status, String sourceIp, String targetIp, String sourceWorkload, String targetWorkload, String attackType, String detectionMechanism, String ruleTriggered, String actionTaken, Map<String, Object> forensicPayload) {
        this.title = title;
        this.severity = severity;
        this.status = status;
        this.sourceIp = sourceIp;
        this.targetIp = targetIp;
        this.sourceWorkload = sourceWorkload;
        this.targetWorkload = targetWorkload;
        this.attackType = attackType;
        this.detectionMechanism = detectionMechanism;
        this.ruleTriggered = ruleTriggered;
        this.actionTaken = actionTaken;
        this.forensicPayload = forensicPayload;
        this.timestamp = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSourceIp() {
        return sourceIp;
    }

    public void setSourceIp(String sourceIp) {
        this.sourceIp = sourceIp;
    }

    public String getTargetIp() {
        return targetIp;
    }

    public void setTargetIp(String targetIp) {
        this.targetIp = targetIp;
    }

    public String getSourceWorkload() {
        return sourceWorkload;
    }

    public void setSourceWorkload(String sourceWorkload) {
        this.sourceWorkload = sourceWorkload;
    }

    public String getTargetWorkload() {
        return targetWorkload;
    }

    public void setTargetWorkload(String targetWorkload) {
        this.targetWorkload = targetWorkload;
    }

    public String getAttackType() {
        return attackType;
    }

    public void setAttackType(String attackType) {
        this.attackType = attackType;
    }

    public String getDetectionMechanism() {
        return detectionMechanism;
    }

    public void setDetectionMechanism(String detectionMechanism) {
        this.detectionMechanism = detectionMechanism;
    }

    public String getRuleTriggered() {
        return ruleTriggered;
    }

    public void setRuleTriggered(String ruleTriggered) {
        this.ruleTriggered = ruleTriggered;
    }

    public String getActionTaken() {
        return actionTaken;
    }

    public void setActionTaken(String actionTaken) {
        this.actionTaken = actionTaken;
    }

    public Map<String, Object> getForensicPayload() {
        return forensicPayload;
    }

    public void setForensicPayload(Map<String, Object> forensicPayload) {
        this.forensicPayload = forensicPayload;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResolvedBy() {
        return resolvedBy;
    }

    public void setResolvedBy(String resolvedBy) {
        this.resolvedBy = resolvedBy;
    }

    public String getContainmentNotes() {
        return containmentNotes;
    }

    public void setContainmentNotes(String containmentNotes) {
        this.containmentNotes = containmentNotes;
    }
}
