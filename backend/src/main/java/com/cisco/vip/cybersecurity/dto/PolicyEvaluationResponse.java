package com.cisco.vip.cybersecurity.dto;

import com.cisco.vip.cybersecurity.model.AttackSimulation.PolicyEvaluationRecord;

import java.util.List;

public class PolicyEvaluationResponse {
    private String verdict; // "ALLOW", "DENY"
    private boolean allowed;
    private String matchedPolicyId;
    private String matchedPolicyName;
    private String matchedRuleSummary;
    private String reason;
    private List<PolicyEvaluationRecord> evaluationChain;

    public PolicyEvaluationResponse() {
    }

    public PolicyEvaluationResponse(String verdict, boolean allowed, String matchedPolicyId, String matchedPolicyName, String matchedRuleSummary, String reason, List<PolicyEvaluationRecord> evaluationChain) {
        this.verdict = verdict;
        this.allowed = allowed;
        this.matchedPolicyId = matchedPolicyId;
        this.matchedPolicyName = matchedPolicyName;
        this.matchedRuleSummary = matchedRuleSummary;
        this.reason = reason;
        this.evaluationChain = evaluationChain;
    }

    public String getVerdict() {
        return verdict;
    }

    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }

    public boolean isAllowed() {
        return allowed;
    }

    public void setAllowed(boolean allowed) {
        this.allowed = allowed;
    }

    public String getMatchedPolicyId() {
        return matchedPolicyId;
    }

    public void setMatchedPolicyId(String matchedPolicyId) {
        this.matchedPolicyId = matchedPolicyId;
    }

    public String getMatchedPolicyName() {
        return matchedPolicyName;
    }

    public void setMatchedPolicyName(String matchedPolicyName) {
        this.matchedPolicyName = matchedPolicyName;
    }

    public String getMatchedRuleSummary() {
        return matchedRuleSummary;
    }

    public void setMatchedRuleSummary(String matchedRuleSummary) {
        this.matchedRuleSummary = matchedRuleSummary;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public List<PolicyEvaluationRecord> getEvaluationChain() {
        return evaluationChain;
    }

    public void setEvaluationChain(List<PolicyEvaluationRecord> evaluationChain) {
        this.evaluationChain = evaluationChain;
    }
}
