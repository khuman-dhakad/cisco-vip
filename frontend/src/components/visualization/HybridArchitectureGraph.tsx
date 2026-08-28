import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NodeDetailModal } from './NodeDetailModal';
import { 
  Users, 
  KeyRound, 
  ShieldCheck, 
  Server, 
  Database, 
  Cloud, 
  Lock, 
  Network, 
  Layers, 
  AlertTriangle, 
  Flame, 
  Sparkles,
  Info,
  Radio,
  Cpu
} from 'lucide-react';

export const HybridArchitectureGraph: React.FC = () => {
  const { workloads, segments, hybridLink, selectedNode, setSelectedNode } = useApp();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PRIVATE_DC' | 'PUBLIC_CLOUD'>('ALL');

  const appAWorkload = workloads.find(w => w.code === 'APP_A');
  const appBWorkload = workloads.find(w => w.code === 'APP_B');
  const dbWorkload = workloads.find(w => w.code === 'DB_CORE');

  const handleNodeClick = (nodeData: any) => {
    setSelectedNode(nodeData);
  };

  return (
    <div className="space-y-4">
      {/* Visualizer Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>INTERACTIVE TOPOLOGY MAP (Click any node to inspect security controls)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              activeFilter === 'ALL'
                ? 'bg-cyan-600 text-white font-semibold shadow-sm shadow-cyan-950'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Hybrid
          </button>
          <button
            onClick={() => setActiveFilter('PRIVATE_DC')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              activeFilter === 'PRIVATE_DC'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Private DC
          </button>
          <button
            onClick={() => setActiveFilter('PUBLIC_CLOUD')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              activeFilter === 'PUBLIC_CLOUD'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Public Cloud
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div className="relative rounded-2xl bg-[#070a10] border border-slate-800/90 p-5 md:p-8 overflow-hidden">
        {/* Background Network Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-5xl mx-auto">
          
          {/* LEVEL 1: REMOTE & CAMPUS USERS */}
          <div 
            onClick={() => handleNodeClick({
              name: 'Remote / Campus Users & Faculty',
              type: 'IDENTITY_CONSUMER',
              cidr: '192.168.1.0/24 & Remote VPN',
              environment: 'CAMPUS_ENTERPRISE',
              status: 'SECURE',
              riskLevel: 'LOW',
              description: 'Campus faculty, researchers, students, and remote administrators connecting via TLS 1.3 with mandatory MFA and role-based policies.',
              controls: ['MFA Verification', 'Device Posture Check', 'Conditional Access', 'SSO via SAML/OIDC'],
              allowedConnections: ['Faculty -> Academic Portal (HTTPS 443)', 'Admin -> Bastion VPN (mTLS)'],
              blockedConnections: ['Direct access to Database Segment', 'Direct access to Kubernetes Core']
            })}
            className="w-full max-w-md p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 shadow-cyber-cyan cursor-pointer transition-all hover:scale-[1.01] group text-center"
          >
            <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
              <Users className="w-5 h-5" />
              <span className="font-mono text-xs uppercase tracking-wider font-bold">REMOTE / CAMPUS USERS</span>
            </div>
            <p className="text-xs text-slate-300">LNCT Bhopal Campus Faculty • Remote Students • Developers</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                192.168.0.0/16
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                MFA ENFORCED
              </span>
            </div>
          </div>

          {/* CONNECTOR 1 */}
          <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-500 to-sky-500 relative">
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
          </div>

          {/* LEVEL 2: IAM + MFA + RBAC GATEWAY */}
          <div 
            onClick={() => handleNodeClick({
              name: 'IAM & Dynamic RBAC Security Gate',
              type: 'IDENTITY_ACCESS_MANAGEMENT',
              cidr: '10.10.0.5 (Internal IAM Authority)',
              environment: 'CENTRAL_GOVERNANCE',
              status: 'SECURE',
              riskLevel: 'LOW',
              description: 'Centralized Identity Provider and JWT Token Authority enforcing Least Privilege, RBAC claims, and session validation.',
              controls: ['JSON Web Token (JWT) RS256', 'Granular Least-Privilege Roles', 'MFA Challenge Engine', 'Session Audit Trail'],
              allowedConnections: ['Approved JWT tokens with matching permissions'],
              blockedConnections: ['Tampered JWT payloads', 'Unauthenticated API requests', 'Privilege Escalation bypasses']
            })}
            className="w-full max-w-lg p-4 rounded-xl bg-slate-900/90 border border-sky-500/30 hover:border-sky-400 shadow-sm cursor-pointer transition-all hover:scale-[1.01] group text-center"
          >
            <div className="flex items-center justify-center gap-2 text-sky-400 mb-1">
              <KeyRound className="w-5 h-5" />
              <span className="font-mono text-xs uppercase tracking-wider font-bold">IAM + MFA + RBAC ENGINE</span>
            </div>
            <p className="text-xs text-slate-300">Identity-Aware Gateway • Role Permissions Matrix • Least Privilege</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                JWT Auth Provider
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                6 RBAC Roles Active
              </span>
            </div>
          </div>

          {/* CONNECTOR 2 */}
          <div className="w-0.5 h-6 bg-gradient-to-b from-sky-500 to-indigo-500 relative">
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping opacity-75" />
          </div>

          {/* LEVEL 3: ENTERPRISE SECURITY GATEWAY */}
          <div 
            onClick={() => handleNodeClick({
              name: 'Enterprise Security Gateway (NGFW)',
              type: 'NEXT_GEN_FIREWALL',
              cidr: '10.10.0.1 (Gateway Cluster VIP)',
              environment: 'SECURITY_PERIMETER',
              status: 'SECURE',
              riskLevel: 'LOW',
              description: 'Next-Generation Stateful Firewall and Intrusion Prevention System inspecting Layer 3 to Layer 7 traffic.',
              controls: ['Deep Packet Inspection (DPI)', 'Priority Stateful Rule Engine', 'Egress Data Loss Prevention', 'C2 Domain Sinkholing'],
              allowedConnections: ['Explicitly whitelisted Source-Destination tuples'],
              blockedConnections: ['All implicit unlisted traffic (Zero-Trust Default Deny)']
            })}
            className="w-full max-w-xl p-4 rounded-xl bg-slate-900/95 border border-indigo-500/40 hover:border-indigo-400 shadow-cyber-cyan cursor-pointer transition-all hover:scale-[1.01] group text-center"
          >
            <div className="flex items-center justify-center gap-2 text-indigo-400 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-mono text-xs uppercase tracking-wider font-bold">ENTERPRISE SECURITY GATEWAY & FIREWALL</span>
            </div>
            <p className="text-xs text-slate-300">Stateful Rule Engine • Layer 7 Deep Packet Inspection • Threat Containment</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                11 Active Security Policies
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Default-Deny Active
              </span>
            </div>
          </div>

          {/* SPLIT CONNECTIONS INTO PRIVATE DC & PUBLIC CLOUD */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            
            {/* COLUMN 1: PRIVATE DATA CENTER */}
            {(activeFilter === 'ALL' || activeFilter === 'PRIVATE_DC') && (
              <div className="rounded-2xl p-5 bg-slate-950/90 border border-slate-800 relative flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-xs font-bold uppercase text-slate-100 tracking-wider">
                      PRIVATE DATA CENTER
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                    10.10.0.0/16
                  </span>
                </div>

                {/* Subnet A: App Segment A */}
                <div 
                  onClick={() => handleNodeClick({
                    name: 'Private DC - App Segment A (Academic)',
                    type: 'APPLICATION_SEGMENT',
                    cidr: '10.10.10.0/24',
                    environment: 'PRIVATE_DATACENTER',
                    status: appAWorkload?.isCompromised ? 'COMPROMISED' : 'HEALTHY',
                    riskLevel: appAWorkload?.isCompromised ? 'CRITICAL' : 'LOW',
                    description: 'Houses Academic Portal (Workload-App-A) and student registration services.',
                    controls: ['Microsegmentation ACLs', 'Ingress Filtering', 'Automated Quarantine Sandbox'],
                    allowedConnections: ['Campus Users -> Academic Portal (443)', 'App A -> Database Core (SQL 5432)'],
                    blockedConnections: ['App A -> App B (Lateral Movement)', 'App A -> Database SSH (22)']
                  })}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    appAWorkload?.isCompromised
                      ? 'bg-rose-950/40 border-rose-500 shadow-cyber-rose'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${appAWorkload?.isCompromised ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                      <span className="text-xs font-bold text-slate-100 font-mono">App Segment A (Academic)</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">10.10.10.0/24</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Workload-App-A (Academic Portal - 10.10.10.15)</p>
                  {appAWorkload?.isCompromised && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-400 font-mono font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      COMPROMISED - ISOLATION CONTAINMENT ACTIVE
                    </div>
                  )}
                </div>

                {/* Subnet B: App Segment B */}
                <div 
                  onClick={() => handleNodeClick({
                    name: 'Private DC - App Segment B (Grading Engine)',
                    type: 'APPLICATION_SEGMENT',
                    cidr: '10.10.20.0/24',
                    environment: 'PRIVATE_DATACENTER',
                    status: 'HEALTHY',
                    riskLevel: 'LOW',
                    description: 'Houses Student Grading and Examination processing engine.',
                    controls: ['Microsegmentation ACLs', 'East-West Traffic Inspection'],
                    allowedConnections: ['App B -> Core Database (SQL 5432)'],
                    blockedConnections: ['App A -> App B (Denied by Policy #102)']
                  })}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-slate-100 font-mono">App Segment B (Grading)</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">10.10.20.0/24</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Workload-App-B (Grading Engine - 10.10.20.25)</p>
                </div>

                {/* Subnet C: Database Segment */}
                <div 
                  onClick={() => handleNodeClick({
                    name: 'Private DC - Database Core Segment',
                    type: 'DATABASE_SEGMENT',
                    cidr: '10.10.30.0/24',
                    environment: 'PRIVATE_DATACENTER',
                    status: 'HEALTHY',
                    riskLevel: 'LOW',
                    description: 'High-security Oracle Database cluster storing student records and institutional credentials.',
                    controls: ['Air-Gapped Subnet Boundary', 'Stateful SQL Port Inspection (5432/1521)', 'Zero Public Egress'],
                    allowedConnections: ['App A & App B SQL Queries (5432)'],
                    blockedConnections: ['Direct Public Cloud Ingress', 'SSH Admin Port 22 from Apps']
                  })}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-100 font-mono">Database Segment (SIS Core)</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">10.10.30.0/24</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Database-Core-Oracle (10.10.30.5)</p>
                </div>
              </div>
            )}

            {/* COLUMN 2: PUBLIC CLOUD */}
            {(activeFilter === 'ALL' || activeFilter === 'PUBLIC_CLOUD') && (
              <div className="rounded-2xl p-5 bg-slate-950/90 border border-slate-800 relative flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    <span className="font-mono text-xs font-bold uppercase text-slate-100 tracking-wider">
                      PUBLIC CLOUD (AWS/VPC)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-sky-300 border border-slate-700">
                    10.20.0.0/16
                  </span>
                </div>

                {/* VPC 1: Prod Web */}
                <div 
                  onClick={() => handleNodeClick({
                    name: 'Public Cloud - VPC 1 (Prod Web & APIs)',
                    type: 'CLOUD_VPC',
                    cidr: '10.20.1.0/24',
                    environment: 'PUBLIC_CLOUD',
                    status: 'HEALTHY',
                    riskLevel: 'LOW',
                    description: 'Scalable cloud public ingress portal, edge load balancers, and external API gateways.',
                    controls: ['Cloud Security Groups', 'WAF Protection', 'NACL Perimeter'],
                    allowedConnections: ['Public Ingress 443', 'Hybrid API Sync to App Segment A'],
                    blockedConnections: ['Direct Access to DC Database Segment', 'Uninspected Inter-VPC Traversal']
                  })}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-slate-100 font-mono">VPC 1: Production Web</span>
                    </div>
                    <span className="text-[10px] font-mono text-sky-400">10.20.1.0/24</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Cloud-Web-Frontend (10.20.1.10)</p>
                </div>

                {/* VPC 2: Microservices / Kubernetes */}
                <div 
                  onClick={() => handleNodeClick({
                    name: 'Public Cloud - VPC 2 (Kubernetes Clusters)',
                    type: 'KUBERNETES_CLUSTER',
                    cidr: '10.20.2.0/24',
                    environment: 'PUBLIC_CLOUD',
                    status: 'HEALTHY',
                    riskLevel: 'LOW',
                    description: 'Kubernetes container platform running Payment Service and AI Research compute nodes.',
                    controls: ['Calico CNI NetworkPolicies', 'Pod Security Standards', 'Namespace Isolation'],
                    allowedConnections: ['Frontend -> Backend APIs'],
                    blockedConnections: ['Payments Pod -> Research Pod (Namespace Isolation)', 'Outbound C2 Egress']
                  })}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-slate-100 font-mono">VPC 2: K8s Microservices</span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-400">10.20.2.0/24</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">K8s Payments (10.20.2.14) • K8s Research (10.20.2.22)</p>
                </div>

                {/* VPC 3: Analytics & BigData */}
                <div 
                  onClick={() => handleNodeClick({
                    name: 'Public Cloud - VPC 3 (Analytics & AI Lake)',
                    type: 'CLOUD_VPC',
                    cidr: '10.20.3.0/24',
                    environment: 'PUBLIC_CLOUD',
                    status: 'HEALTHY',
                    riskLevel: 'LOW',
                    description: 'BigData analytics lake and machine learning model training clusters.',
                    controls: ['Security Group No-Peering Rule', 'Isolated VPC Boundary'],
                    allowedConnections: ['Cloud Object Storage Relay'],
                    blockedConnections: ['Cross-VPC Hop to VPC 1 Prod Web']
                  })}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-slate-100 font-mono">VPC 3: Analytics & Data Lake</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400">10.20.3.0/24</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">VPC-Analytics-Node (10.20.3.40)</p>
                </div>
              </div>
            )}
          </div>

          {/* HYBRID LINK TRUNK CONNECTOR */}
          {activeFilter === 'ALL' && (
            <div 
              onClick={() => handleNodeClick({
                name: 'Encrypted Hybrid Connection (IPsec + Direct Connect)',
                type: 'HYBRID_TUNNEL',
                cidr: '10.10.0.0/16 <---> 10.20.0.0/16',
                environment: 'CROSS_PREMISE_LINK',
                status: hybridLink?.status || 'SECURE',
                riskLevel: hybridLink?.status === 'DEGRADED' ? 'HIGH' : 'LOW',
                description: 'High-speed dedicated link connecting Private DC with AWS Public Cloud VPCs via AES-256-GCM encrypted IPsec with BGP route filtering.',
                controls: ['IPSec IKEv2 Encryption', '802.1AE MACsec', 'BGP Route Filtering', 'Bidirectional Flow Inspection'],
                allowedConnections: ['Approved Hybrid API Sync (10.20.1.0/24 -> 10.10.10.0/24)'],
                blockedConnections: ['Direct Public Cloud to DC Database Ingress', 'Unapproved Route Advertisement']
              })}
              className="w-full p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 shadow-cyber-cyan cursor-pointer transition-all hover:scale-[1.01] text-center"
            >
              <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
                <Lock className="w-4 h-4" />
                <span className="font-mono text-xs uppercase tracking-wider font-bold">
                  ENCRYPTED HYBRID CONNECTION (IPSec + Direct Connect Redundant Backbone)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                AES-256-GCM Encryption • 10 Gbps Bandwidth • {hybridLink?.latencyMs || 4}ms Latency • BGP Route Filtered
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Node Detail Inspector Modal */}
      <NodeDetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
};
