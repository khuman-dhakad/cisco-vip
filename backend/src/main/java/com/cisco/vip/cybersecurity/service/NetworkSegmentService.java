package com.cisco.vip.cybersecurity.service;

import com.cisco.vip.cybersecurity.model.NetworkSegment;
import com.cisco.vip.cybersecurity.repository.NetworkSegmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NetworkSegmentService {

    private final NetworkSegmentRepository segmentRepository;
    private final AuditLogService auditLogService;

    public NetworkSegmentService(NetworkSegmentRepository segmentRepository, AuditLogService auditLogService) {
        this.segmentRepository = segmentRepository;
        this.auditLogService = auditLogService;
    }

    public List<NetworkSegment> getAllSegments() {
        return segmentRepository.findAll();
    }

    public Optional<NetworkSegment> getSegmentById(String id) {
        return segmentRepository.findById(id);
    }

    public NetworkSegment toggleIsolation(String id, boolean isolationMode) {
        NetworkSegment segment = segmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Segment not found: " + id));

        segment.setIsolationMode(isolationMode);
        segment.setStatus(isolationMode ? "ISOLATED" : "HEALTHY");
        segment.setRiskLevel(isolationMode ? "CRITICAL" : "LOW");

        NetworkSegment saved = segmentRepository.save(segment);

        auditLogService.logEvent(
                "SEGMENT_ISOLATION_TOGGLE",
                isolationMode ? "CRITICAL" : "INFO",
                "NETWORK_ADMIN",
                saved.getName(),
                saved.getCidr(),
                isolationMode ? "EMERGENCY_ISOLATE" : "RESTORE_ROUTING",
                "SUCCESS",
                "Network segment " + saved.getName() + " isolation mode: " + isolationMode,
                "127.0.0.1"
        );

        return saved;
    }
}
