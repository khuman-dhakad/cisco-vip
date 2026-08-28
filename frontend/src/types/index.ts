export type Role = 
  | 'SECURITY_ADMIN'
  | 'NETWORK_ADMIN'
  | 'CLOUD_ADMIN'
  | 'DEVELOPER'
  | 'FACULTY'
  | 'AUDITOR';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  department: string;
  mfaEnabled: boolean;
  active: boolean;
  lastLogin?: string;
  createdAt?: string;
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  department: string;
  mfaEnabled: boolean;
  permissions: string[];
}

export interface SecurityPolicy {
  id: string;
  name: string;
  source: string;
  destination: string;
  protocol: string;
  port: string;
  action: 'ALLOW' | 'DENY';
  priority: number;
  description: string;
  enabled: boolean;
  scope: 'ENTERPRISE_GATEWAY' | 'HYBRID_LINK' | 'PRIVATE_DC' | 'PUBLIC_CLOUD_SG' | 'K8S_NETWORK_POLICY';
  ruleCategory: 'ZERO_TRUST' | 'MICROSEGMENTATION' | 'IAM_EGRESS' | 'LATERAL_CONTAINMENT';
  createdAt?: string;
  updatedAt?: string;
}

export interface NetworkSegment {
  id: string;
  name: string;
  environment: 'PRIVATE_DATACENTER' | 'PUBLIC_CLOUD';
  cidr: string;
  vpcId: string;
  subnetType: 'MANAGEMENT' | 'APPLICATION' | 'DATABASE' | 'PUBLIC_WEB' | 'MICROSERVICES' | 'ANALYTICS';
  isolationMode: boolean;
  workloadCount: number;
  description: string;
  allowedInbound: string[];
  allowedOutbound: string[];
  status: 'HEALTHY' | 'WARNING' | 'ISOLATED' | 'ATTACK_TARGET';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Workload {
  id: string;
  name: string;
  code: string;
  segmentId: string;
  segmentName: string;
  ipAddress: string;
  namespace: string;
  type: 'VM' | 'KUBERNETES_POD' | 'DATABASE_INSTANCE' | 'MICROSERVICE' | 'API_GATEWAY';
  status: 'HEALTHY' | 'WARNING' | 'COMPROMISED' | 'QUARANTINED';
  isCompromised: boolean;
  isQuarantined: boolean;
  riskScore: number;
  vulnerabilities: string[];
  activePoliciesCount: number;
  portServices: string[];
  environment: 'PRIVATE_DATACENTER' | 'PUBLIC_CLOUD';
}

export interface AttackStep {
  stepNumber: number;
  stageName: string;
  sourceNode: string;
  destinationNode: string;
  attemptedAction: string;
  status: 'SUCCESS' | 'BLOCKED' | 'EVALUATING' | 'QUARANTINED';
  logMessage: string;
  policyIdMatched?: string;
  ruleDetails?: string;
}

export interface PolicyEvaluationRecord {
  policyId: string;
  policyName: string;
  source: string;
  destination: string;
  protocol: string;
  port: string;
  action: string;
  priority: number;
  matched: boolean;
  evaluationReason: string;
}

export interface AttackSimulation {
  id: string;
  scenarioName: string;
  scenarioType: 'COMPROMISED_APP' | 'LATERAL_MOVEMENT' | 'CROSS_VPC_HOPPING' | 'UNAUTHORIZED_DB_ACCESS' | 'PRIVILEGE_ESCALATION' | 'C2_EXFILTRATION';
  attackerSource: string;
  targetWorkload: string;
  timestamp: string;
  steps: AttackStep[];
  policyEvaluations: PolicyEvaluationRecord[];
  finalVerdict: string;
  blocked: boolean;
  incidentId?: string;
  executionTimeMs: number;
  mitigationRecommendation: string;
}

export interface AttackExecutionResult {
  simulation: AttackSimulation;
  generatedIncident: Incident | null;
  updatedSecurityScore: number;
  containmentSummary: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'DETECTED' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';
  sourceIp: string;
  targetIp: string;
  sourceWorkload: string;
  targetWorkload: string;
  attackType: string;
  detectionMechanism: string;
  ruleTriggered: string;
  actionTaken: string;
  forensicPayload: Record<string, any>;
  timestamp: string;
  resolvedAt?: string;
  resolvedBy?: string;
  containmentNotes?: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  actor: string;
  source: string;
  target: string;
  action: string;
  result: string;
  details: string;
  clientIp: string;
}

export interface HybridLinkState {
  id: string;
  status: 'SECURE' | 'DEGRADED' | 'BLOCKED';
  linkType: string;
  encryptionStandard: string;
  primaryBandwidth: string;
  latencyMs: number;
  packetLossPercent: number;
  lastHealthCheck: string;
  simulatedDegraded: boolean;
  allowedRoutes: string[];
  blockedRoutes: string[];
  totalBytesTransferred: number;
  totalInspectedPackets: number;
}

export interface PostureFactor {
  name: string;
  impact: number;
  description: string;
  category: string;
}

export interface SecurityPosture {
  score: number;
  grade: string;
  statusSummary: string;
  categoryScores: Record<string, number>;
  positiveFactors: PostureFactor[];
  negativeFactors: PostureFactor[];
  recommendations: string[];
}

export interface DashboardStats {
  overallSecurityScore: number;
  totalApplications: number;
  protectedApplications: number;
  activeSecurityPolicies: number;
  detectedThreats: number;
  blockedConnections: number;
  activeUsers: number;
  cloudSegments: number;
  privateDcStatus: string;
  publicCloudStatus: string;
  hybridLinkStatus: string;
  recentEvents: SecurityEvent[];
  openIncidents: Incident[];
  trafficStats: {
    allowed: number;
    blocked: number;
    suspicious: number;
  };
  postureFactorBreakdown: Record<string, number>;
}
