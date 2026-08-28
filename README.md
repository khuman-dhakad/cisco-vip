# Secure Hybrid Data Center Network Security & Attack Containment Platform
### Cisco AICTE Virtual Internship Program (VIP) 2026 — Cyber Security Track

---

## 🎓 Project & Candidate Information

- **Student Name:** KHUMAN DHAKAD
- **College / Institution:** Lakshmi Narain College of Technology (LNCT), Bhopal
- **Program:** Cisco AICTE Virtual Internship Program 2026
- **Specialization Track:** Cyber Security
- **Project Domain:** Hybrid Cloud Network Security, Zero-Trust Architecture, Microsegmentation, and Automated Incident Response
- **Repository Branch:** `feature/cisco-hybrid-cybersecurity-platform`

---

## 📌 Problem Statement

Modern academic and enterprise organizations frequently operate in a **hybrid environment**, connecting on-premise private data centers with public cloud infrastructure. While this hybrid model offers scalability and flexibility, it introduces severe architectural security vulnerabilities:

1. **Perimeter-Centric Defenses & Flat Internal Networks:** Traditional security relies heavily on external firewalls. Once an adversary compromises an exposed application, the lack of internal segmentation allows unrestricted lateral movement across adjacent subnets.
2. **Direct Ingress & Data Exposure:** High-value databases are frequently exposed to uninspected cross-premise queries from public cloud Virtual Private Clouds (VPCs) crossing unsegmented hybrid transit trunks.
3. **Broad Privilege & IAM Deficits:** Generic credentials without strict Role-Based Access Control (RBAC) and Multi-Factor Authentication (MFA) allow privilege escalation when service accounts or low-privilege user credentials are leaked.

---

## 💡 Proposed Solution

The **Secure Hybrid Data Center Network Security & Attack Containment Platform** is a full-stack, locally runnable cybersecurity simulation and operations platform. It demonstrates how organizations can apply **NIST SP 800-207 Zero-Trust Architecture** and **Cisco SAFE Network Security** guidelines to protect hybrid workloads.

The platform provides:
- **Centralized IAM & 6-Tier RBAC Governance:** Stateless JWT authentication (HMAC-SHA512), BCrypt password hashing, and enforced MFA.
- **Microsegmented Hybrid Topology:** Private Datacenter subnets (`10.10.0.0/16`) and Public Cloud VPCs (`10.20.0.0/16`) separated by stateful Next-Gen Firewall (NGFW) boundaries and Calico CNI rules.
- **Priority-Driven Stateful Policy Engine:** Evaluates Layer 3 to Layer 7 traffic against explicit permit rules with an implicit Zero-Trust default-deny boundary.
- **Red-Team Attack Simulation & Automated Containment:** 6 interactive multi-vector attack scenarios evaluated live against active firewall policies, triggering automated incident dispatches, workload quarantine, and real-time security posture recalculation.
- **Continuous SIEM Telemetry & Audit Logging:** Immutable MongoDB event persistence, live packet flow metrics, and a dynamic 0–100 Security Posture Score.

---

## 🏗️ Hybrid System Architecture

```
                                  [ REMOTE & CAMPUS IDENTITIES ]
                           (Security Admins, Net Admins, Developers, Faculty)
                                              │
                                              ▼ (TLS 1.3 + MFA + JWT Claims)
                                  [ CENTRAL IAM & MFA GATEWAY ]
                                     (JWT Claims & RBAC Filter)
                                              │
                                              ▼
                             [ STATEFUL ENTERPRISE GATEWAY NGFW ]
                               (Priority-Based Policy Engine)
                                    /                   \
                                   /                     \
      ┌───────────────────────────┴───┐               ┌───┴───────────────────────────┐
      │     PRIVATE DATA CENTER       │               │      PUBLIC CLOUD (AWS)       │
      │         10.10.0.0/16          │               │         10.20.0.0/16          │
      ├───────────────────────────────┤               ├───────────────────────────────┤
      │ • Management (10.10.0.0/24)   │               │ • VPC 1: Prod Web (10.20.1.0) │
      │ • App Segment A (10.10.10.0)  │  Encrypted    │ • VPC 2: K8s Pods (10.20.2.0) │
      │ • App Segment B (10.10.20.0)  │◄─────────────►│ • VPC 3: Analytics (10.20.3.0)│
      │ • Database Core (10.10.30.0)  │  Hybrid Trunk │ • Cloud Security Groups       │
      │   (Oracle DB 19c Core)        │ (AES-256-GCM) │ • Calico East-West Policies   │
      │ • Subnet Isolation Controls   │               │ • Namespace Microsegmentation │
      └───────────────────────────────┘               └───────────────────────────────┘
                                              ▲
                                              │
                               ┌──────────────┴──────────────┐
                               │     SOC RESPONSE CENTER     │
                               │ • Live Threat Forensics     │
                               │ • Automated Pod Quarantine  │
                               │ • Score Recalculation (0-100│
                               │ • MongoDB SIEM Audit Trail  │
                               └─────────────────────────────┘
```

---

## 🛡️ Core Security Model & Zero Trust Principles

The platform is designed around the **7 NIST Zero Trust Principles**:

| Principle | Description | Platform Implementation |
| :--- | :--- | :--- |
| **1. Never Trust, Always Verify** | No entity has default trust, whether inside or outside the perimeter. | JWT RS256 token verification + MFA challenges on all endpoints. |
| **2. Least-Privilege Access** | Users receive only minimum permissions required for their specific job. | 6-tier RBAC matrix restricting Faculty from DB admin and Devs from firewall rules. |
| **3. Explicit Authorization** | All traffic dropped unless matching an active permit rule. | Priority firewall rule engine with implicit Zero-Trust default-deny boundary. |
| **4. Network Microsegmentation** | Subnets partitioned to minimize adversary blast radius. | Private DC subnets (`10.10.0.0/16`) and Cloud VPCs (`10.20.0.0/16`) with strict ACLs. |
| **5. Assume Breach Mentality** | Infrastructure assumes perimeter compromise and focuses on containment. | Red-Team Attack Simulator + 1-click workload isolation in SOC Incident Center. |
| **6. Continuous Telemetry** | Cross-premise telemetry collected and analyzed in real-time. | MongoDB SIEM audit trail and live packet throughput visualizers. |
| **7. Hybrid Trunk Encryption** | All cross-premise communication is hardware-encrypted. | IPsec VPN + Direct Connect running AES-256-GCM and 802.1AE MACsec. |

---

## ⚔️ Red-Team Attack Scenarios & Automated Containment

The platform features 6 interactive attack scenarios evaluated against the live policy engine:

1. **Compromised Application A (CVE-2026-RCE):** Initial perimeter compromise of Academic Portal (`10.10.10.15`). Adversary attempts lateral reconnaissance to App B (`10.10.20.25`); Firewall Policy #130 blocks lateral pivot.
2. **Lateral Movement to Database Core:** Attacker on App A attempts SSH (Port 22) administrative pivot into Core DB (`10.10.30.5`); Policy #135 permits SQL (5432) but strictly DENIES administrative SSH.
3. **Cross-VPC Hopping Probe:** Compromised VPC 3 Analytics node attempts unpeered traversal into VPC 1 Production Web; Cloud Security Group #150 drops packet.
4. **Direct Cloud-to-DC Database Attack:** External adversary bypasses API proxy attempting direct ingress into internal database; Policy #140 terminates connection.
5. **IAM RBAC Privilege Escalation:** Faculty account attempts invoking administrative policy modification endpoint; Spring Security RBAC intercepts with HTTP 403 Forbidden.
6. **Suspicious C2 Data Exfiltration:** Compromised container attempts exfiltrating credentials to external botnet IP (`198.51.100.77`); Egress Policy #170 drops socket.

---

## 💻 Technology Stack & Implementation Scope

### Actually Implemented
- **Backend:** Java 21, Spring Boot 3.3.3, Spring Security 6, Spring Data MongoDB, JJWT 0.12.6, Maven
- **Database:** MongoDB 8.2 (Local daemon on port 27017)
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Testing:** JUnit 5, Mockito, Spring Boot Test, Maven Surefire

### Simulated in Software
- **Network Subnets & CIDRs:** Subnet boundaries (`10.10.0.0/16`, `10.20.0.0/16`), packet flow latency, and link degradation.
- **Container Namespaces:** Kubernetes Calico CNI East-West policy rules.

### Proposed / Architectural Representation
- Physical Cisco Firepower/ASA appliances and real AWS Direct Connect physical cross-connects.

---

## 🚀 Quick Start Guide (Local Setup)

### Prerequisites
- **Java 21 (JDK)**
- **Maven 3.9+**
- **Node.js 18+ / npm 10+**
- **MongoDB 8.x** (Running locally on `mongodb://localhost:27017`)

### 1. Start MongoDB Daemon
Ensure the MongoDB server is running:
```bash
# Windows PowerShell
mongod.exe --dbpath C:\Users\hp\Desktop\Cisco-vip\data\db --port 27017
```

### 2. Start the Spring Boot Backend Server
```bash
cd backend
mvn clean spring-boot:run
```
*Backend initializes at `http://localhost:8080` and auto-seeds users, subnets, workloads, and security policies.*

### 3. Start the React Vite Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend opens at `http://localhost:5173`.*

---

## 👥 Demo User Accounts & Roles

| Username | Password | Role | Permissions |
| :--- | :--- | :--- | :--- |
| `secadmin` | `Admin@123` | `SECURITY_ADMIN` | Full System & Policy Admin, Containment, Simulations |
| `netadmin` | `Admin@123` | `NETWORK_ADMIN` | Stateful Firewall Policy Engine, Subnet Management |
| `cloudadmin` | `Admin@123` | `CLOUD_ADMIN` | Cloud Security Groups, VPC Topology |
| `developer` | `Dev@123` | `DEVELOPER` | Microservice Deployment, Namespace Inspection |
| `faculty` | `Faculty@123` | `FACULTY` | Teaching Portal, Academic Records (No DB/Admin access) |
| `auditor` | `Audit@123` | `AUDITOR` | Read-Only SIEM Telemetry & Audit Logs |

---

## 📋 13-Step Reviewer Demonstration Walkthrough

1. Open `http://localhost:5173` and click **"Launch 13-Step Guided Demo"**.
2. **Step 1:** Review the SOC Overview and initial calculated security posture score (95/100).
3. **Step 2:** Explore the **Interactive Hybrid Architecture Graph**.
4. **Step 3:** Examine the **IAM RBAC Matrix** and toggle MFA challenges.
5. **Step 4:** Inspect **Network Microsegmentation** (DC Subnets vs Cloud VPCs).
6. **Step 5:** Inspect the **Stateful Security Policy Engine** and run live packet evaluation.
7. **Step 6–8:** Select Application A, mark it compromised, and launch **Lateral Movement Attack**.
8. **Step 9–10:** Observe the **Attack Path Trace** and verify **Policy #130 BLOCKED** verdict.
9. **Step 11:** Inspect the generated **SOC Incident Ticket** with packet forensics.
10. **Step 12:** Click **"Quarantine & Contain"** to isolate the workload.
11. **Step 13:** Verify the **Final Security Posture** and incident containment status.

---

## 🧪 Actual Verification & Quality Gate Results

| Test Category | Command / Verification Check | Result |
| :--- | :--- | :--- |
| **Backend Unit & Integration Tests** | `mvn test` | **5/5 Tests Passed** (`PolicyEngineTest.java`) |
| **Frontend Production Build** | `npm run build` (tsc + vite) | **Passed in 32s with 0 errors** |
| **MongoDB Persistence** | Connection to port 27017 | **Active & Seeding Collections** |
| **API Health Check** | `GET http://localhost:8080/api/health` | **200 OK** (Status: UP, Candidate: Khuman Dhakad) |
| **JWT Authentication** | `POST http://localhost:8080/api/auth/login` | **200 OK** (Token issued for `secadmin`) |
| **Attack Simulation Execution** | `POST /api/attacks/simulate` | **200 OK** (`CONTAINED_BY_FIREWALL`) |
| **Incident Quarantine & Posture** | `PUT /api/incidents/{id}` | **200 OK** (Workload quarantined, Score updated) |

---

## ⚠️ Limitations & Future Scope

### Limitations
1. **Application-Level Simulation:** Network topologies and packet routing are simulated in software rather than executing across physical Cisco Catalyst or Firepower hardware appliances.
2. **Structured Payload Evaluation:** Packet inspection operates on structured JSON metadata rather than raw binary PCAP packet streams.
3. **Deterministic Rules:** Threat detection relies on prioritized security rules rather than machine learning behavioral anomaly detection.

### Future Scope
1. **eBPF Kernel Inspection:** Integrate live eBPF Linux kernel packet filters for real-time host-level socket inspection.
2. **Cisco DevNet RESTCONF Integration:** Connect backend directly to physical Cisco routers via RESTCONF/NETCONF APIs to deploy live ACL rules.
3. **AI Anomaly Detection:** Implement machine-learning-based behavioral analysis for zero-day threat detection.

---

## 📂 Documentation & Submission Assets

- [docs/Khuman_Dhakad_Cisco_Project_Summary.pdf](file:///c:/Users/hp/Desktop/Cisco-vip/docs/Khuman_Dhakad_Cisco_Project_Summary.pdf) (5-page Comprehensive Report)
- [docs/Khuman_Dhakad_Cisco_Project_Summary_Short.pdf](file:///c:/Users/hp/Desktop/Cisco-vip/docs/Khuman_Dhakad_Cisco_Project_Summary_Short.pdf) (2-page Executive Summary)
- [docs/Khuman_Dhakad_Cisco_Project_Summary.docx](file:///c:/Users/hp/Desktop/Cisco-vip/docs/Khuman_Dhakad_Cisco_Project_Summary.docx) (Editable Word Report)
- [docs/viva-notes.md](file:///c:/Users/hp/Desktop/Cisco-vip/docs/viva-notes.md) (19 Viva Voce Questions & Answers)
- [docs/presentation-script.md](file:///c:/Users/hp/Desktop/Cisco-vip/docs/presentation-script.md) (3-Minute Presentation Script)
- [docs/architecture.md](file:///c:/Users/hp/Desktop/Cisco-vip/docs/architecture.md) (Network Topology & CIDR Subnets)
- [docs/security-model.md](file:///c:/Users/hp/Desktop/Cisco-vip/docs/security-model.md) (IAM RBAC & Policy Evaluation Math)
- [docs/api.md](file:///c:/Users/hp/Desktop/Cisco-vip/docs/api.md) (REST API Specifications)
- [docs/demo-guide.md](file:///c:/Users/hp/Desktop/Cisco-vip/docs/demo-guide.md) (Reviewer Step-by-Step Guide)

---

## 📄 License & Attribution

Developed for the **Cisco AICTE Virtual Internship Program 2026** by **KHUMAN DHAKAD** (Lakshmi Narain College of Technology, Bhopal). All rights reserved.
