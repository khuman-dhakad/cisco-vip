package com.cisco.vip.cybersecurity.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "hybridLinkState")
public class HybridLinkState {

    @Id
    private String id = "PRIMARY_HYBRID_LINK";
    private String status; // "SECURE", "DEGRADED", "BLOCKED"
    private String linkType; // "IPSec VPN Tunnel + AWS Direct Connect Redundant Fabric"
    private String encryptionStandard; // "AES-256-GCM / IKEv2 / 802.1AE MACsec"
    private String primaryBandwidth; // "10 Gbps Dedicated Line"
    private int latencyMs;
    private double packetLossPercent;
    private Instant lastHealthCheck = Instant.now();
    private boolean simulatedDegraded = false;
    private List<String> allowedRoutes;
    private List<String> blockedRoutes;
    private long totalBytesTransferred;
    private long totalInspectedPackets;

    public HybridLinkState() {
    }

    public HybridLinkState(String status, String linkType, String encryptionStandard, String primaryBandwidth, int latencyMs, double packetLossPercent, boolean simulatedDegraded, List<String> allowedRoutes, List<String> blockedRoutes, long totalBytesTransferred, long totalInspectedPackets) {
        this.id = "PRIMARY_HYBRID_LINK";
        this.status = status;
        this.linkType = linkType;
        this.encryptionStandard = encryptionStandard;
        this.primaryBandwidth = primaryBandwidth;
        this.latencyMs = latencyMs;
        this.packetLossPercent = packetLossPercent;
        this.simulatedDegraded = simulatedDegraded;
        this.allowedRoutes = allowedRoutes;
        this.blockedRoutes = blockedRoutes;
        this.totalBytesTransferred = totalBytesTransferred;
        this.totalInspectedPackets = totalInspectedPackets;
        this.lastHealthCheck = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLinkType() {
        return linkType;
    }

    public void setLinkType(String linkType) {
        this.linkType = linkType;
    }

    public String getEncryptionStandard() {
        return encryptionStandard;
    }

    public void setEncryptionStandard(String encryptionStandard) {
        this.encryptionStandard = encryptionStandard;
    }

    public String getPrimaryBandwidth() {
        return primaryBandwidth;
    }

    public void setPrimaryBandwidth(String primaryBandwidth) {
        this.primaryBandwidth = primaryBandwidth;
    }

    public int getLatencyMs() {
        return latencyMs;
    }

    public void setLatencyMs(int latencyMs) {
        this.latencyMs = latencyMs;
    }

    public double getPacketLossPercent() {
        return packetLossPercent;
    }

    public void setPacketLossPercent(double packetLossPercent) {
        this.packetLossPercent = packetLossPercent;
    }

    public Instant getLastHealthCheck() {
        return lastHealthCheck;
    }

    public void setLastHealthCheck(Instant lastHealthCheck) {
        this.lastHealthCheck = lastHealthCheck;
    }

    public boolean isSimulatedDegraded() {
        return simulatedDegraded;
    }

    public void setSimulatedDegraded(boolean simulatedDegraded) {
        this.simulatedDegraded = simulatedDegraded;
    }

    public List<String> getAllowedRoutes() {
        return allowedRoutes;
    }

    public void setAllowedRoutes(List<String> allowedRoutes) {
        this.allowedRoutes = allowedRoutes;
    }

    public List<String> getBlockedRoutes() {
        return blockedRoutes;
    }

    public void setBlockedRoutes(List<String> blockedRoutes) {
        this.blockedRoutes = blockedRoutes;
    }

    public long getTotalBytesTransferred() {
        return totalBytesTransferred;
    }

    public void setTotalBytesTransferred(long totalBytesTransferred) {
        this.totalBytesTransferred = totalBytesTransferred;
    }

    public long getTotalInspectedPackets() {
        return totalInspectedPackets;
    }

    public void setTotalInspectedPackets(long totalInspectedPackets) {
        this.totalInspectedPackets = totalInspectedPackets;
    }
}
