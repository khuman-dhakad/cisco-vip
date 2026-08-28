package com.cisco.vip.cybersecurity.dto;

import jakarta.validation.constraints.NotBlank;

public class AttackExecutionRequest {

    @NotBlank(message = "Scenario type is required")
    private String scenarioType; // "COMPROMISED_APP", "LATERAL_MOVEMENT", "CROSS_VPC_HOPPING", "UNAUTHORIZED_DB_ACCESS", "PRIVILEGE_ESCALATION", "C2_EXFILTRATION"

    private String sourceWorkloadCode; // e.g. "APP_A", "VPC_ANALYTICS_NODE"
    private String targetWorkloadCode; // e.g. "APP_B", "DB_CORE"
    private String customNotes;

    public AttackExecutionRequest() {
    }

    public AttackExecutionRequest(String scenarioType, String sourceWorkloadCode, String targetWorkloadCode, String customNotes) {
        this.scenarioType = scenarioType;
        this.sourceWorkloadCode = sourceWorkloadCode;
        this.targetWorkloadCode = targetWorkloadCode;
        this.customNotes = customNotes;
    }

    public String getScenarioType() {
        return scenarioType;
    }

    public void setScenarioType(String scenarioType) {
        this.scenarioType = scenarioType;
    }

    public String getSourceWorkloadCode() {
        return sourceWorkloadCode;
    }

    public void setSourceWorkloadCode(String sourceWorkloadCode) {
        this.sourceWorkloadCode = sourceWorkloadCode;
    }

    public String getTargetWorkloadCode() {
        return targetWorkloadCode;
    }

    public void setTargetWorkloadCode(String targetWorkloadCode) {
        this.targetWorkloadCode = targetWorkloadCode;
    }

    public String getCustomNotes() {
        return customNotes;
    }

    public void setCustomNotes(String customNotes) {
        this.customNotes = customNotes;
    }
}
