import {
  AuthResponse,
  DashboardStats,
  Incident,
  NetworkSegment,
  SecurityEvent,
  SecurityPolicy,
  SecurityPosture,
  User,
  Workload,
  AttackExecutionResult,
  HybridLinkState,
  PolicyEvaluationRecord
} from '../types';

const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('cisco_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function request<T>(url: string, options?: RequestInit, timeoutMs = 12000): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      signal: options?.signal || controller.signal,
      headers: {
        ...getHeaders(),
        ...options?.headers
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errJson = await response.json();
        if (errJson.message) errorMsg = errJson.message;
      } catch {}
      throw new Error(errorMsg);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${timeoutMs / 1000}s`);
    }
    throw error;
  }
}

export const api = {
  // Auth & RBAC
  login: (username: string, password: string): Promise<AuthResponse> =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),

  demoSwitch: (username: string): Promise<AuthResponse> =>
    request<AuthResponse>(`/auth/demo-switch/${username}`, {
      method: 'POST'
    }),

  getCurrentUser: (): Promise<User> => request<User>('/auth/me'),

  // Dashboard
  getDashboardStats: (): Promise<DashboardStats> => request<DashboardStats>('/dashboard/stats'),

  // Users & IAM
  getUsers: (): Promise<User[]> => request<User[]>('/users'),
  toggleMfa: (id: string, mfaEnabled: boolean): Promise<User> =>
    request<User>(`/users/${id}/mfa`, {
      method: 'PATCH',
      body: JSON.stringify({ mfaEnabled })
    }),
  updateRole: (id: string, role: string): Promise<User> =>
    request<User>(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    }),

  // Policies
  getPolicies: (): Promise<SecurityPolicy[]> => request<SecurityPolicy[]>('/policies'),
  createPolicy: (policy: Partial<SecurityPolicy>): Promise<SecurityPolicy> =>
    request<SecurityPolicy>('/policies', {
      method: 'POST',
      body: JSON.stringify(policy)
    }),
  updatePolicy: (id: string, policy: Partial<SecurityPolicy>): Promise<SecurityPolicy> =>
    request<SecurityPolicy>(`/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(policy)
    }),
  deletePolicy: (id: string): Promise<void> =>
    request<void>(`/policies/${id}`, {
      method: 'DELETE'
    }),
  evaluateTraffic: (params: {
    source: string;
    destination: string;
    protocol: string;
    port: string;
    role?: string;
  }): Promise<{
    verdict: string;
    allowed: boolean;
    matchedPolicyId: string;
    matchedPolicyName: string;
    matchedRuleSummary: string;
    reason: string;
    evaluationChain: PolicyEvaluationRecord[];
  }> =>
    request('/policies/evaluate', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // Segments
  getSegments: (): Promise<NetworkSegment[]> => request<NetworkSegment[]>('/segments'),
  toggleSegmentIsolation: (id: string, isolationMode: boolean): Promise<NetworkSegment> =>
    request<NetworkSegment>(`/segments/${id}/isolation`, {
      method: 'PATCH',
      body: JSON.stringify({ isolationMode })
    }),

  // Workloads
  getWorkloads: (): Promise<Workload[]> => request<Workload[]>('/workloads'),
  toggleWorkloadCompromise: (id: string, compromised: boolean): Promise<Workload> =>
    request<Workload>(`/workloads/${id}/compromise`, {
      method: 'PATCH',
      body: JSON.stringify({ compromised })
    }),
  toggleWorkloadQuarantine: (id: string, quarantined: boolean): Promise<Workload> =>
    request<Workload>(`/workloads/${id}/quarantine`, {
      method: 'PATCH',
      body: JSON.stringify({ quarantined })
    }),

  // Attacks
  simulateAttack: (params: {
    scenarioType: string;
    sourceWorkloadCode?: string;
    targetWorkloadCode?: string;
  }): Promise<AttackExecutionResult> =>
    request<AttackExecutionResult>('/attacks/simulate', {
      method: 'POST',
      body: JSON.stringify(params)
    }),
  getAttackHistory: (): Promise<any[]> => request<any[]>('/attacks/history'),

  // Incidents
  getIncidents: (): Promise<Incident[]> => request<Incident[]>('/incidents'),
  getIncidentById: (id: string): Promise<Incident> => request<Incident>(`/incidents/${id}`),
  updateIncident: (
    id: string,
    params: { status: string; containmentNotes?: string; resolvedBy?: string; quarantineWorkload?: boolean }
  ): Promise<Incident> =>
    request<Incident>(`/incidents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(params)
    }),

  // Monitoring
  getEvents: (severity?: string, eventType?: string): Promise<SecurityEvent[]> => {
    const q = new URLSearchParams();
    if (severity) q.append('severity', severity);
    if (eventType) q.append('eventType', eventType);
    const queryString = q.toString() ? `?${q.toString()}` : '';
    return request<SecurityEvent[]>(`/monitoring/events${queryString}`);
  },

  // Security Posture
  getSecurityPosture: (): Promise<SecurityPosture> => request<SecurityPosture>('/security-posture'),

  // Hybrid Link
  getHybridLink: (): Promise<HybridLinkState> => request<HybridLinkState>('/hybrid-link'),
  toggleHybridLinkDegrade: (degrade: boolean): Promise<HybridLinkState> =>
    request<HybridLinkState>('/hybrid-link/degrade', {
      method: 'POST',
      body: JSON.stringify({ degrade })
    }),

  // Health
  checkHealth: (): Promise<{ status: string; service: string; student: string }> =>
    request('/health')
};
