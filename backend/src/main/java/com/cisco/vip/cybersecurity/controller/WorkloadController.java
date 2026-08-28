package com.cisco.vip.cybersecurity.controller;

import com.cisco.vip.cybersecurity.model.Workload;
import com.cisco.vip.cybersecurity.service.WorkloadService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workloads")
public class WorkloadController {

    private final WorkloadService workloadService;

    public WorkloadController(WorkloadService workloadService) {
        this.workloadService = workloadService;
    }

    @GetMapping
    public ResponseEntity<List<Workload>> getAllWorkloads() {
        return ResponseEntity.ok(workloadService.getAllWorkloads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workload> getWorkloadById(@PathVariable String id) {
        return workloadService.getWorkloadById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/compromise")
    public ResponseEntity<Workload> toggleCompromise(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        boolean compromised = body.getOrDefault("compromised", true);
        return ResponseEntity.ok(workloadService.toggleCompromised(id, compromised));
    }

    @PatchMapping("/{id}/quarantine")
    public ResponseEntity<Workload> toggleQuarantine(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        boolean quarantined = body.getOrDefault("quarantined", true);
        return ResponseEntity.ok(workloadService.toggleQuarantine(id, quarantined));
    }
}
