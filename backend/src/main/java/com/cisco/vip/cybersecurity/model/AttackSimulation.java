package com.cisco.vip.cybersecurity.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "attackSimulations")
public class AttackSimulation {

    @Id
    private String id;
    private String scenarioName;
    private String scenarioType; // "COMPROMISED_APP", "LATERAL_MOVEMENT", "CROSS_VPC_HOPPING", "UNAUTHORIZED_DB_ACCESS", "PRIVILEGE_ESCALATION", "C2_EXFILTRATION"
    private String attackerSource;
    private String targetWorkload;
    private Instant timestamp = Instant.now();
    private List<AttackStep> steps;
    private List<PolicyEvaluationRecord> policyEvaluations;
    private String finalVerdict; // "CONTAINED_BY_FIREWALL", "BLOCKED_BY_RBAC", "BLOCKED_BY_SG", "BLOCKED_BY_K8S_CNI", "EXFILTRATION_BLOCKED"
    private boolean isBlocked = true;
    private String incidentId;
    private long executionTimeMs;
    private String mitigationRecommendation;

    public static class AttackStep {
        private int stepNumber;
        private String stageName;
        private String sourceNode;
        private String destinationNode;
        private String attemptedAction;
        private String status; // "SUCCESS", "BLOCKED", "EVALUATING", "QUARANTINED"
        private String logMessage;
        private String policyIdMatched;
        private String ruleDetails;

        public AttackStep() {
        }

        public AttackStep(int stepNumber, String stageName, String sourceNode, String destinationNode, String attemptedAction, String status, String logMessage, String policyIdMatched, String ruleDetails) {
            this.stepNumber = stepNumber;
            this.stageName = stageName;
            this.sourceNode = sourceNode;
            this.destinationNode = destinationNode;
            this.attemptedAction = attemptedAction;
            this.status = status;
            this.logMessage = logMessage;
            this.policyIdMatched = policyIdMatched;
            this.ruleDetails = ruleDetails;
        }

        public int getStepNumber() {
            return stepNumber;
        }

        public void setStepNumber(int stepNumber) {
            this.stepNumber = stepNumber;
        }

        public String getStageName() {
            return stageName;
        }

        public void setStageName(String stageName) {
            this.stageName = stageName;
        }

        public String getSourceNode() {
            return sourceNode;
        }

        public void setSourceNode(String sourceNode) {
            this.sourceNode = sourceNode;
        }

        public String getDestinationNode() {
            return destinationNode;
        }

        public void setDestinationNode(String destinationNode) {
            this.destinationNode = destinationNode;
        }

        public String getAttemptedAction() {
            return attemptedAction;
        }

        public void setAttemptedAction(String attemptedAction) {
            this.attemptedAction = attemptedAction;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getLogMessage() {
            return logMessage;
        }

        public void setLogMessage(String logMessage) {
            this.logMessage = logMessage;
        }

        public String getPolicyIdMatched() {
            return policyIdMatched;
        }

        public void setPolicyIdMatched(String policyIdMatched) {
            this.policyIdMatched = policyIdMatched;
        }

        public String getRuleDetails() {
            return ruleDetails;
        }

        public void setRuleDetails(String ruleDetails) {
            this.ruleDetails = ruleDetails;
        }
    }

    public static class PolicyEvaluationRecord {
        private String policyId;
        private String policyName;
        private String source;
        private String destination;
        private String protocol;
        private String port;
        private String action;
        private int priority;
        private boolean matched;
        private String evaluationReason;

        public PolicyEvaluationRecord() {
        }

        public PolicyEvaluationRecord(String policyId, String policyName, String source, String destination, String protocol, String port, String action, int priority, boolean matched, String evaluationReason) {
            this.policyId = policyId;
            this.policyName = policyName;
            this.source = source;
            this.destination = destination;
            this.protocol = protocol;
            this.port = port;
            this.action = action;
            this.priority = priority;
            this.matched = matched;
            this.evaluationReason = evaluationReason;
        }

        public String getPolicyId() {
            return policyId;
        }

        public void setPolicyId(String policyId) {
            this.policyId = policyId;
        }

        public String getPolicyName() {
            return policyName;
        }

        public void setPolicyName(String policyName) {
            this.policyName = policyName;
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

        public boolean isMatched() {
            return matched;
        }

        public void setMatched(boolean matched) {
            this.matched = matched;
        }

        public String getEvaluationReason() {
            return evaluationReason;
        }

        public void setEvaluationReason(String evaluationReason) {
            this.evaluationReason = evaluationReason;
        }
    }

    public AttackSimulation() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getScenarioName() {
        return scenarioName;
    }

    public void setScenarioName(String scenarioName) {
        this.scenarioName = scenarioName;
    }

    public String getScenarioType() {
        return scenarioType;
    }

    public void setScenarioType(String scenarioType) {
        this.scenarioType = scenarioType;
    }

    public String getAttackerSource() {
        return attackerSource;
    }

    public void setAttackerSource(String attackerSource) {
        this.attackerSource = attackerSource;
    }

    public String getTargetWorkload() {
        return targetWorkload;
    }

    public void setTargetWorkload(String targetWorkload) {
        this.targetWorkload = targetWorkload;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public List<AttackStep> getSteps() {
        return steps;
    }

    public void setSteps(List<AttackStep> steps) {
        this.steps = steps;
    }

    public List<PolicyEvaluationRecord> getPolicyEvaluations() {
        return policyEvaluations;
    }

    public void setPolicyEvaluations(List<PolicyEvaluationRecord> policyEvaluations) {
        this.policyEvaluations = policyEvaluations;
    }

    public String getFinalVerdict() {
        return finalVerdict;
    }

    public void setFinalVerdict(String finalVerdict) {
        this.finalVerdict = finalVerdict;
    }

    public boolean isBlocked() {
        return isBlocked;
    }

    public void setBlocked(boolean blocked) {
        isBlocked = blocked;
    }

    public String getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(String incidentId) {
        this.incidentId = incidentId;
    }

    public long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(long executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }

    public String getMitigationRecommendation() {
        return mitigationRecommendation;
    }

    public void setMitigationRecommendation(String mitigationRecommendation) {
        this.mitigationRecommendation = mitigationRecommendation;
    }
}
