package com.cisco.vip.cybersecurity.controller;

import com.cisco.vip.cybersecurity.model.NetworkSegment;
import com.cisco.vip.cybersecurity.service.NetworkSegmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/segments")
public class SegmentController {

    private final NetworkSegmentService segmentService;

    public SegmentController(NetworkSegmentService segmentService) {
        this.segmentService = segmentService;
    }

    @GetMapping
    public ResponseEntity<List<NetworkSegment>> getAllSegments() {
        return ResponseEntity.ok(segmentService.getAllSegments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NetworkSegment> getSegmentById(@PathVariable String id) {
        return segmentService.getSegmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/isolation")
    @PreAuthorize("hasAnyRole('SECURITY_ADMIN', 'NETWORK_ADMIN')")
    public ResponseEntity<NetworkSegment> toggleIsolation(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        boolean isolate = body.getOrDefault("isolationMode", false);
        return ResponseEntity.ok(segmentService.toggleIsolation(id, isolate));
    }
}
