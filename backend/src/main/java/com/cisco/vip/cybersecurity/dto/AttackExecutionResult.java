package com.cisco.vip.cybersecurity.dto;

import com.cisco.vip.cybersecurity.model.AttackSimulation;
import com.cisco.vip.cybersecurity.model.Incident;

public class AttackExecutionResult {
    private AttackSimulation simulation;
    private Incident generatedIncident;
    private int updatedSecurityScore;
    private String containmentSummary;

    public AttackExecutionResult() {
    }

    public AttackExecutionResult(AttackSimulation simulation, Incident generatedIncident, int updatedSecurityScore, String containmentSummary) {
        this.simulation = simulation;
        this.generatedIncident = generatedIncident;
        this.updatedSecurityScore = updatedSecurityScore;
        this.containmentSummary = containmentSummary;
    }

    public AttackSimulation getSimulation() {
        return simulation;
    }

    public void setSimulation(AttackSimulation simulation) {
        this.simulation = simulation;
    }

    public Incident getGeneratedIncident() {
        return generatedIncident;
    }

    public void setGeneratedIncident(Incident generatedIncident) {
        this.generatedIncident = generatedIncident;
    }

    public int getUpdatedSecurityScore() {
        return updatedSecurityScore;
    }

    public void setUpdatedSecurityScore(int updatedSecurityScore) {
        this.updatedSecurityScore = updatedSecurityScore;
    }

    public String getContainmentSummary() {
        return containmentSummary;
    }

    public void setContainmentSummary(String containmentSummary) {
        this.containmentSummary = containmentSummary;
    }
}
