# REST API Reference Documentation

All protected endpoints require HTTP header: `Authorization: Bearer <JWT_TOKEN>`.

---

## 1. Authentication & Users
- `POST /api/auth/login`: Authenticate and receive JWT token.
- `GET /api/auth/me`: Get current authenticated user profile.
- `GET /api/users`: List all enterprise users (Admin/Auditor).
- `POST /api/users`: Provision a new user account.
- `PUT /api/users/{id}/mfa`: Toggle Multi-Factor Authentication status.
- `PUT /api/users/{id}/role`: Update user RBAC role assignment.

---

## 2. Dashboard & Posture
- `GET /api/dashboard/stats`: Retrieve summary counts for workloads, active policies, blocked traffic, and posture score.
- `GET /api/security-posture`: Get detailed 0–100 security score, category breakdowns, positive drivers, and risk factors.

---

## 3. Stateful Policy Engine
- `GET /api/policies`: List all stateful firewall and security group rules.
- `POST /api/policies`: Create a new security policy.
- `DELETE /api/policies/{id}`: Delete a security policy rule.
- `POST /api/policies/evaluate`: Live packet evaluation endpoint testing traffic against priority rule chain.

---

## 4. Segments & Workloads
- `GET /api/segments`: List all network subnets and VPCs.
- `PUT /api/segments/{id}/isolation`: Toggle emergency subnet isolation mode.
- `GET /api/workloads`: List all protected workloads and containers.
- `PUT /api/workloads/{id}/compromise`: Toggle workload compromise state.
- `PUT /api/workloads/{id}/quarantine`: Toggle workload automated sandbox quarantine.

---

## 5. Attack Simulation & Incidents
- `POST /api/attacks/simulate`: Execute one of the 6 red-team attack scenarios against the policy engine.
- `GET /api/attacks/history`: List historical attack simulation traces.
- `GET /api/incidents`: List all SOC incident tickets.
- `PUT /api/incidents/{id}`: Update incident status (`INVESTIGATING`, `CONTAINED`, `RESOLVED`) and trigger quarantine.

---

## 6. SIEM Telemetry & Hybrid Link
- `GET /api/monitoring/events`: Fetch filtered real-time security telemetry events.
- `GET /api/hybrid-link`: Fetch hybrid Direct Connect and IPsec trunk state.
- `PUT /api/hybrid-link/degrade`: Toggle simulated link degradation.
