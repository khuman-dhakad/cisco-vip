package com.cisco.vip.cybersecurity.controller;

import com.cisco.vip.cybersecurity.dto.AttackExecutionRequest;
import com.cisco.vip.cybersecurity.dto.AttackExecutionResult;
import com.cisco.vip.cybersecurity.model.AttackSimulation;
import com.cisco.vip.cybersecurity.service.AttackSimulationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attacks")
public class AttackController {

    private final AttackSimulationService attackSimulationService;

    public AttackController(AttackSimulationService attackSimulationService) {
        this.attackSimulationService = attackSimulationService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<AttackExecutionResult> simulateAttack(@Valid @RequestBody AttackExecutionRequest request) {
        AttackExecutionResult result = attackSimulationService.executeAttack(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AttackSimulation>> getAttackHistory() {
        return ResponseEntity.ok(attackSimulationService.getRecentSimulations());
    }
}
