package com.cisco.vip.cybersecurity.controller;

import com.cisco.vip.cybersecurity.dto.DashboardStatsDTO;
import com.cisco.vip.cybersecurity.dto.SecurityPostureDTO;
import com.cisco.vip.cybersecurity.model.HybridLinkState;
import com.cisco.vip.cybersecurity.model.Incident;
import com.cisco.vip.cybersecurity.model.SecurityEvent;
import com.cisco.vip.cybersecurity.model.Workload;
import com.cisco.vip.cybersecurity.repository.*;
import com.cisco.vip.cybersecurity.service.HybridLinkService;
import com.cisco.vip.cybersecurity.service.SecurityPostureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final SecurityPostureService postureService;
    private final WorkloadRepository workloadRepository;
    private final SecurityPolicyRepository policyRepository;
    private final IncidentRepository incidentRepository;
    private final SecurityEventRepository eventRepository;
    private final UserRepository userRepository;
    private final NetworkSegmentRepository segmentRepository;
    private final HybridLinkService hybridLinkService;

    public DashboardController(SecurityPostureService postureService,
                               WorkloadRepository workloadRepository,
                               SecurityPolicyRepository policyRepository,
                               IncidentRepository incidentRepository,
                               SecurityEventRepository eventRepository,
                               UserRepository userRepository,
                               NetworkSegmentRepository segmentRepository,
                               HybridLinkService hybridLinkService) {
        this.postureService = postureService;
        this.workloadRepository = workloadRepository;
        this.policyRepository = policyRepository;
        this.incidentRepository = incidentRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.segmentRepository = segmentRepository;
        this.hybridLinkService = hybridLinkService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        SecurityPostureDTO posture = postureService.calculatePosture();
        List<Workload> workloads = workloadRepository.findAll();
        long protectedWorkloads = workloads.stream().filter(w -> !w.isCompromised()).count();
        long activePolicies = policyRepository.findByEnabledTrueOrderByPriorityAsc().size();
        long detectedThreats = incidentRepository.count();
        long blockedConnections = eventRepository.countByResult("BLOCKED") + incidentRepository.count();
        long activeUsers = userRepository.count();
        long cloudSegments = segmentRepository.findByEnvironment("PUBLIC_CLOUD").size();

        HybridLinkState linkState = hybridLinkService.getHybridLinkStatus();
        List<SecurityEvent> recentEvents = eventRepository.findTop100ByOrderByTimestampDesc();
        List<Incident> openIncidents = incidentRepository.findByStatus("DETECTED");

        Map<String, Long> trafficStats = new HashMap<>();
        trafficStats.put("allowed", 128450L);
        trafficStats.put("blocked", blockedConnections > 0 ? blockedConnections * 142 : 1240L);
        trafficStats.put("suspicious", detectedThreats * 15 + 45);

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setOverallSecurityScore(posture.getScore());
        stats.setTotalApplications(workloads.size());
        stats.setProtectedApplications((int) protectedWorkloads);
        stats.setActiveSecurityPolicies((int) activePolicies);
        stats.setDetectedThreats((int) detectedThreats);
        stats.setBlockedConnections((int) blockedConnections);
        stats.setActiveUsers((int) activeUsers);
        stats.setCloudSegments((int) cloudSegments);
        stats.setPrivateDcStatus(workloads.stream().anyMatch(w -> "PRIVATE_DATACENTER".equals(w.getEnvironment()) && w.isCompromised()) ? "COMPROMISED" : "SECURE");
        stats.setPublicCloudStatus(workloads.stream().anyMatch(w -> "PUBLIC_CLOUD".equals(w.getEnvironment()) && w.isCompromised()) ? "ELEVATED_RISK" : "SECURE");
        stats.setHybridLinkStatus(linkState.getStatus());
        stats.setRecentEvents(recentEvents.subList(0, Math.min(10, recentEvents.size())));
        stats.setOpenIncidents(openIncidents);
        stats.setTrafficStats(trafficStats);
        stats.setPostureFactorBreakdown(posture.getCategoryScores());

        return ResponseEntity.ok(stats);
    }
}
