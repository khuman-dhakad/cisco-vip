package com.cisco.vip.cybersecurity.service;

import com.cisco.vip.cybersecurity.dto.IncidentUpdateRequest;
import com.cisco.vip.cybersecurity.model.Incident;
import com.cisco.vip.cybersecurity.model.Workload;
import com.cisco.vip.cybersecurity.repository.IncidentRepository;
import com.cisco.vip.cybersecurity.repository.WorkloadRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final WorkloadRepository workloadRepository;
    private final AuditLogService auditLogService;

    public IncidentService(IncidentRepository incidentRepository, WorkloadRepository workloadRepository, AuditLogService auditLogService) {
        this.incidentRepository = incidentRepository;
        this.workloadRepository = workloadRepository;
        this.auditLogService = auditLogService;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAllByOrderByTimestampDesc();
    }

    public Optional<Incident> getIncidentById(String id) {
        return incidentRepository.findById(id);
    }

    public Incident createIncident(String title, String severity, String status, String sourceIp, String targetIp,
                                  String sourceWorkload, String targetWorkload, String attackType,
                                  String detectionMechanism, String ruleTriggered, String actionTaken,
                                  Map<String, Object> forensicPayload) {
        Incident incident = new Incident(title, severity, status, sourceIp, targetIp, sourceWorkload, targetWorkload,
                attackType, detectionMechanism, ruleTriggered, actionTaken, forensicPayload);
        Incident saved = incidentRepository.save(incident);

        auditLogService.logEvent(
                "INCIDENT_TRIGGERED",
                severity,
                "SECURITY_ORCHESTRATION_ENGINE",
                sourceWorkload != null ? sourceWorkload : sourceIp,
                targetWorkload != null ? targetWorkload : targetIp,
                actionTaken,
                "ALERTED",
                String.format("Incident #%s created: %s [%s]", saved.getId(), title, attackType),
                "127.0.0.1"
        );

        return saved;
    }

    public Incident updateIncident(String id, IncidentUpdateRequest request) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found: " + id));

        incident.setStatus(request.getStatus().toUpperCase());
        if (request.getContainmentNotes() != null) {
            incident.setContainmentNotes(request.getContainmentNotes());
        }
        if (request.getResolvedBy() != null) {
            incident.setResolvedBy(request.getResolvedBy());
        }
        if ("RESOLVED".equalsIgnoreCase(request.getStatus())) {
            incident.setResolvedAt(Instant.now());
        }

        // If quarantine requested, isolate the source workload
        if (request.isQuarantineWorkload() && incident.getSourceWorkload() != null) {
            workloadRepository.findByCode(incident.getSourceWorkload()).ifPresent(w -> {
                w.setQuarantined(true);
                w.setStatus("QUARANTINED");
                workloadRepository.save(w);

                auditLogService.logEvent(
                        "QUARANTINE_TRIGGERED",
                        "HIGH",
                        request.getResolvedBy() != null ? request.getResolvedBy() : "SOC_ADMIN",
                        w.getName(),
                        "ALL_SEGMENTS",
                        "QUARANTINE",
                        "CONTAINED",
                        "Workload " + w.getName() + " quarantined due to incident " + incident.getId(),
                        "127.0.0.1"
                );
            });
        }

        Incident saved = incidentRepository.save(incident);

        auditLogService.logEvent(
                "INCIDENT_UPDATED",
                "INFO",
                request.getResolvedBy() != null ? request.getResolvedBy() : "SECURITY_ADMIN",
                incident.getSourceWorkload(),
                incident.getTargetWorkload(),
                request.getStatus(),
                "UPDATED",
                String.format("Incident #%s updated to status: %s", incident.getId(), incident.getStatus()),
                "127.0.0.1"
        );

        return saved;
    }
}
