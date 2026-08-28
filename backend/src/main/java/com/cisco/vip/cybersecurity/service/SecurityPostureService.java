package com.cisco.vip.cybersecurity.service;

import com.cisco.vip.cybersecurity.dto.SecurityPostureDTO;
import com.cisco.vip.cybersecurity.dto.SecurityPostureDTO.PostureFactor;
import com.cisco.vip.cybersecurity.model.HybridLinkState;
import com.cisco.vip.cybersecurity.model.Incident;
import com.cisco.vip.cybersecurity.model.NetworkSegment;
import com.cisco.vip.cybersecurity.model.SecurityPolicy;
import com.cisco.vip.cybersecurity.model.User;
import com.cisco.vip.cybersecurity.model.Workload;
import com.cisco.vip.cybersecurity.repository.HybridLinkRepository;
import com.cisco.vip.cybersecurity.repository.IncidentRepository;
import com.cisco.vip.cybersecurity.repository.NetworkSegmentRepository;
import com.cisco.vip.cybersecurity.repository.SecurityPolicyRepository;
import com.cisco.vip.cybersecurity.repository.UserRepository;
import com.cisco.vip.cybersecurity.repository.WorkloadRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SecurityPostureService {

    private final UserRepository userRepository;
    private final SecurityPolicyRepository policyRepository;
    private final NetworkSegmentRepository segmentRepository;
    private final WorkloadRepository workloadRepository;
    private final IncidentRepository incidentRepository;
    private final HybridLinkRepository hybridLinkRepository;

    public SecurityPostureService(UserRepository userRepository,
                                  SecurityPolicyRepository policyRepository,
                                  NetworkSegmentRepository segmentRepository,
                                  WorkloadRepository workloadRepository,
                                  IncidentRepository incidentRepository,
                                  HybridLinkRepository hybridLinkRepository) {
        this.userRepository = userRepository;
        this.policyRepository = policyRepository;
        this.segmentRepository = segmentRepository;
        this.workloadRepository = workloadRepository;
        this.incidentRepository = incidentRepository;
        this.hybridLinkRepository = hybridLinkRepository;
    }

    public SecurityPostureDTO calculatePosture() {
        int baseScore = 100;
        List<PostureFactor> positiveFactors = new ArrayList<>();
        List<PostureFactor> negativeFactors = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();
        Map<String, Integer> categoryScores = new HashMap<>();

        // 1. IAM & MFA Coverage
        List<User> users = userRepository.findAll();
        long totalUsers = users.size();
        long mfaUsers = users.stream().filter(User::isMfaEnabled).count();
        int mfaScore = totalUsers > 0 ? (int) ((mfaUsers * 100) / totalUsers) : 100;
        categoryScores.put("IAM_MFA", mfaScore);

        if (mfaScore >= 90) {
            positiveFactors.add(new PostureFactor("High MFA Enforcement", 10, "Over 90% of identity accounts have mandatory Multi-Factor Authentication active.", "IAM"));
        } else {
            int penalty = (100 - mfaScore) / 5;
            baseScore -= penalty;
            negativeFactors.add(new PostureFactor("Suboptimal MFA Coverage", -penalty, String.format("%d accounts lack MFA protection.", totalUsers - mfaUsers), "IAM"));
            recommendations.add("Enforce hardware-backed MFA across all Faculty and Developer accounts.");
        }

        // 2. Network Segmentation & Isolation
        List<NetworkSegment> segments = segmentRepository.findAll();
        long isolatedSegments = segments.stream().filter(NetworkSegment::isIsolationMode).count();
        int segScore = 95;
        if (isolatedSegments > 0) {
            segScore -= (int)(isolatedSegments * 10);
            negativeFactors.add(new PostureFactor("Segment in Containment Isolation", -(int)(isolatedSegments * 10), String.format("%d network segment(s) currently isolated under emergency quarantine.", isolatedSegments), "SEGMENTATION"));
            recommendations.add("Investigate root-cause of quarantined segments before lifting network isolation.");
        } else {
            positiveFactors.add(new PostureFactor("Microsegmentation Active", 15, "Private DC and Public Cloud VPCs separated with strict perimeter and inter-VPC boundaries.", "SEGMENTATION"));
        }
        categoryScores.put("MICROSEGMENTATION", Math.max(0, Math.min(100, segScore)));

        // 3. Security Policy Engine Health
        List<SecurityPolicy> policies = policyRepository.findAll();
        long activePolicies = policies.stream().filter(SecurityPolicy::isEnabled).count();
        long overlyPermissive = policies.stream()
                .filter(p -> p.isEnabled() && "ALLOW".equalsIgnoreCase(p.getAction()) && "ANY".equalsIgnoreCase(p.getSource()) && "ANY".equalsIgnoreCase(p.getDestination()))
                .count();

        int firewallHealth = 90;
        if (overlyPermissive > 0) {
            firewallHealth -= (int)(overlyPermissive * 15);
            baseScore -= (int)(overlyPermissive * 15);
            negativeFactors.add(new PostureFactor("Overly Permissive Firewall Rules", -(int)(overlyPermissive * 15), String.format("%d active policy allows ANY to ANY unrestricted ingress.", overlyPermissive), "FIREWALL"));
            recommendations.add("Refine wildcard policies into least-privilege source/destination tuples.");
        } else {
            positiveFactors.add(new PostureFactor("Strict Least-Privilege Policies", 15, String.format("%d granular security policies enforcing Zero-Trust access control.", activePolicies), "FIREWALL"));
        }
        categoryScores.put("FIREWALL_HEALTH", Math.max(0, Math.min(100, firewallHealth)));

        // 4. Workload Hygiene & Compromises
        List<Workload> workloads = workloadRepository.findAll();
        long compromised = workloads.stream().filter(Workload::isCompromised).count();
        long quarantined = workloads.stream().filter(Workload::isQuarantined).count();
        int workloadScore = 100;

        if (compromised > 0) {
            int compPenalty = (int) (compromised * 18);
            baseScore -= compPenalty;
            workloadScore -= compPenalty;
            negativeFactors.add(new PostureFactor("Active Compromised Workloads", -compPenalty, String.format("%d workload(s) marked as compromised or exploited.", compromised), "WORKLOAD"));
            recommendations.add("Initiate forensic containment and patch CVE vulnerabilities on affected workloads.");
        }
        if (quarantined > 0) {
            positiveFactors.add(new PostureFactor("Active Automated Quarantine", 5, String.format("%d compromised workload(s) safely isolated from east-west lateral traffic.", quarantined), "WORKLOAD"));
        }
        categoryScores.put("WORKLOAD_HYGIENE", Math.max(0, Math.min(100, workloadScore)));

        // 5. Unresolved Incidents Impact
        List<Incident> incidents = incidentRepository.findAll();
        long openCritical = incidents.stream().filter(i -> !"RESOLVED".equalsIgnoreCase(i.getStatus()) && "CRITICAL".equalsIgnoreCase(i.getSeverity())).count();
        long openHigh = incidents.stream().filter(i -> !"RESOLVED".equalsIgnoreCase(i.getStatus()) && "HIGH".equalsIgnoreCase(i.getSeverity())).count();
        long openMedium = incidents.stream().filter(i -> !"RESOLVED".equalsIgnoreCase(i.getStatus()) && "MEDIUM".equalsIgnoreCase(i.getSeverity())).count();

        int incidentPenalty = (int) (openCritical * 15 + openHigh * 8 + openMedium * 4);
        int incidentScore = Math.max(0, 100 - incidentPenalty);
        categoryScores.put("INCIDENT_IMPACT", incidentScore);

        if (incidentPenalty > 0) {
            baseScore -= incidentPenalty;
            negativeFactors.add(new PostureFactor("Unresolved High-Severity Incidents", -incidentPenalty, String.format("%d Critical, %d High, %d Medium incidents pending investigation.", openCritical, openHigh, openMedium), "INCIDENTS"));
            recommendations.add("Prioritize incident triage in the Incident Response Center.");
        } else {
            positiveFactors.add(new PostureFactor("Zero Critical Active Incidents", 10, "All detected attacks have been contained and resolved.", "INCIDENTS"));
        }

        // 6. Hybrid Link Integrity
        HybridLinkState linkState = hybridLinkRepository.findById("PRIMARY_HYBRID_LINK").orElse(null);
        int linkScore = 95;
        if (linkState != null) {
            if ("DEGRADED".equalsIgnoreCase(linkState.getStatus()) || linkState.isSimulatedDegraded()) {
                linkScore = 50;
                baseScore -= 12;
                negativeFactors.add(new PostureFactor("Hybrid Link Degraded", -12, "Encrypted IPsec tunnel experiencing packet drop or route instability.", "HYBRID_LINK"));
                recommendations.add("Failover hybrid traffic to redundant AWS Direct Connect fabric.");
            } else if ("BLOCKED".equalsIgnoreCase(linkState.getStatus())) {
                linkScore = 20;
                baseScore -= 25;
                negativeFactors.add(new PostureFactor("Hybrid Link Severed", -25, "Cross-datacenter hybrid communication link blocked.", "HYBRID_LINK"));
            } else {
                positiveFactors.add(new PostureFactor("Encrypted Hybrid Link Healthy", 10, "IPSec + AES-256-GCM / MACsec tunnel fully operational.", "HYBRID_LINK"));
            }
        }
        categoryScores.put("HYBRID_LINK_INTEGRITY", linkScore);

        int finalScore = Math.max(12, Math.min(100, baseScore));
        String grade = finalScore >= 90 ? "A+" : finalScore >= 80 ? "A" : finalScore >= 70 ? "B" : finalScore >= 55 ? "C" : finalScore >= 40 ? "D" : "F";
        String summary = finalScore >= 85 
                ? "Enterprise Hybrid Security Posture is robust with active Zero-Trust segmentation and automated containment."
                : finalScore >= 65
                ? "Moderate security posture with active containment measures; attention required on open incident triage."
                : "Elevated risk profile due to active compromise or unresolved high-severity security incidents.";

        SecurityPostureDTO dto = new SecurityPostureDTO();
        dto.setScore(finalScore);
        dto.setGrade(grade);
        dto.setStatusSummary(summary);
        dto.setCategoryScores(categoryScores);
        dto.setPositiveFactors(positiveFactors);
        dto.setNegativeFactors(negativeFactors);
        dto.setRecommendations(recommendations);
        return dto;
    }
}
