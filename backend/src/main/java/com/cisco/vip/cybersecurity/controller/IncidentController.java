package com.cisco.vip.cybersecurity.controller;

import com.cisco.vip.cybersecurity.dto.IncidentUpdateRequest;
import com.cisco.vip.cybersecurity.model.Incident;
import com.cisco.vip.cybersecurity.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable String id) {
        return incidentService.getIncidentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Incident> updateIncident(@PathVariable String id, @Valid @RequestBody IncidentUpdateRequest request) {
        Incident updated = incidentService.updateIncident(id, request);
        return ResponseEntity.ok(updated);
    }
}
