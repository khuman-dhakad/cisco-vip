package com.cisco.vip.cybersecurity.dto;

import com.cisco.vip.cybersecurity.model.Incident;
import com.cisco.vip.cybersecurity.model.SecurityEvent;

import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private int overallSecurityScore;
    private int totalApplications;
    private int protectedApplications;
    private int activeSecurityPolicies;
    private int detectedThreats;
    private int blockedConnections;
    private int activeUsers;
    private int cloudSegments;
    private String privateDcStatus;
    private String publicCloudStatus;
    private String hybridLinkStatus;
    private List<SecurityEvent> recentEvents;
    private List<Incident> openIncidents;
    private Map<String, Long> trafficStats; // allowed, blocked, suspicious
    private Map<String, Integer> postureFactorBreakdown;

    public DashboardStatsDTO() {
    }

    public int getOverallSecurityScore() {
        return overallSecurityScore;
    }

    public void setOverallSecurityScore(int overallSecurityScore) {
        this.overallSecurityScore = overallSecurityScore;
    }

    public int getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(int totalApplications) {
        this.totalApplications = totalApplications;
    }

    public int getProtectedApplications() {
        return protectedApplications;
    }

    public void setProtectedApplications(int protectedApplications) {
        this.protectedApplications = protectedApplications;
    }

    public int getActiveSecurityPolicies() {
        return activeSecurityPolicies;
    }

    public void setActiveSecurityPolicies(int activeSecurityPolicies) {
        this.activeSecurityPolicies = activeSecurityPolicies;
    }

    public int getDetectedThreats() {
        return detectedThreats;
    }

    public void setDetectedThreats(int detectedThreats) {
        this.detectedThreats = detectedThreats;
    }

    public int getBlockedConnections() {
        return blockedConnections;
    }

    public void setBlockedConnections(int blockedConnections) {
        this.blockedConnections = blockedConnections;
    }

    public int getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(int activeUsers) {
        this.activeUsers = activeUsers;
    }

    public int getCloudSegments() {
        return cloudSegments;
    }

    public void setCloudSegments(int cloudSegments) {
        this.cloudSegments = cloudSegments;
    }

    public String getPrivateDcStatus() {
        return privateDcStatus;
    }

    public void setPrivateDcStatus(String privateDcStatus) {
        this.privateDcStatus = privateDcStatus;
    }

    public String getPublicCloudStatus() {
        return publicCloudStatus;
    }

    public void setPublicCloudStatus(String publicCloudStatus) {
        this.publicCloudStatus = publicCloudStatus;
    }

    public String getHybridLinkStatus() {
        return hybridLinkStatus;
    }

    public void setHybridLinkStatus(String hybridLinkStatus) {
        this.hybridLinkStatus = hybridLinkStatus;
    }

    public List<SecurityEvent> getRecentEvents() {
        return recentEvents;
    }

    public void setRecentEvents(List<SecurityEvent> recentEvents) {
        this.recentEvents = recentEvents;
    }

    public List<Incident> getOpenIncidents() {
        return openIncidents;
    }

    public void setOpenIncidents(List<Incident> openIncidents) {
        this.openIncidents = openIncidents;
    }

    public Map<String, Long> getTrafficStats() {
        return trafficStats;
    }

    public void setTrafficStats(Map<String, Long> trafficStats) {
        this.trafficStats = trafficStats;
    }

    public Map<String, Integer> getPostureFactorBreakdown() {
        return postureFactorBreakdown;
    }

    public void setPostureFactorBreakdown(Map<String, Integer> postureFactorBreakdown) {
        this.postureFactorBreakdown = postureFactorBreakdown;
    }
}
