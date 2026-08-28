# Reviewer Demonstration Script & Walkthrough Guide

### Cisco AICTE Virtual Internship Program 2026
**Presenter:** KHUMAN DHAKAD (LNCT Bhopal)  
**Track:** Cyber Security  
**Project:** Secure Hybrid Data Center Network Security & Attack Containment Platform

---

## 🎯 Demonstration Objective
To prove how Zero-Trust microsegmentation, stateful priority-based firewalls, and automated SOC incident triage prevent breach propagation across hybrid data center and multi-cloud environments.

---

## 🎬 Step-by-Step Presentation Script

### Step 1: Open the SOC Dashboard (`http://localhost:5173`)
- **Action:** Point out the top header showing candidate attribution (**KHUMAN DHAKAD**, **LNCT Bhopal**).
- **Narration:** *"We begin on the Hybrid SOC Overview dashboard. Our real-time security posture score stands at 95/100 (Grade A+), continuously computed from active IAM configurations, network microsegmentation, and zero unresolved incidents."*

### Step 2: Navigate to Hybrid Architecture
- **Action:** Click "Hybrid Architecture" in the sidebar.
- **Narration:** *"Here we see the full end-to-end topology. Remote and campus users connect through our TLS 1.3 IAM Gateway. The on-premise datacenter (10.10.0.0/16) is linked to our AWS Public Cloud (10.20.0.0/16) via an AES-256-GCM encrypted IPsec tunnel and Direct Connect."*

### Step 3: Demonstrate IAM & RBAC Least Privilege
- **Action:** Switch to "IAM & RBAC Matrix".
- **Narration:** *"We enforce strict role separation across 6 personas. For instance, the Faculty role allows access to teaching materials but denies database administration and firewall configuration. We also enforce MFA across all accounts."*

### Step 4: Inspect Stateful Security Policy Engine
- **Action:** Switch to "Security Policy Engine".
- **Narration:** *"Our firewall rules are prioritized. Rule #130 explicitly denies lateral traffic between App A and App B. Rule #140 blocks direct cloud ingress into internal database clusters. Any unlisted traffic falls into the implicit default-deny boundary."*

### Step 5: Execute Red-Team Attack Simulation
- **Action:** Click "Attack Simulator" and launch Scenario 1: **"Compromised Application & Containment"**.
- **Narration:** *"We now simulate an attacker exploiting a remote code execution vulnerability on Application A (10.10.10.15). The attacker attempts to scan the subnet and pivot laterally to Application B. Notice how our live policy engine intercepts the packet and returns a BLOCKED decision via Policy #130."*

### Step 6: Inspect Attack Path & Forensics
- **Action:** Switch to "Attack Path Visualizer" and then "Incident Center".
- **Narration:** *"The firewall automatically generated Critical Incident Ticket #1 with full packet forensics. We can now click 'Quarantine & Contain' to isolate the compromised pod, restoring overall network resilience."*

### Step 7: Verify Posture Recalculation
- **Action:** Switch to "Security Posture (0-100)".
- **Narration:** *"Notice that because the attack was contained and the compromised workload isolated, our security score actively reflects quarantine defense and mitigates active penalties."*
