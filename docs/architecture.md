# Hybrid Data Center Architecture & Network Topology

## 1. Network Topology Overview

The platform simulates a distributed hybrid enterprise network designed according to NIST SP 800-207 and Cisco SAFE Reference Framework.

### 1.1 Private Data Center Domain (`10.10.0.0/16`)
The on-premise infrastructure hosts critical stateful databases and internal services:
- **Management Subnet (`10.10.0.0/24`):** Hosts Enterprise Gateway Firewall, Bastion controllers, and IAM identity services.
- **Application Segment A (`10.10.10.0/24`):** Hosts the Academic Management Portal (`10.10.10.15`) running Spring Boot backend instances.
- **Application Segment B (`10.10.20.0/24`):** Hosts the Automated Grading Engine (`10.10.20.25`).
- **Database Subnet (`10.10.30.0/24`):** Hosts the Core Enterprise Oracle Database (`10.10.30.5`). Direct ingress from unauthorized segments is strictly prohibited.

### 1.2 Public Cloud Domain (`10.20.0.0/16`)
The public cloud infrastructure hosts scalable frontend and microservice workloads:
- **VPC 1: Production Web (`10.20.1.0/24`):** Public-facing reverse proxy and load balancers (`10.20.1.10`).
- **VPC 2: Microservices & K8s Cluster (`10.20.2.0/24`):** Containerized Kubernetes cluster hosting the Payment Microservice (`10.20.2.14`) and Research Engine (`10.20.2.18`). Calico CNI enforces East-West namespace boundaries.
- **VPC 3: Big Data & Analytics (`10.20.3.0/24`):** High-throughput data processing cluster (`10.20.3.40`).

### 1.3 Hybrid Connectivity Trunk
Cross-premise communication is routed over:
- **Primary Link:** AWS Direct Connect 10 Gbps dedicated connection.
- **Backup & Encryption Layer:** Redundant IPsec VPN tunnel utilizing `AES-256-GCM` encryption, `SHA-384` hashing, `IKEv2` key exchange, and `802.1AE MACsec` link-layer protection.

---

## 2. Microsegmentation Matrix

| Source | Destination | Protocol / Port | Policy Action | Enforcing Device |
| :--- | :--- | :--- | :--- | :--- |
| `0.0.0.0/0` (Internet) | `10.20.1.10` (Cloud Web) | TCP 443 | `ALLOW` | Cloud Security Group |
| `10.20.1.10` (Cloud Web) | `10.10.10.15` (App A) | TCP 8080 | `ALLOW` | Hybrid Gateway Firewall |
| `10.10.10.15` (App A) | `10.10.20.25` (App B) | ANY | `DENY` | DC Internal Firewall |
| `10.10.10.15` (App A) | `10.10.30.5` (Core DB) | TCP 5432 / 1521 | `ALLOW` | DC Database Firewall |
| `10.10.10.15` (App A) | `10.10.30.5` (Core DB) | TCP 22 (SSH) | `DENY` | DC Database Firewall |
| `10.20.3.40` (Analytics) | `10.20.1.10` (Prod Web) | ANY | `DENY` | Cloud Security Group |
| `10.20.1.10` (Cloud Web) | `10.10.30.5` (Core DB) | ANY | `DENY` | Hybrid Link Boundary |
| `10.20.2.14` (Payments) | `0.0.0.0/0` (C2 Egress) | ANY | `DENY` | Cloud Egress NAT Gateway |
