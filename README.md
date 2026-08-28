# Secure Hybrid Data Center Network Security & Attack Containment Platform
### Cisco AICTE Virtual Internship Program (VIP) 2026 — Cyber Security Track

---

## 🎓 Project & Candidate Information

- **Student Name:** KHUMAN DHAKAD
- **College / Institution:** Lakshmi Narain College of Technology (LNCT), Bhopal
- **Program:** Cisco AICTE Virtual Internship Program 2026
- **Specialization Track:** Cyber Security
- **Domain:** Hybrid Cloud Architecture, Zero-Trust Defense, Network Microsegmentation, and Automated Incident Response

---

## 📌 Executive Summary & Problem Context

Modern higher education and enterprise organizations increasingly adopt **Hybrid Cloud Architectures** to balance on-premise governance with cloud scalability. However, hybrid environments face severe attack vectors:
1. Perimeter vulnerabilities allowing initial foothold into peripheral workloads.
2. Unrestricted lateral movement across flat internal subnets.
3. Unauthorized cross-VPC hopping and uninspected traffic crossing hybrid Direct Connect / IPsec links.
4. Direct ingress attacks against core internal databases.
5. Inadequate IAM role partitioning allowing credential theft and privilege escalation.

### Solution Overview
The **Secure Hybrid Data Center Network Security & Attack Containment Platform** delivers an enterprise-grade, locally runnable simulation and defense environment modeled after **NIST SP 800-207 Zero Trust Architecture** and **Cisco SAFE Network Architecture**.

The platform features:
- **Centralized Identity & RBAC Matrix:** 6-tier role-based access control with enforced Multi-Factor Authentication (MFA) and cryptographic JWT claims.
- **Microsegmented Hybrid Topology:** Private On-Premise Data Center (`10.10.0.0/16`) and Public Cloud VPCs (`10.20.0.0/16`) separated by stateful Next-Gen Firewall (NGFW) boundaries and Calico CNI policies.
- **Priority-Driven Stateful Policy Engine:** Evaluates Layer 3–7 traffic with implicit default-deny boundary protection.
- **Red-Team Attack Simulation & Containment:** 6 interactive multi-stage attack scenarios evaluated live against the security policy engine, producing automated incident dispatches, workload isolation, and mathematical security posture recalculation.
- **Real-Time SIEM Monitoring & Telemetry:** Full visibility into packet throughput, authentication challenges, and an immutable MongoDB audit trail.

---

## 🏗️ System Architecture

```
                                  [ REMOTE / CAMPUS USERS ]
                                  (Admins, Developers, Faculty)
                                              │
                                              ▼ (TLS 1.3 + MFA)
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
      │ • Subnet Isolation Controls   │ (AES-256-GCM) │ • Calico East-West Policies   │
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

## 🛡️ 7 Core Zero Trust Principles Implemented

| Principle | Description | Platform Implementation |
| :--- | :--- | :--- |
| **1. Never Trust, Always Verify** | No device or user has default trust, inside or outside perimeter. | JWT RS256 token verification + MFA challenges on all endpoints. |
| **2. Least-Privilege Access** | Users receive only minimum permissions required for their specific job. | 6-tier RBAC matrix restricting Faculty from DB admin and Devs from firewall rules. |
| **3. Explicit Authorization** | All traffic dropped unless matching an active permit rule. | Priority firewall rule engine with implicit Zero-Trust default-deny boundary. |
| **4. Network Microsegmentation** | Subnets partitioned to minimize adversary blast radius. | Private DC subnets (`10.10.0.0/16`) and Cloud VPCs (`10.20.0.0/16`) with strict ACLs. |
| **5. Assume Breach Mentality** | Infrastructure assumes perimeter compromise and focuses on containment. | Red-Team Attack Simulator + 1-click workload isolation in SOC Incident Center. |
| **6. Continuous Telemetry** | Cross-premise telemetry collected and analyzed in real-time. | MongoDB SIEM audit trail and live packet throughput visualizers. |
| **7. Hybrid Trunk Encryption** | All cross-premise communication is hardware-encrypted. | IPsec VPN + Direct Connect running AES-256-GCM and 802.1AE MACsec. |

---

## ⚔️ 6 Red-Team Attack Scenarios & Containment

1. **Compromised Application A (CVE-2026-RCE):** Initial perimeter compromise of Academic Portal. Adversary attempts lateral reconnaissance to App B; Policy #130 blocks lateral pivot.
2. **Lateral Movement to Database Core:** Attacker on App A attempts SSH (Port 22) administrative pivot into Core DB; Policy #135 permits SQL (5432) but strictly DENIES administrative SSH.
3. **Cross-VPC Hopping Probe:** Compromised VPC 3 Analytics node attempts unpeered traversal into VPC 1 Production Web; Cloud Security Group #150 drops packet.
4. **Direct Cloud-to-DC Database Attack:** Adversary bypasses API proxy attempting direct ingress into internal database; Policy #140 terminates connection.
5. **IAM RBAC Privilege Escalation:** Faculty account attempts invoking administrative policy modification endpoint; Spring Security RBAC intercepts with HTTP 403 Forbidden.
6. **Suspicious C2 Data Exfiltration:** Compromised container attempts exfiltrating credentials to external botnet IP; Egress Policy #170 drops socket.

---

## 💻 Tech Stack

- **Backend:** Java 21, Spring Boot 3.3.3, Spring Security 6, Spring Data MongoDB, JJWT 0.12.6, Maven
- **Database:** MongoDB 8.2 (Stateful policy storage, user directory, SIEM security events, incident tickets)
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Testing:** JUnit 5, Mockito, Spring Boot Test, Maven Surefire

---

## 🚀 Quick Start Guide (Local Setup)

### Prerequisites
- **Java 21 (JDK)**
- **Maven 3.9+**
- **Node.js 18+ / npm 10+**
- **MongoDB Server** (Running locally on `mongodb://localhost:27017`)

### 1. Start MongoDB
Ensure MongoDB is running locally:
```bash
# Windows
mongod.exe --dbpath C:\Users\hp\Desktop\Cisco-vip\data\db --port 27017
```

### 2. Start the Spring Boot Backend
```bash
cd backend
mvn clean spring-boot:run
```
*The backend starts at `http://localhost:8080` and automatically seeds initial demo data (users, policies, segments, workloads).*

### 3. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
*The frontend dashboard opens at `http://localhost:5173`.*

---

## 👥 Demo User Credentials

| Username | Password | Role | Permissions |
| :--- | :--- | :--- | :--- |
| `secadmin` | `Admin@123` | `SECURITY_ADMIN` | Full System & Policy Admin, Containment, Simulations |
| `netadmin` | `Admin@123` | `NETWORK_ADMIN` | Stateful Firewall Policy Engine, Subnet Management |
| `cloudadmin` | `Admin@123` | `CLOUD_ADMIN` | Cloud Security Groups, VPC Topology |
| `developer` | `Dev@123` | `DEVELOPER` | Microservice Deployment, Namespace Inspection |
| `faculty` | `Faculty@123` | `FACULTY` | Teaching Portal, Academic Records (No DB/Admin access) |
| `auditor` | `Audit@123` | `AUDITOR` | Read-Only SIEM Telemetry & Audit Logs |

---

## 📋 Reviewer Demonstration Workflow (13 Steps)

1. Open `http://localhost:5173` and click **"Launch 13-Step Guided Demo"**.
2. **Step 1:** Review SOC Overview and baseline posture score (95/100).
3. **Step 2:** Explore the **Interactive Hybrid Architecture Graph**.
4. **Step 3:** Examine the **IAM RBAC Matrix** and toggle MFA.
5. **Step 4:** Inspect **Network Microsegmentation** (DC Subnets vs Cloud VPCs).
6. **Step 5:** Inspect the **Stateful Security Policy Engine** and test packet evaluation.
7. **Step 6–8:** Select Application A, compromise it, and launch **Lateral Movement Attack**.
8. **Step 9–10:** Observe the **Attack Path Trace** and verify **Policy #130 BLOCKED** verdict.
9. **Step 11:** Inspect the generated **SOC Incident Ticket** with packet forensics.
10. **Step 12:** Click **"Quarantine & Contain"** to isolate the workload.
11. **Step 13:** Verify the **Final Posture Score** and incident containment status.

---

## 📄 License & Attribution

Developed for the **Cisco AICTE Virtual Internship Program 2026** by **KHUMAN DHAKAD** (Lakshmi Narain College of Technology, Bhopal). All rights reserved.
