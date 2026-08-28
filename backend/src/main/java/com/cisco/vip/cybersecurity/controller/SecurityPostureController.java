package com.cisco.vip.cybersecurity.controller;

import com.cisco.vip.cybersecurity.dto.SecurityPostureDTO;
import com.cisco.vip.cybersecurity.service.SecurityPostureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/security-posture")
public class SecurityPostureController {

    private final SecurityPostureService securityPostureService;

    public SecurityPostureController(SecurityPostureService securityPostureService) {
        this.securityPostureService = securityPostureService;
    }

    @GetMapping
    public ResponseEntity<SecurityPostureDTO> getSecurityPosture() {
        return ResponseEntity.ok(securityPostureService.calculatePosture());
    }
}
