package com.cisco.vip.cybersecurity.controller;

import com.cisco.vip.cybersecurity.model.SecurityEvent;
import com.cisco.vip.cybersecurity.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/monitoring")
public class MonitoringController {

    private final AuditLogService auditLogService;

    public MonitoringController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping("/events")
    public ResponseEntity<List<SecurityEvent>> getEvents(
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String eventType) {

        if (severity != null && !severity.isEmpty()) {
            return ResponseEntity.ok(auditLogService.getEventsBySeverity(severity.toUpperCase()));
        }
        if (eventType != null && !eventType.isEmpty()) {
            return ResponseEntity.ok(auditLogService.getEventsByType(eventType.toUpperCase()));
        }
        return ResponseEntity.ok(auditLogService.getRecentEvents(100));
    }
}
