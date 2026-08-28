package com.cisco.vip.cybersecurity.controller;

import com.cisco.vip.cybersecurity.dto.PolicyEvaluationRequest;
import com.cisco.vip.cybersecurity.dto.PolicyEvaluationResponse;
import com.cisco.vip.cybersecurity.dto.SecurityPolicyDTO;
import com.cisco.vip.cybersecurity.model.SecurityPolicy;
import com.cisco.vip.cybersecurity.repository.SecurityPolicyRepository;
import com.cisco.vip.cybersecurity.service.AuditLogService;
import com.cisco.vip.cybersecurity.service.PolicyEngineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final SecurityPolicyRepository policyRepository;
    private final PolicyEngineService policyEngineService;
    private final AuditLogService auditLogService;

    public PolicyController(SecurityPolicyRepository policyRepository,
                            PolicyEngineService policyEngineService,
                            AuditLogService auditLogService) {
        this.policyRepository = policyRepository;
        this.policyEngineService = policyEngineService;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<List<SecurityPolicyDTO>> getAllPolicies() {
        List<SecurityPolicyDTO> list = policyRepository.findAllByOrderByPriorityAsc().stream()
                .map(SecurityPolicyDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SecurityPolicyDTO> getPolicyById(@PathVariable String id) {
        return policyRepository.findById(id)
                .map(SecurityPolicyDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SECURITY_ADMIN', 'NETWORK_ADMIN')")
    public ResponseEntity<SecurityPolicyDTO> createPolicy(@Valid @RequestBody SecurityPolicyDTO dto) {
        SecurityPolicy entity = dto.toEntity();
        entity.setCreatedAt(Instant.now());
        entity.setUpdatedAt(Instant.now());
        SecurityPolicy saved = policyRepository.save(entity);

        auditLogService.logEvent(
                "POLICY_CREATED",
                "INFO",
                "ADMIN",
                saved.getSource(),
                saved.getDestination(),
                saved.getAction(),
                "CREATED",
                "Created security rule #" + saved.getPriority() + " [" + saved.getName() + "]",
                "127.0.0.1"
        );

        return ResponseEntity.ok(SecurityPolicyDTO.fromEntity(saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SECURITY_ADMIN', 'NETWORK_ADMIN')")
    public ResponseEntity<SecurityPolicyDTO> updatePolicy(@PathVariable String id, @Valid @RequestBody SecurityPolicyDTO dto) {
        if (!policyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        SecurityPolicy entity = dto.toEntity();
        entity.setId(id);
        entity.setUpdatedAt(Instant.now());
        SecurityPolicy saved = policyRepository.save(entity);

        auditLogService.logEvent(
                "POLICY_UPDATED",
                "INFO",
                "ADMIN",
                saved.getSource(),
                saved.getDestination(),
                saved.getAction(),
                "UPDATED",
                "Updated security rule #" + saved.getPriority() + " [" + saved.getName() + "]",
                "127.0.0.1"
        );

        return ResponseEntity.ok(SecurityPolicyDTO.fromEntity(saved));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SECURITY_ADMIN', 'NETWORK_ADMIN')")
    public ResponseEntity<Void> deletePolicy(@PathVariable String id) {
        policyRepository.deleteById(id);
        auditLogService.logEvent(
                "POLICY_DELETED",
                "WARN",
                "ADMIN",
                id,
                "RULE_BASE",
                "DELETE",
                "DELETED",
                "Deleted policy id: " + id,
                "127.0.0.1"
        );
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/evaluate")
    public ResponseEntity<PolicyEvaluationResponse> evaluateTraffic(@Valid @RequestBody PolicyEvaluationRequest request) {
        PolicyEvaluationResponse response = policyEngineService.evaluateTraffic(request);
        return ResponseEntity.ok(response);
    }
}
