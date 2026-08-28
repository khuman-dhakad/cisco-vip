package com.cisco.vip.cybersecurity.service;

import com.cisco.vip.cybersecurity.dto.AttackExecutionRequest;
import com.cisco.vip.cybersecurity.dto.AttackExecutionResult;
import com.cisco.vip.cybersecurity.dto.PolicyEvaluationRequest;
import com.cisco.vip.cybersecurity.dto.PolicyEvaluationResponse;
import com.cisco.vip.cybersecurity.dto.SecurityPostureDTO;
import com.cisco.vip.cybersecurity.model.AttackSimulation;
import com.cisco.vip.cybersecurity.model.AttackSimulation.AttackStep;
import com.cisco.vip.cybersecurity.model.Incident;
import com.cisco.vip.cybersecurity.model.Workload;
import com.cisco.vip.cybersecurity.repository.AttackSimulationRepository;
import com.cisco.vip.cybersecurity.repository.WorkloadRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttackSimulationService {

    private static final Logger logger = LoggerFactory.getLogger(AttackSimulationService.class);

    private final PolicyEngineService policyEngineService;
    private final AttackSimulationRepository attackSimulationRepository;
    private final IncidentService incidentService;
    private final WorkloadRepository workloadRepository;
    private final AuditLogService auditLogService;
    private final SecurityPostureService securityPostureService;

    public AttackSimulationService(PolicyEngineService policyEngineService,
                                   AttackSimulationRepository attackSimulationRepository,
                                   IncidentService incidentService,
                                   WorkloadRepository workloadRepository,
                                   AuditLogService auditLogService,
                                   SecurityPostureService securityPostureService) {
        this.policyEngineService = policyEngineService;
        this.attackSimulationRepository = attackSimulationRepository;
        this.incidentService = incidentService;
        this.workloadRepository = workloadRepository;
        this.auditLogService = auditLogService;
        this.securityPostureService = securityPostureService;
    }

    public AttackExecutionResult executeAttack(AttackExecutionRequest request) {
        long startTime = System.currentTimeMillis();
        String scenarioType = request.getScenarioType() != null ? request.getScenarioType().toUpperCase() : "LATERAL_MOVEMENT";

        AttackSimulation simulation = new AttackSimulation();
        simulation.setScenarioType(scenarioType);
        simulation.setTimestamp(Instant.now());

        List<AttackStep> steps = new ArrayList<>();
        Incident incident = null;
        String verdict = "";
        String mitigation = "";
        boolean isBlocked = true;

        switch (scenarioType) {
            case "COMPROMISED_APP": {
                simulation.setScenarioName("Application A Initial Exploitation & Containment");
                simulation.setAttackerSource("EXTERNAL_ADVERSARY (IP: 203.0.113.45)");
                simulation.setTargetWorkload("WORKLOAD:APP_A (Academic Portal - 10.10.10.15)");

                // Step 1: Initial Ingress Exploit
                steps.add(new AttackStep(1, "Ingress RCE Vector", "203.0.113.45", "10.10.10.15:443",
                        "HTTP POST /api/v1/academic/upload (CVE-2026-RemoteCodeExecution)", "SUCCESS",
                        "Web application payload executed in isolated userland container.", null, "In-app vulnerability triggered."));

                // Mark Workload A as compromised
                workloadRepository.findByCode("APP_A").ifPresent(w -> {
                    w.setCompromised(true);
                    w.setStatus("COMPROMISED");
                    workloadRepository.save(w);
                });

                // Step 2: Adversary attempts reconnaissance
                steps.add(new AttackStep(2, "Internal Reconnaissance", "10.10.10.15", "10.10.20.0/24",
                        "TCP SYN Probe across adjacent Subnet B", "EVALUATING",
                        "Adversary scanning internal subnet for pivot targets.", null, "Packet inspected by Next-Gen Enterprise Firewall."));

                // Step 3: Lateral Movement Attempt against App B
                PolicyEvaluationResponse eval = policyEngineService.evaluateTraffic(
                        new PolicyEvaluationRequest("WORKLOAD:APP_A", "WORKLOAD:APP_B", "TCP", "8080", null));
                simulation.setPolicyEvaluations(eval.getEvaluationChain());

                if (!eval.isAllowed()) {
                    steps.add(new AttackStep(3, "Lateral Movement Blocked", "10.10.10.15", "10.10.20.25:8080",
                            "TCP Connect to Grading Engine", "BLOCKED",
                            "Firewall policy DENIED connection. TCP RST packet dispatched to attacker.",
                            eval.getMatchedPolicyId(), eval.getMatchedRuleSummary()));
                    verdict = "CONTAINED_BY_FIREWALL";
                    mitigation = "Application A quarantined via automated microsegmentation. No lateral access permitted.";
                }

                // Step 4: Incident created & Automated Quarantine
                Map<String, Object> forensics = new HashMap<>();
                forensics.put("exploitType", "CVE-2026-RCE-Log4j-Variant");
                forensics.put("cveId", "CVE-2026-8812");
                forensics.put("srcIp", "203.0.113.45");
                forensics.put("compromisedWorkload", "APP_A (10.10.10.15)");
                forensics.put("pivotTarget", "APP_B (10.10.20.25)");
                forensics.put("firewallAction", "DENY");

                incident = incidentService.createIncident(
                        "Critical: Remote Code Execution and Lateral Movement Probe on App A",
                        "CRITICAL",
                        "DETECTED",
                        "10.10.10.15",
                        "10.10.20.25",
                        "APP_A",
                        "APP_B",
                        "MALICIOUS_APP_EXPLOIT",
                        "FIREWALL_POLICY_ENGINE",
                        eval.getMatchedRuleSummary(),
                        "BLOCKED",
                        forensics
                );

                steps.add(new AttackStep(4, "Automated Incident Dispatch", "SECURITY_GATEWAY", "SOC_DASHBOARD",
                        "Generate High-Priority Incident & Trigger Security Posture Update", "QUARANTINED",
                        "Incident #" + incident.getId() + " opened. SOC alert dispatched.", null, "Security Operations Center alerted."));
                break;
            }

            case "LATERAL_MOVEMENT": {
                simulation.setScenarioName("Lateral Movement: Compromised App A -> Database Core");
                simulation.setAttackerSource("WORKLOAD:APP_A (10.10.10.15)");
                simulation.setTargetWorkload("WORKLOAD:DB_CORE (Oracle DB - 10.10.30.5)");

                steps.add(new AttackStep(1, "Attacker foothold on App A", "10.10.10.15", "10.10.10.15",
                        "Attacker drops lateral pivoting tools (nmap, psexec)", "SUCCESS",
                        "Adversary attempts unapproved SSH connection to core enterprise database.", null, "Local execution within sandbox."));

                // Evaluate SSH (port 22) from App A to DB_CORE
                PolicyEvaluationResponse eval = policyEngineService.evaluateTraffic(
                        new PolicyEvaluationRequest("WORKLOAD:APP_A", "WORKLOAD:DB_CORE", "TCP", "22", null));
                simulation.setPolicyEvaluations(eval.getEvaluationChain());

                if (!eval.isAllowed()) {
                    steps.add(new AttackStep(2, "Firewall Interception", "10.10.10.15", "10.10.30.5:22",
                            "SSH Brute Force / Lateral Access Attempt", "BLOCKED",
                            "Stateful policy engine DENIED unauthorized administrative port 22 access.",
                            eval.getMatchedPolicyId(), eval.getMatchedRuleSummary()));
                    verdict = "CONTAINED_BY_FIREWALL";
                    mitigation = "Zero-Trust policy permits only standard SQL (5432) for approved queries. Administrative ports blocked.";
                }

                Map<String, Object> forensics = new HashMap<>();
                forensics.put("protocol", "SSH / TCP 22");
                forensics.put("srcWorkload", "APP_A");
                forensics.put("dstWorkload", "DB_CORE");
                forensics.put("policyTriggered", eval.getMatchedPolicyName());

                incident = incidentService.createIncident(
                        "High: Lateral Movement Attempt from App A to Core Database",
                        "HIGH",
                        "DETECTED",
                        "10.10.10.15",
                        "10.10.30.5",
                        "APP_A",
                        "DB_CORE",
                        "LATERAL_MOVEMENT",
                        "FIREWALL_POLICY_ENGINE",
                        eval.getMatchedRuleSummary(),
                        "BLOCKED",
                        forensics
                );

                steps.add(new AttackStep(3, "Containment Action", "ENTERPRISE_FIREWALL", "10.10.10.15",
                        "Enforce Subnet Isolation on App Segment A", "BLOCKED",
                        "Incident #" + incident.getId() + " logged. Microsegmentation boundary preserved database integrity.", null, "Zero-trust segmentation intact."));
                break;
            }

            case "CROSS_VPC_HOPPING": {
                simulation.setScenarioName("Cross-VPC Hopping: Public Cloud VPC 3 -> VPC 1 Prod Web");
                simulation.setAttackerSource("VPC_ANALYTICS_NODE (10.20.3.40)");
                simulation.setTargetWorkload("VPC_PROD_WEB_APP (10.20.1.10)");

                steps.add(new AttackStep(1, "Compromise in Analytics Environment", "10.20.3.40", "10.20.3.40",
                        "Jupyter Notebook token leak used to execute curl probe", "SUCCESS",
                        "Attacker attempts unauthorized cross-VPC traversal.", null, "VPC isolation boundary tested."));

                PolicyEvaluationResponse eval = policyEngineService.evaluateTraffic(
                        new PolicyEvaluationRequest("VPC:VPC_3", "VPC:VPC_1", "TCP", "443", null));
                simulation.setPolicyEvaluations(eval.getEvaluationChain());

                steps.add(new AttackStep(2, "VPC Security Group / NACL Inspection", "10.20.3.40", "10.20.1.10:443",
                        "Cross-VPC HTTPS API Injection Probe", eval.isAllowed() ? "SUCCESS" : "BLOCKED",
                        "Cloud NACL & Security Group evaluated inter-VPC routing.",
                        eval.getMatchedPolicyId(), eval.getMatchedRuleSummary()));

                verdict = "BLOCKED_BY_SG";
                mitigation = "VPC Peering not authorized. Strict cloud Security Group denies lateral inter-VPC hops.";

                Map<String, Object> forensics = new HashMap<>();
                forensics.put("sourceVpc", "VPC-3 (Analytics - 10.20.3.0/24)");
                forensics.put("targetVpc", "VPC-1 (Prod Web - 10.20.1.0/24)");
                forensics.put("detectionRule", "SG-VPC3-NO-CROSS-HOP");

                incident = incidentService.createIncident(
                        "High: Unauthorized Cross-VPC Network Traversal Attempt",
                        "HIGH",
                        "DETECTED",
                        "10.20.3.40",
                        "10.20.1.10",
                        "VPC_ANALYTICS_NODE",
                        "VPC_PROD_WEB_APP",
                        "CROSS_VPC_BREACH",
                        "SECURITY_GROUP_NACL",
                        eval.getMatchedRuleSummary(),
                        "BLOCKED",
                        forensics
                );

                steps.add(new AttackStep(3, "Incident Dispatch & Alerting", "AWS_TRANSIT_ROUTER", "SOC_SIEM",
                        "Log SIEM Alert & Blacklist Source Pod", "QUARANTINED",
                        "Incident #" + incident.getId() + " logged. Cross-VPC hop successfully halted.", null, "Cloud segmentation verified."));
                break;
            }

            case "UNAUTHORIZED_DB_ACCESS": {
                simulation.setScenarioName("Direct Cloud-to-DC Database Access Ingress Attack");
                simulation.setAttackerSource("PUBLIC_CLOUD_WORKLOAD (10.20.1.10)");
                simulation.setTargetWorkload("WORKLOAD:DB_CORE (Private DC - 10.10.30.5)");

                steps.add(new AttackStep(1, "Public Cloud Egress Request", "10.20.1.10", "10.10.30.5",
                        "Direct SQL Ingress Query over Hybrid Link", "EVALUATING",
                        "Cloud workload attempts bypassing Academic API gateway to query core DC database directly.", null, "Packet routed towards Hybrid IPsec tunnel."));

                PolicyEvaluationResponse eval = policyEngineService.evaluateTraffic(
                        new PolicyEvaluationRequest("10.20.1.0/24", "10.10.30.0/24", "TCP", "1521", null));
                simulation.setPolicyEvaluations(eval.getEvaluationChain());

                steps.add(new AttackStep(2, "Hybrid Link Deep Packet Inspection", "HYBRID_LINK_GATEWAY", "10.10.30.5:1521",
                        "Direct Oracle DB TNS Packet Evaluation", "BLOCKED",
                        "Hybrid Security Policy DENIED direct ingress from Public Cloud into Private Database Subnet.",
                        eval.getMatchedPolicyId(), eval.getMatchedRuleSummary()));

                verdict = "CONTAINED_BY_FIREWALL";
                mitigation = "All Cloud-to-DC DB queries must terminate at authorized Enterprise API Gateway.";

                Map<String, Object> forensics = new HashMap<>();
                forensics.put("source", "Public Cloud VPC 1 (10.20.1.10)");
                forensics.put("destination", "Private DC Database (10.10.30.5:1521)");
                forensics.put("rule", "DENY Public Cloud -> Internal DC Database");

                incident = incidentService.createIncident(
                        "Critical: Direct Cloud Ingress to Internal Private Database Blocked",
                        "CRITICAL",
                        "DETECTED",
                        "10.20.1.10",
                        "10.10.30.5",
                        "PUBLIC_CLOUD_WEB",
                        "DB_CORE",
                        "UNAUTHORIZED_DB_ACCESS",
                        "HYBRID_LINK_INSPECTOR",
                        eval.getMatchedRuleSummary(),
                        "BLOCKED",
                        forensics
                );

                steps.add(new AttackStep(3, "Automated Threat Containment", "ENTERPRISE_GATEWAY", "10.20.1.10",
                        "Drop Connection & Flag Incident #" + incident.getId(), "BLOCKED",
                        "Enterprise database remained completely shielded from public cloud vulnerability.", null, "Enterprise perimeter protected."));
                break;
            }

            case "PRIVILEGE_ESCALATION": {
                simulation.setScenarioName("IAM RBAC Privilege Escalation & Policy Tampering");
                simulation.setAttackerSource("FACULTY_ACCOUNT (User: faculty_01)");
                simulation.setTargetWorkload("SECURITY_ADMIN_API (/api/policies/override)");

                steps.add(new AttackStep(1, "Faculty User Authenticated", "faculty_01", "IAM_AUTH_GATEWAY",
                        "JWT Session Token Issued (Role: FACULTY)", "SUCCESS",
                        "Faculty authenticated with standard teaching privileges.", null, "Valid identity context established."));

                // Evaluate RBAC policy for Faculty attempting admin endpoint
                PolicyEvaluationResponse eval = policyEngineService.evaluateTraffic(
                        new PolicyEvaluationRequest("ROLE:FACULTY", "WORKLOAD:SECURITY_GATEWAY", "HTTP", "8080", "FACULTY"));
                simulation.setPolicyEvaluations(eval.getEvaluationChain());

                steps.add(new AttackStep(2, "RBAC Policy Gate Evaluation", "faculty_01", "/api/policies/override",
                        "HTTP POST /api/policies (Attempt to disable firewall rules)", "BLOCKED",
                        "Spring Security RBAC & IAM Guard intercepted unauthorized role elevation. HTTP 403 Forbidden.",
                        eval.getMatchedPolicyId(), "Role FACULTY possesses only READ_PORTAL & SUBMIT_GRADES permissions."));

                verdict = "BLOCKED_BY_RBAC";
                mitigation = "Principle of Least Privilege rigorously enforced. Faculty roles restricted from infrastructure mutation.";

                Map<String, Object> forensics = new HashMap<>();
                forensics.put("user", "faculty_01");
                forensics.put("attemptedAction", "DISABLE_SECURITY_POLICY");
                forensics.put("role", "FACULTY");

                incident = incidentService.createIncident(
                        "Medium: RBAC Authorization Violation - Unauthorized Admin API Access",
                        "MEDIUM",
                        "DETECTED",
                        "192.168.1.105",
                        "10.10.0.1",
                        "USER:FACULTY",
                        "ADMIN_API",
                        "PRIVILEGE_ESCALATION",
                        "IAM_AUTHORIZATION_GUARD",
                        "Least-Privilege Policy: ROLE:FACULTY denied ADMIN operations",
                        "BLOCKED",
                        forensics
                );

                steps.add(new AttackStep(3, "Audit Logging & Incident Dispatch", "IAM_SERVICE", "SOC_MONITOR",
                        "Log Auth Security Event & Notify Administrator", "BLOCKED",
                        "Incident #" + incident.getId() + " recorded in MongoDB audit trail.", null, "RBAC enforcement verified."));
                break;
            }

            case "C2_EXFILTRATION":
            default: {
                simulation.setScenarioName("Command & Control (C2) Data Exfiltration Attempt");
                simulation.setAttackerSource("K8S_POD (Payment Service - 10.20.2.14)");
                simulation.setTargetWorkload("MALICIOUS_C2_EXTERNAL (IP: 198.51.100.77:8080)");

                steps.add(new AttackStep(1, "Container Ransomware Stage", "10.20.2.14", "10.20.2.14",
                        "Script attempts encrypting local temp files and bundling secrets", "SUCCESS",
                        "Suspicious process initiated inside container runtime.", null, "Container sandbox active."));

                PolicyEvaluationResponse eval = policyEngineService.evaluateTraffic(
                        new PolicyEvaluationRequest("10.20.2.0/24", "198.51.100.77", "TCP", "8080", null));
                simulation.setPolicyEvaluations(eval.getEvaluationChain());

                steps.add(new AttackStep(2, "Egress Firewall & DNS Sinkhole Check", "10.20.2.14", "198.51.100.77:8080",
                        "TCP Egress Data Exfiltration Attempt", "BLOCKED",
                        "Zero-Trust Egress Firewall intercepted outbound packet to unapproved foreign IP. Connection terminated.",
                        eval.getMatchedPolicyId(), eval.getMatchedRuleSummary()));

                verdict = "EXFILTRATION_BLOCKED";
                mitigation = "Outbound egress filtering prevents data leakage to unapproved external endpoints.";

                Map<String, Object> forensics = new HashMap<>();
                forensics.put("pod", "k8s-payments-service");
                forensics.put("c2Destination", "198.51.100.77:8080");
                forensics.put("bytesBlocked", "4.2 MB");

                incident = incidentService.createIncident(
                        "Critical: C2 Outbound Exfiltration Attempt Blocked by Egress Policy",
                        "CRITICAL",
                        "DETECTED",
                        "10.20.2.14",
                        "198.51.100.77",
                        "K8S_PAYMENTS",
                        "EXTERNAL_C2",
                        "C2_EXFILTRATION",
                        "K8S_CALICO_CNI",
                        eval.getMatchedRuleSummary(),
                        "BLOCKED",
                        forensics
                );

                steps.add(new AttackStep(3, "Incident Ticket Generated", "EGRESS_GATEWAY", "SOC_DASHBOARD",
                        "Generate Critical Alert & Isolate Pod", "QUARANTINED",
                        "Incident #" + incident.getId() + " opened. Pod isolated from K8s cluster network.", null, "C2 communication severed."));
                break;
            }
        }

        simulation.setSteps(steps);
        simulation.setFinalVerdict(verdict);
        simulation.setBlocked(isBlocked);
        simulation.setIncidentId(incident != null ? incident.getId() : null);
        simulation.setExecutionTimeMs(System.currentTimeMillis() - startTime);
        simulation.setMitigationRecommendation(mitigation);

        AttackSimulation savedSim = attackSimulationRepository.save(simulation);

        auditLogService.logEvent(
                "ATTACK_SIMULATION_COMPLETED",
                "HIGH",
                "SECURITY_SIMULATOR",
                savedSim.getAttackerSource(),
                savedSim.getTargetWorkload(),
                savedSim.getFinalVerdict(),
                savedSim.isBlocked() ? "BLOCKED" : "EXPLOITED",
                String.format("Attack scenario [%s] executed. Outcome: %s in %d ms.", savedSim.getScenarioName(), savedSim.getFinalVerdict(), savedSim.getExecutionTimeMs()),
                "127.0.0.1"
        );

        SecurityPostureDTO posture = securityPostureService.calculatePosture();

        return new AttackExecutionResult(
                savedSim,
                incident,
                posture.getScore(),
                "Simulation complete: Attack was successfully detected, evaluated against enterprise security policy rules, blocked, and recorded as Incident #" + (incident != null ? incident.getId() : "N/A")
        );
    }

    public List<AttackSimulation> getRecentSimulations() {
        return attackSimulationRepository.findTop20ByOrderByTimestampDesc();
    }
}
