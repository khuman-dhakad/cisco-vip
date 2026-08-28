package com.cisco.vip.cybersecurity.service;

import com.cisco.vip.cybersecurity.model.Workload;
import com.cisco.vip.cybersecurity.repository.WorkloadRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkloadService {

    private final WorkloadRepository workloadRepository;
    private final AuditLogService auditLogService;

    public WorkloadService(WorkloadRepository workloadRepository, AuditLogService auditLogService) {
        this.workloadRepository = workloadRepository;
        this.auditLogService = auditLogService;
    }

    public List<Workload> getAllWorkloads() {
        return workloadRepository.findAll();
    }

    public Optional<Workload> getWorkloadById(String id) {
        return workloadRepository.findById(id);
    }

    public Optional<Workload> getWorkloadByCode(String code) {
        return workloadRepository.findByCode(code);
    }

    public Workload toggleCompromised(String id, boolean compromised) {
        Workload workload = workloadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workload not found: " + id));

        workload.setCompromised(compromised);
        if (compromised) {
            workload.setStatus("COMPROMISED");
            workload.setRiskScore(95);
        } else {
            workload.setStatus(workload.isQuarantined() ? "QUARANTINED" : "HEALTHY");
            workload.setRiskScore(workload.isQuarantined() ? 40 : 15);
        }

        Workload saved = workloadRepository.save(workload);

        auditLogService.logEvent(
                "WORKLOAD_STATUS_CHANGED",
                compromised ? "CRITICAL" : "INFO",
                "SECURITY_ADMIN",
                saved.getName(),
                saved.getSegmentName(),
                compromised ? "MARK_COMPROMISED" : "UNMARK_COMPROMISED",
                "SUCCESS",
                "Workload " + saved.getName() + " compromised flag set to: " + compromised,
                "127.0.0.1"
        );

        return saved;
    }

    public Workload toggleQuarantine(String id, boolean quarantined) {
        Workload workload = workloadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workload not found: " + id));

        workload.setQuarantined(quarantined);
        if (quarantined) {
            workload.setStatus("QUARANTINED");
        } else {
            workload.setStatus(workload.isCompromised() ? "COMPROMISED" : "HEALTHY");
        }

        Workload saved = workloadRepository.save(workload);

        auditLogService.logEvent(
                "WORKLOAD_QUARANTINE_TOGGLE",
                quarantined ? "HIGH" : "INFO",
                "SECURITY_ADMIN",
                saved.getName(),
                saved.getSegmentName(),
                quarantined ? "ISOLATE" : "RELEASE_ISOLATION",
                "SUCCESS",
                "Workload " + saved.getName() + " quarantine flag set to: " + quarantined,
                "127.0.0.1"
        );

        return saved;
    }
}
