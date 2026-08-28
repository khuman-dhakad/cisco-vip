package com.cisco.vip.cybersecurity.service;

import com.cisco.vip.cybersecurity.model.SecurityEvent;
import com.cisco.vip.cybersecurity.repository.SecurityEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final SecurityEventRepository eventRepository;

    public AuditLogService(SecurityEventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public SecurityEvent logEvent(String eventType, String severity, String actor, String source, String target, String action, String result, String details, String clientIp) {
        SecurityEvent event = new SecurityEvent(eventType, severity, actor, source, target, action, result, details, clientIp != null ? clientIp : "127.0.0.1");
        return eventRepository.save(event);
    }

    public List<SecurityEvent> getRecentEvents(int limit) {
        return eventRepository.findTop100ByOrderByTimestampDesc();
    }

    public List<SecurityEvent> getEventsBySeverity(String severity) {
        return eventRepository.findBySeverity(severity);
    }

    public List<SecurityEvent> getEventsByType(String eventType) {
        return eventRepository.findByEventType(eventType);
    }
}
