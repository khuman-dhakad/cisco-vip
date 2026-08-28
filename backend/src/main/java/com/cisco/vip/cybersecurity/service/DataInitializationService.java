package com.cisco.vip.cybersecurity.service;

import com.cisco.vip.cybersecurity.model.*;
import com.cisco.vip.cybersecurity.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DataInitializationService implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializationService.class);

    private final UserRepository userRepository;
    private final SecurityPolicyRepository policyRepository;
    private final NetworkSegmentRepository segmentRepository;
    private final WorkloadRepository workloadRepository;
    private final IncidentRepository incidentRepository;
    private final SecurityEventRepository eventRepository;
    private final HybridLinkRepository hybridLinkRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public DataInitializationService(UserRepository userRepository,
                                     SecurityPolicyRepository policyRepository,
                                     NetworkSegmentRepository segmentRepository,
                                     WorkloadRepository workloadRepository,
                                     IncidentRepository incidentRepository,
                                     SecurityEventRepository eventRepository,
                                     HybridLinkRepository hybridLinkRepository,
                                     PasswordEncoder passwordEncoder,
                                     UserService userService) {
        this.userRepository = userRepository;
        this.policyRepository = policyRepository;
        this.segmentRepository = segmentRepository;
        this.workloadRepository = workloadRepository;
        this.incidentRepository = incidentRepository;
        this.eventRepository = eventRepository;
        this.hybridLinkRepository = hybridLinkRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        logger.info("Checking and initializing Cisco VIP Cyber Security MongoDB seed dataset...");

        seedUsers();
        seedSegments();
        seedWorkloads();
        seedPolicies();
        seedHybridLink();
        seedSampleIncidentsAndEvents();

        logger.info("MongoDB seed data initialization complete.");
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            logger.info("Seeding initial IAM RBAC user directory...");
            List<User> users = Arrays.asList(
                    new User("secadmin", "Khuman Dhakad (Lead SecOps)", "khuman.dhakad@cisco-vip.lnct.ac.in",
                            passwordEncoder.encode("Admin@123"), Role.SECURITY_ADMIN, "Cyber Security Operations", true,
                            userService.getDefaultPermissionsForRole(Role.SECURITY_ADMIN)),
                    new User("netadmin", "Anand Sharma (Network Arch)", "anand.sharma@cisco-vip.lnct.ac.in",
                            passwordEncoder.encode("Admin@123"), Role.NETWORK_ADMIN, "Hybrid Infrastructure", true,
                            userService.getDefaultPermissionsForRole(Role.NETWORK_ADMIN)),
                    new User("cloudadmin", "Neha Verma (Cloud Architect)", "neha.verma@cisco-vip.lnct.ac.in",
                            passwordEncoder.encode("Admin@123"), Role.CLOUD_ADMIN, "Public Cloud Platform", true,
                            userService.getDefaultPermissionsForRole(Role.CLOUD_ADMIN)),
                    new User("developer", "Rahul Patel (App Developer)", "rahul.patel@cisco-vip.lnct.ac.in",
                            passwordEncoder.encode("Dev@123"), Role.DEVELOPER, "Academic Applications", true,
                            userService.getDefaultPermissionsForRole(Role.DEVELOPER)),
                    new User("faculty", "Dr. Rajesh Gupta (LNCT Faculty)", "rajesh.gupta@lnct.ac.in",
                            passwordEncoder.encode("Faculty@123"), Role.FACULTY, "Computer Science & Engineering", true,
                            userService.getDefaultPermissionsForRole(Role.FACULTY)),
                    new User("auditor", "Pooja Mehta (Compliance Auditor)", "pooja.mehta@cisco-vip.lnct.ac.in",
                            passwordEncoder.encode("Audit@123"), Role.AUDITOR, "Security Governance & Audit", true,
                            userService.getDefaultPermissionsForRole(Role.AUDITOR))
            );
            userRepository.saveAll(users);
        }
    }

    private void seedSegments() {
        if (segmentRepository.count() == 0) {
            logger.info("Seeding hybrid network segments...");
            List<NetworkSegment> segments = Arrays.asList(
                    new NetworkSegment("Private DC - Management", "PRIVATE_DATACENTER", "10.10.0.0/24", "VPC-CORE-DC",
                            "MANAGEMENT", false, 3, "Enterprise IT Management, Bastion Host, and SIEM Collectors",
                            Arrays.asList("ADMIN_VPN"), Arrays.asList("10.10.0.0/16", "10.20.0.0/16"), "HEALTHY", "LOW"),

                    new NetworkSegment("Private DC - App Segment A", "PRIVATE_DATACENTER", "10.10.10.0/24", "VPC-CORE-DC",
                            "APPLICATION", false, 4, "Academic Portal, Student Enrollment, and Web Workloads",
                            Arrays.asList("CAMPUS_GATEWAY", "VPC-1"), Arrays.asList("10.10.30.0/24"), "HEALTHY", "LOW"),

                    new NetworkSegment("Private DC - App Segment B", "PRIVATE_DATACENTER", "10.10.20.0/24", "VPC-CORE-DC",
                            "APPLICATION", false, 3, "Grading Engine, Examination Processing, and Faculty Evaluation",
                            Arrays.asList("CAMPUS_GATEWAY"), Arrays.asList("10.10.30.0/24"), "HEALTHY", "LOW"),

                    new NetworkSegment("Private DC - Database Segment", "PRIVATE_DATACENTER", "10.10.30.0/24", "VPC-CORE-DC",
                            "DATABASE", false, 2, "High-Security Oracle Database Cluster & SIS Student Record Stores",
                            Arrays.asList("10.10.10.0/24", "10.10.20.0/24"), Arrays.asList("10.10.0.0/24"), "HEALTHY", "LOW"),

                    new NetworkSegment("Public Cloud - VPC 1 (Prod Web)", "PUBLIC_CLOUD", "10.20.1.0/24", "VPC-PROD-WEB",
                            "PUBLIC_WEB", false, 5, "Scalable Cloud Frontends, Public API Gateways, and Content Relays",
                            Arrays.asList("0.0.0.0/0:443"), Arrays.asList("10.10.10.0/24"), "HEALTHY", "LOW"),

                    new NetworkSegment("Public Cloud - VPC 2 (Microservices)", "PUBLIC_CLOUD", "10.20.2.0/24", "VPC-K8S-MICRO",
                            "MICROSERVICES", false, 6, "Kubernetes / Containerized Payment & Research Compute Clusters",
                            Arrays.asList("VPC-1"), Arrays.asList("INTERNAL_K8S"), "HEALTHY", "LOW"),

                    new NetworkSegment("Public Cloud - VPC 3 (Analytics)", "PUBLIC_CLOUD", "10.20.3.0/24", "VPC-ANALYTICS",
                            "ANALYTICS", false, 3, "BigData Lake, Machine Learning Training Nodes, and Reporting ETL",
                            Arrays.asList("VPC-1"), Arrays.asList("CLOUD_STORAGE"), "HEALTHY", "LOW")
            );
            segmentRepository.saveAll(segments);
        }
    }

    private void seedWorkloads() {
        if (workloadRepository.count() == 0) {
            logger.info("Seeding hybrid application workloads...");
            List<Workload> workloads = Arrays.asList(
                    new Workload("Workload-App-A (Academic Portal)", "APP_A", "SEG-APP-A", "Private DC - App Segment A",
                            "10.10.10.15", "academic", "VM", "HEALTHY", false, false, 18,
                            Arrays.asList("OpenSSL 1.1.1 (Patched)", "Log4j 2.17.1 (Patched)"), 4,
                            Arrays.asList("TCP:80 (HTTP)", "TCP:443 (HTTPS)", "TCP:8080 (API)"), "PRIVATE_DATACENTER"),

                    new Workload("Workload-App-B (Grading Engine)", "APP_B", "SEG-APP-B", "Private DC - App Segment B",
                            "10.10.20.25", "grading", "MICROSERVICE", "HEALTHY", false, false, 12,
                            Arrays.asList("Node.js 20.x", "Spring Boot 3.3"), 3,
                            Arrays.asList("TCP:8080 (Grading API)", "TCP:8443 (mTLS)"), "PRIVATE_DATACENTER"),

                    new Workload("Database-Core-Oracle (SIS Core DB)", "DB_CORE", "SEG-DB", "Private DC - Database Segment",
                            "10.10.30.5", "database", "DATABASE_INSTANCE", "HEALTHY", false, false, 5,
                            Arrays.asList("Oracle DB 19c Enterprise (Hardened)"), 5,
                            Arrays.asList("TCP:1521 (Oracle SQL)", "TCP:5432 (Postgres Bridge)"), "PRIVATE_DATACENTER"),

                    new Workload("Cloud-Web-Frontend (Public Web)", "CLOUD_WEB", "SEG-VPC1", "Public Cloud - VPC 1 (Prod Web)",
                            "10.20.1.10", "public-web", "KUBERNETES_POD", "HEALTHY", false, false, 15,
                            Arrays.asList("Nginx Alpine 1.25"), 3,
                            Arrays.asList("TCP:80 (HTTP)", "TCP:443 (HTTPS)"), "PUBLIC_CLOUD"),

                    new Workload("K8s-Payment-Service (Finance)", "K8S_PAYMENTS", "SEG-VPC2", "Public Cloud - VPC 2 (Microservices)",
                            "10.20.2.14", "finance", "KUBERNETES_POD", "HEALTHY", false, false, 10,
                            Arrays.asList("Java OpenJDK 21", "PCI-DSS Hardened Base"), 4,
                            Arrays.asList("TCP:9000 (gRPC Finance)", "TCP:9443 (mTLS)"), "PUBLIC_CLOUD"),

                    new Workload("K8s-Research-Engine (AI Lab)", "K8S_RESEARCH", "SEG-VPC2", "Public Cloud - VPC 2 (Microservices)",
                            "10.20.2.22", "research", "KUBERNETES_POD", "HEALTHY", false, false, 14,
                            Arrays.asList("Python 3.11 PyTorch Pod"), 3,
                            Arrays.asList("TCP:8888 (Jupyter)", "TCP:5000 (MLflow)"), "PUBLIC_CLOUD"),

                    new Workload("VPC-Analytics-Node (Data Lake)", "VPC_ANALYTICS_NODE", "SEG-VPC3", "Public Cloud - VPC 3 (Analytics)",
                            "10.20.3.40", "analytics", "VM", "HEALTHY", false, false, 12,
                            Arrays.asList("Spark Driver Node 3.5"), 3,
                            Arrays.asList("TCP:7077 (Spark Master)", "TCP:8080 (WebUI)"), "PUBLIC_CLOUD")
            );
            workloadRepository.saveAll(workloads);
        }
    }

    private void seedPolicies() {
        if (policyRepository.count() == 0) {
            logger.info("Seeding stateful firewall and security group policies...");
            List<SecurityPolicy> policies = Arrays.asList(
                    new SecurityPolicy("ALLOW Faculty -> Academic Portal (Web)", "ROLE:FACULTY", "WORKLOAD:APP_A",
                            "TCP", "443", "ALLOW", 100,
                            "Allows authenticated faculty members to access the Academic Teaching Portal over secure HTTPS.",
                            true, "ENTERPRISE_GATEWAY", "IAM_EGRESS"),

                    new SecurityPolicy("ALLOW App A -> Database Core (SQL Query)", "WORKLOAD:APP_A", "WORKLOAD:DB_CORE",
                            "TCP", "5432", "ALLOW", 110,
                            "Permits Academic Portal to execute authorized database queries on standard SQL port.",
                            true, "PRIVATE_DC", "MICROSEGMENTATION"),

                    new SecurityPolicy("ALLOW App B -> Database Core (SQL Query)", "WORKLOAD:APP_B", "WORKLOAD:DB_CORE",
                            "TCP", "5432", "ALLOW", 115,
                            "Permits Grading Engine to record evaluation data into Core Database on standard SQL port.",
                            true, "PRIVATE_DC", "MICROSEGMENTATION"),

                    new SecurityPolicy("ALLOW Cloud Frontend -> Hybrid App A Relay", "10.20.1.0/24", "10.10.10.0/24",
                            "TCP", "443", "ALLOW", 120,
                            "Permits approved public cloud relay proxy to communicate with private DC App Segment A over hybrid tunnel.",
                            true, "HYBRID_LINK", "ZERO_TRUST"),

                    new SecurityPolicy("DENY App A -> App B (Lateral Movement Prevention)", "WORKLOAD:APP_A", "WORKLOAD:APP_B",
                            "ANY", "ANY", "DENY", 130,
                            "Prevents lateral pivoting between separate application tiers within Private Datacenter.",
                            true, "PRIVATE_DC", "LATERAL_CONTAINMENT"),

                    new SecurityPolicy("DENY App A -> Database Core (Admin SSH Port)", "WORKLOAD:APP_A", "WORKLOAD:DB_CORE",
                            "TCP", "22", "DENY", 135,
                            "Blocks administrative SSH protocol attempts from application workloads to database core.",
                            true, "PRIVATE_DC", "ZERO_TRUST"),

                    new SecurityPolicy("DENY Public Cloud -> Internal DC Database Ingress", "10.20.0.0/16", "10.10.30.0/24",
                            "ANY", "ANY", "DENY", 140,
                            "Strict boundary rule: Public Cloud VPCs cannot query Private Datacenter Databases directly.",
                            true, "HYBRID_LINK", "MICROSEGMENTATION"),

                    new SecurityPolicy("DENY Cross-VPC Hopping (VPC 3 Analytics -> VPC 1 Prod Web)", "VPC:VPC_3", "VPC:VPC_1",
                            "ANY", "ANY", "DENY", 150,
                            "Security Group rule denying unauthorized cross-VPC communication without explicit peering route.",
                            true, "PUBLIC_CLOUD_SG", "MICROSEGMENTATION"),

                    new SecurityPolicy("DENY K8s Payments -> K8s Research (Namespace Isolation)", "K8S_PAYMENTS", "K8S_RESEARCH",
                            "ANY", "ANY", "DENY", 160,
                            "Kubernetes CNI Calico NetworkPolicy enforcing microservice namespace boundary.",
                            true, "K8S_NETWORK_POLICY", "MICROSEGMENTATION"),

                    new SecurityPolicy("DENY Workloads -> Malicious External C2 Egress", "10.20.2.0/24", "198.51.100.77",
                            "ANY", "ANY", "DENY", 170,
                            "Enterprise Egress Firewall rule blocking outbound Command & Control (C2) botnet connections.",
                            true, "ENTERPRISE_GATEWAY", "LATERAL_CONTAINMENT"),

                    new SecurityPolicy("ALLOW Internal DNS & Gateway Health Checks", "10.0.0.0/8", "10.10.0.2",
                            "UDP", "53", "ALLOW", 200,
                            "Permits hybrid enterprise core DNS resolution across all segments.",
                            true, "ENTERPRISE_GATEWAY", "ZERO_TRUST")
            );
            policyRepository.saveAll(policies);
        }
    }

    private void seedHybridLink() {
        if (hybridLinkRepository.count() == 0) {
            logger.info("Seeding hybrid link status...");
            HybridLinkState defaultLink = new HybridLinkState(
                    "SECURE",
                    "Redundant IPsec VPN + AWS Direct Connect Dedicated Trunk",
                    "AES-256-GCM / SHA-384 / IKEv2 / MACsec 802.1AE",
                    "10 Gbps Enterprise Backbone",
                    4,
                    0.001,
                    false,
                    Arrays.asList("10.10.0.0/16 <-> 10.20.0.0/16 (Approved Hybrid Sync)", "10.10.10.0/24 <-> 10.20.1.0/24 (Academic API Relay)"),
                    Arrays.asList("0.0.0.0/0 Direct DC Egress", "10.20.3.0/24 -> 10.10.30.0/24 (Direct DB Ingress blocked)"),
                    14892048500L,
                    9420815L
            );
            hybridLinkRepository.save(defaultLink);
        }
    }

    private void seedSampleIncidentsAndEvents() {
        if (incidentRepository.count() == 0) {
            logger.info("Seeding initial security events and baseline incidents...");
            Map<String, Object> payload = new HashMap<>();
            payload.put("src", "203.0.113.88");
            payload.put("target", "10.10.10.15");
            payload.put("vector", "Unauthenticated HTTP SYN Flood");

            Incident inc = new Incident(
                    "Port Scan Probe Blocked by Gateway Perimeter",
                    "LOW",
                    "RESOLVED",
                    "203.0.113.88",
                    "10.10.10.15",
                    "EXTERNAL_INTERNET",
                    "APP_A",
                    "MALICIOUS_APP_EXPLOIT",
                    "ENTERPRISE_GATEWAY",
                    "DENY Unknown External Ingress",
                    "BLOCKED",
                    payload
            );
            inc.setResolvedAt(Instant.now());
            inc.setResolvedBy("secadmin");
            inc.setContainmentNotes("Automatic rate-limiting dropped unauthenticated probe packets.");
            incidentRepository.save(inc);

            List<SecurityEvent> events = Arrays.asList(
                    new SecurityEvent("AUTH_ATTEMPT", "INFO", "secadmin", "127.0.0.1", "IAM_PORTAL", "LOGIN", "SUCCESS", "Administrator login verified with MFA.", "127.0.0.1"),
                    new SecurityEvent("POLICY_VIOLATION", "MEDIUM", "SYSTEM", "10.10.10.15", "10.10.20.25", "TCP_CONNECT", "BLOCKED", "Policy #102 blocked lateral connection.", "127.0.0.1"),
                    new SecurityEvent("TRAFFIC_FLOW", "INFO", "SYSTEM", "10.20.1.10", "10.10.10.15", "RELAY_HTTPS", "ALLOW", "Hybrid API relay transaction routed.", "127.0.0.1"),
                    new SecurityEvent("POSTURE_UPDATED", "INFO", "SYSTEM", "POSTURE_ENGINE", "ENTERPRISE", "RECALCULATE", "SUCCESS", "Security posture recalculated to 95/100 (Grade A+).", "127.0.0.1")
            );
            eventRepository.saveAll(events);
        }
    }
}
