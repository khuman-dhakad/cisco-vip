package com.cisco.vip.cybersecurity.controller;

import com.cisco.vip.cybersecurity.model.HybridLinkState;
import com.cisco.vip.cybersecurity.service.HybridLinkService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/hybrid-link")
public class HybridLinkController {

    private final HybridLinkService hybridLinkService;

    public HybridLinkController(HybridLinkService hybridLinkService) {
        this.hybridLinkService = hybridLinkService;
    }

    @GetMapping
    public ResponseEntity<HybridLinkState> getStatus() {
        return ResponseEntity.ok(hybridLinkService.getHybridLinkStatus());
    }

    @PostMapping("/degrade")
    @PreAuthorize("hasAnyRole('SECURITY_ADMIN', 'NETWORK_ADMIN')")
    public ResponseEntity<HybridLinkState> toggleDegrade(@RequestBody Map<String, Boolean> body) {
        boolean degrade = body.getOrDefault("degrade", true);
        return ResponseEntity.ok(hybridLinkService.toggleDegradation(degrade));
    }
}
