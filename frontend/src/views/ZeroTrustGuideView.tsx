import React from 'react';
import { useApp } from '../context/AppContext';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { 
  Lock, 
  ShieldCheck, 
  Key, 
  Grid, 
  Activity, 
  Flame, 
  Server, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const ZeroTrustGuideView: React.FC = () => {
  const { setActiveView } = useApp();

  const principles = [
    {
      title: '1. Never Trust, Always Verify',
      desc: 'No entity—whether inside the campus perimeter or in the public cloud—is inherently trusted. Every connection requires continuous cryptographic identity verification and contextual posture evaluation.',
      implementation: 'JWT RS256 token verification, mandatory MFA challenges, and strict CORS/TLS 1.3 encryption.',
      targetView: 'iam',
      targetLabel: 'View IAM & MFA Matrix',
      icon: Key
    },
    {
      title: '2. Enforce Least-Privilege Access',
      desc: 'Users and service workloads receive only the absolute minimum permissions necessary to complete their specific function, stopping privilege escalation in its tracks.',
      implementation: '6-tier RBAC matrix restricting Faculty to teaching portals and preventing Developers from mutating firewall rules.',
      targetView: 'iam',
      targetLabel: 'View RBAC Permissions',
      icon: ShieldCheck
    },
    {
      title: '3. Explicit Authorization (Stateful Policy Engine)',
      desc: 'All network traffic is denied by default unless an explicit permit rule exists in the active security policy base matching source, destination, protocol, and port.',
      implementation: 'Priority-based Next-Gen Firewall rule engine with implicit default-deny boundary.',
      targetView: 'policies',
      targetLabel: 'Inspect Security Policy Rules',
      icon: Lock
    },
    {
      title: '4. Network Microsegmentation & Blast Radius Minimization',
      desc: 'Dividing the network into small isolated zones prevents compromised workloads from executing lateral pivots into adjacent high-value subnets.',
      implementation: 'Private DC subnets (10.10.0.0/16) and Cloud VPCs (10.20.0.0/16) separated with strict ACL boundaries.',
      targetView: 'segmentation',
      targetLabel: 'Inspect Subnets & CIDRs',
      icon: Grid
    },
    {
      title: '5. Assume Breach Mentality',
      desc: 'Design the infrastructure assuming adversaries will eventually compromise a peripheral application, focusing defense on immediate containment and quarantine.',
      implementation: 'Red-Team Attack Simulator and 1-click workload isolation in the SOC Incident Response Center.',
      targetView: 'attack-simulator',
      targetLabel: 'Test Attack Containment',
      icon: Flame
    },
    {
      title: '6. Continuous SIEM Telemetry & Threat Monitoring',
      desc: 'Continuous real-time telemetry collection and anomaly detection across cross-premise hybrid connections.',
      implementation: 'MongoDB audit trail and live packet throughput visualizers streaming security events.',
      targetView: 'monitoring',
      targetLabel: 'View SIEM Telemetry',
      icon: Activity
    },
    {
      title: '7. Cryptographic Hybrid Trunk Encryption',
      desc: 'All cross-datacenter traffic spanning the public cloud and private infrastructure is hardware-encrypted.',
      implementation: 'Redundant Direct Connect and IPsec tunnel running AES-256-GCM and 802.1AE MACsec.',
      targetView: 'hybrid-link',
      targetLabel: 'View Hybrid Encryption',
      icon: Server
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-sky-400" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-100 tracking-tight">
              Zero Trust Architecture & Cisco Security Framework
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Grounded in NIST SP 800-207 and Cisco Zero Trust Reference Architecture
          </p>
        </div>
      </div>

      {/* 7 Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {principles.map((p, idx) => {
          const Icon = p.icon;
          return (
            <CyberCard
              key={idx}
              title={p.title}
              headerIcon={<Icon className="w-4 h-4 text-cyan-400" />}
              action={
                <button
                  onClick={() => setActiveView(p.targetView as any)}
                  className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  {p.targetLabel} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              }
            >
              <div className="space-y-2.5 text-xs font-mono">
                <p className="text-slate-300 leading-relaxed font-sans">{p.desc}</p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold block mb-1">PLATFORM IMPLEMENTATION:</span>
                  <p className="text-cyan-300 text-[11px]">{p.implementation}</p>
                </div>
              </div>
            </CyberCard>
          );
        })}
      </div>
    </div>
  );
};
