package com.cisco.vip.cybersecurity.service;

import com.cisco.vip.cybersecurity.dto.PolicyEvaluationRequest;
import com.cisco.vip.cybersecurity.dto.PolicyEvaluationResponse;
import com.cisco.vip.cybersecurity.model.AttackSimulation.PolicyEvaluationRecord;
import com.cisco.vip.cybersecurity.model.SecurityPolicy;
import com.cisco.vip.cybersecurity.repository.SecurityPolicyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PolicyEngineService {

    private static final Logger logger = LoggerFactory.getLogger(PolicyEngineService.class);
    private final SecurityPolicyRepository policyRepository;

    public PolicyEngineService(SecurityPolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    public PolicyEvaluationResponse evaluateTraffic(PolicyEvaluationRequest request) {
        List<SecurityPolicy> policies = policyRepository.findByEnabledTrueOrderByPriorityAsc();
        List<PolicyEvaluationRecord> evaluationChain = new ArrayList<>();

        String src = request.getSource() != null ? request.getSource().trim() : "";
        String dst = request.getDestination() != null ? request.getDestination().trim() : "";
        String proto = request.getProtocol() != null ? request.getProtocol().trim().toUpperCase() : "ANY";
        String port = request.getPort() != null ? request.getPort().trim() : "ANY";
        String userRole = request.getRole() != null ? request.getRole().trim().toUpperCase() : "";

        for (SecurityPolicy policy : policies) {
            boolean srcMatch = matchesEndpoint(policy.getSource(), src, userRole);
            boolean dstMatch = matchesEndpoint(policy.getDestination(), dst, userRole);
            boolean protoMatch = matchesProtocol(policy.getProtocol(), proto);
            boolean portMatch = matchesPort(policy.getPort(), port);

            boolean isMatched = srcMatch && dstMatch && protoMatch && portMatch;
            String reason = isMatched 
                    ? String.format("Matched rule #%d [%s]: %s -> %s (%s:%s) => %s",
                        policy.getPriority(), policy.getName(), policy.getSource(), policy.getDestination(), policy.getProtocol(), policy.getPort(), policy.getAction())
                    : String.format("Rule #%d [%s] criteria did not match request (srcMatch: %b, dstMatch: %b, protoMatch: %b, portMatch: %b)",
                        policy.getPriority(), policy.getName(), srcMatch, dstMatch, protoMatch, portMatch);

            PolicyEvaluationRecord record = new PolicyEvaluationRecord(
                    policy.getId(),
                    policy.getName(),
                    policy.getSource(),
                    policy.getDestination(),
                    policy.getProtocol(),
                    policy.getPort(),
                    policy.getAction(),
                    policy.getPriority(),
                    isMatched,
                    reason
            );
            evaluationChain.add(record);

            if (isMatched) {
                boolean isAllowed = "ALLOW".equalsIgnoreCase(policy.getAction());
                return new PolicyEvaluationResponse(
                        policy.getAction().toUpperCase(),
                        isAllowed,
                        policy.getId(),
                        policy.getName(),
                        String.format("[%s] %s -> %s on %s:%s", policy.getAction(), policy.getSource(), policy.getDestination(), policy.getProtocol(), policy.getPort()),
                        policy.getDescription(),
                        evaluationChain
                );
            }
        }

        // Implicit Default Zero-Trust Deny
        PolicyEvaluationRecord defaultDeny = new PolicyEvaluationRecord(
                "DEFAULT_IMPLICIT_DENY",
                "Implicit Zero-Trust Default Deny Rule",
                "0.0.0.0/0",
                "0.0.0.0/0",
                "ANY",
                "ANY",
                "DENY",
                9999,
                true,
                "No explicit ALLOW policy matched. Enforcing Cisco Zero-Trust implicit boundary DENY."
        );
        evaluationChain.add(defaultDeny);

        return new PolicyEvaluationResponse(
                "DENY",
                false,
                "DEFAULT_IMPLICIT_DENY",
                "Implicit Zero-Trust Default Deny Rule",
                "[DENY] Implicit Boundary Rule (No explicit ALLOW found)",
                "Zero Trust principle enforced: Traffic is denied by default unless an explicit permit policy exists.",
                evaluationChain
        );
    }

    private boolean matchesEndpoint(String pattern, String target, String userRole) {
        if (pattern == null || target == null) return false;
        String p = pattern.trim().toUpperCase();
        String t = target.trim().toUpperCase();

        if (p.equals("ANY") || p.equals("0.0.0.0/0") || p.equals("*")) return true;
        if (p.equals(t)) return true;

        // Role matching: e.g. pattern="ROLE:FACULTY", userRole="FACULTY"
        if (p.startsWith("ROLE:") && !userRole.isEmpty()) {
            String roleName = p.substring(5);
            if (roleName.equals(userRole) || userRole.equals("ROLE_" + roleName)) return true;
        }

        // Workload matching: e.g. pattern="WORKLOAD:APP_A", target="APP_A" or target="10.10.10.15"
        if (p.startsWith("WORKLOAD:") && (t.equals(p.substring(9)) || t.contains(p.substring(9)))) return true;
        if (t.startsWith("WORKLOAD:") && (p.equals(t.substring(9)) || p.contains(t.substring(9)))) return true;

        // Subnet prefix matching: e.g. pattern "10.10.10." matching target "10.10.10.15"
        if (p.contains("/")) {
            String prefix = p.substring(0, p.indexOf('/'));
            if (prefix.endsWith(".0")) {
                prefix = prefix.substring(0, prefix.lastIndexOf(".0"));
            }
            if (t.startsWith(prefix)) return true;
        }

        return p.contains(t) || t.contains(p);
    }

    private boolean matchesProtocol(String ruleProtocol, String requestProtocol) {
        if (ruleProtocol == null || requestProtocol == null) return true;
        String r = ruleProtocol.trim().toUpperCase();
        String req = requestProtocol.trim().toUpperCase();
        return r.equals("ANY") || r.equals("*") || r.equals(req);
    }

    private boolean matchesPort(String rulePort, String requestPort) {
        if (rulePort == null || requestPort == null) return true;
        String r = rulePort.trim().toUpperCase();
        String req = requestPort.trim().toUpperCase();
        return r.equals("ANY") || r.equals("*") || r.equals(req);
    }
}
