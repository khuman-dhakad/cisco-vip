package com.cisco.vip.cybersecurity.service;

import com.cisco.vip.cybersecurity.model.HybridLinkState;
import com.cisco.vip.cybersecurity.repository.HybridLinkRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;

@Service
public class HybridLinkService {

    private final HybridLinkRepository hybridLinkRepository;
    private final AuditLogService auditLogService;

    public HybridLinkService(HybridLinkRepository hybridLinkRepository, AuditLogService auditLogService) {
        this.hybridLinkRepository = hybridLinkRepository;
        this.auditLogService = auditLogService;
    }

    public HybridLinkState getHybridLinkStatus() {
        return hybridLinkRepository.findById("PRIMARY_HYBRID_LINK").orElseGet(() -> {
            HybridLinkState defaultLink = new HybridLinkState(
                    "SECURE",
                    "Redundant IPsec VPN + AWS Direct Connect Dedicated Trunk",
                    "AES-256-GCM / SHA-384 / IKEv2 / MACsec 802.1AE",
                    "10 Gbps Enterprise Backbone",
                    4,
                    0.001,
                    false,
                    Arrays.asList("10.10.0.0/16 <-> 10.20.0.0/16 (Approved Hybrid Sync)", "10.10.10.0/24 <-> 10.20.1.0/24 (Academic API Relay)"),
                    Arrays.asList("0.0.0.0/0 Direct DC Egress", "10.20.3.0/24 -> 10.10.30.0/24 (Direct DB Ingress blocked)"),
                    14892048500L,
                    9420815L
            );
            return hybridLinkRepository.save(defaultLink);
        });
    }

    public HybridLinkState toggleDegradation(boolean degrade) {
        HybridLinkState state = getHybridLinkStatus();
        state.setSimulatedDegraded(degrade);
        state.setStatus(degrade ? "DEGRADED" : "SECURE");
        state.setLatencyMs(degrade ? 185 : 4);
        state.setPacketLossPercent(degrade ? 12.8 : 0.001);
        state.setLastHealthCheck(Instant.now());

        HybridLinkState saved = hybridLinkRepository.save(state);

        auditLogService.logEvent(
                "HYBRID_LINK_STATE_CHANGED",
                degrade ? "HIGH" : "INFO",
                "NETWORK_SIMULATOR",
                "PRIVATE_DC_GATEWAY",
                "PUBLIC_CLOUD_VGW",
                degrade ? "INJECT_DEGRADATION" : "RESTORE_LINK_HEALTH",
                "SUCCESS",
                "Hybrid Direct Connect state: " + saved.getStatus(),
                "127.0.0.1"
        );

        return saved;
    }
}
