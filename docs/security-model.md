# Security Model & Policy Engine Specification

## 1. Identity & Access Management (IAM) Model

The platform enforces Role-Based Access Control (RBAC) via Spring Security 6 and stateless JSON Web Tokens (JWT).

### 1.1 Enterprise Roles & Privileges

```
[ SECURITY_ADMIN ]  ──► Full Super-Admin, Policy Engine, Containment, Red-Team Attack Sim
[ NETWORK_ADMIN ]   ──► Stateful Firewall Policies, Subnet Isolation, Direct Connect Gateway
[ CLOUD_ADMIN ]     ──► Cloud Security Groups, VPC Peering, Kubernetes CNI Policies
[ DEVELOPER ]       ──► Microservice Inspection, Read App Telemetry
[ FACULTY ]         ──► Academic Teaching Portal, Student Grading (Strictly NO DB Admin)
[ AUDITOR ]         ──► Immutable SIEM Audit Trail, Posture Verification
```

### 1.2 JWT Authentication Flow
1. Client submits credentials to `POST /api/auth/login`.
2. Backend authenticates against BCrypt password hash and verifies MFA status.
3. Cryptographically signed JWT (HMAC-SHA512) is issued containing `username`, `role`, `mfaEnabled`, and expiration claims.
4. Subsequent requests pass `Authorization: Bearer <token>`, validated by `JwtAuthenticationFilter`.

---

## 2. Stateful Policy Evaluation Engine

The `PolicyEngineService` evaluates packet requests dynamically using a priority-ordered rule chain:
1. **Rule Sorting:** Active policies are sorted by `priority` ascending (`1` to `1000`).
2. **Endpoint Pattern Matching:**
   - Evaluates CIDR subnet matches (e.g. `10.10.10.0/24`).
   - Evaluates workload code tags (e.g. `WORKLOAD:APP_A`).
   - Evaluates user role tags (e.g. `ROLE:FACULTY`).
   - Evaluates wildcard addresses (`0.0.0.0/0`, `ANY`).
3. **Protocol & Port Matching:** Checks protocol (`TCP`, `UDP`, `ICMP`, `ANY`) and destination port (`443`, `8080`, `5432`, `22`, `ANY`).
4. **Action Determination:** The first matching rule dictates the verdict (`ALLOW` or `DENY`).
5. **Implicit Zero-Trust Default Deny:** If no explicit rule matches, traffic is dropped by the default implicit deny boundary.

---

## 3. Mathematical Security Posture Calculation

The overall Security Posture Score ($S \in [0, 100]$) is computed continuously:

$$S = \sum_{k} w_k \cdot C_k - P_{\text{incidents}} - P_{\text{compromises}} - P_{\text{link}}$$

Where:
- $C_k$ are category scores (IAM/MFA, Microsegmentation, Firewall Health, Workload Hygiene, Hybrid Integrity).
- $P_{\text{incidents}}$: -10 points per unresolved critical incident, -5 points per high incident.
- $P_{\text{compromises}}$: -15 points per unisolated compromised workload.
- $P_{\text{link}}$: -20 points if the hybrid encryption trunk is degraded.
