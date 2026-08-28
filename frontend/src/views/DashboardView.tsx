import React from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { SecurityEvent } from '../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Server, 
  FileCheck, 
  AlertTriangle, 
  Flame, 
  Activity, 
  Lock, 
  Cloud, 
  Layers, 
  CheckCircle2, 
  XCircle,
  ArrowUpRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { dashboardStats, securityPosture, setActiveView, startGuidedDemo } = useApp();

  const score = dashboardStats?.overallSecurityScore ?? securityPosture?.score ?? 95;
  const grade = securityPosture?.grade ?? 'A+';

  const trafficData = [
    { time: '12:00', allowed: 14200, blocked: 240, suspicious: 45 },
    { time: '13:00', allowed: 18400, blocked: 310, suspicious: 50 },
    { time: '14:00', allowed: 22100, blocked: 450, suspicious: 90 },
    { time: '15:00', allowed: 26800, blocked: 580, suspicious: 120 },
    { time: '16:00', allowed: 31200, blocked: 820, suspicious: 180 },
    { time: '17:00', allowed: 34900, blocked: 940, suspicious: 210 },
  ];

  const categoryBreakdown = [
    { name: 'IAM & MFA', score: securityPosture?.categoryScores?.IAM_MFA ?? 95, color: '#06b6d4' },
    { name: 'Segmentation', score: securityPosture?.categoryScores?.MICROSEGMENTATION ?? 90, color: '#3b82f6' },
    { name: 'Firewall Health', score: securityPosture?.categoryScores?.FIREWALL_HEALTH ?? 92, color: '#10b981' },
    { name: 'Workload Hygiene', score: securityPosture?.categoryScores?.WORKLOAD_HYGIENE ?? 90, color: '#8b5cf6' },
    { name: 'Hybrid Integrity', score: securityPosture?.categoryScores?.HYBRID_LINK_INTEGRITY ?? 95, color: '#0ea5e9' },
  ];

  const threatDistribution = [
    { name: 'Lateral Movement', value: 35, color: '#f43f5e' },
    { name: 'Direct DB Access', value: 25, color: '#f59e0b' },
    { name: 'Cross-VPC Ingress', value: 20, color: '#8b5cf6' },
    { name: 'RBAC Elevation', value: 12, color: '#06b6d4' },
    { name: 'C2 Exfiltration', value: 8, color: '#ec4899' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: SOC Header & Console Overview */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                SECURITY OPERATIONS CENTER
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60">
                ZERO TRUST ENFORCED
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono tracking-tight">
              Hybrid Data Center Network Security & Attack Containment Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Real-time multi-tier workload protection, priority-based policy enforcement, and automated incident triage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startGuidedDemo}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-cyber-cyan flex items-center gap-2"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>Launch 13-Step Guided Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary SOC Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Security Score"
          value={`${score}/100`}
          subtitle={`Grade: ${grade} • Zero-Trust Compliance`}
          icon={ShieldCheck}
          variant={score >= 80 ? 'emerald' : 'rose'}
          trend={score >= 80 ? '+12% vs Unsegmented' : '-18% Active Risk'}
          trendPositive={score >= 80}
        />
        <MetricCard
          title="Protected Workloads"
          value={`${dashboardStats?.protectedApplications ?? 7} / ${dashboardStats?.totalApplications ?? 7}`}
          subtitle="Microsegmented across DC & Cloud"
          icon={Server}
          variant="cyan"
          trend="100% Policy Covered"
        />
        <MetricCard
          title="Active Security Policies"
          value={dashboardStats?.activeSecurityPolicies ?? 11}
          subtitle="Stateful & Calico CNI rules"
          icon={FileCheck}
          variant="purple"
          trend="Default-Deny Enforced"
        />
        <MetricCard
          title="Blocked Ingress / Attacks"
          value={dashboardStats?.blockedConnections ?? 142}
          subtitle="Real-time containment active"
          icon={AlertTriangle}
          variant="rose"
          trend="100% Containment"
        />
      </div>

      {/* Middle Grid: Charts & Security Posture Vectors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Traffic Telemetry Chart */}
        <CyberCard
          title="Live Traffic & Threat Inspection Telemetry"
          subtitle="Layer 3-7 Stateful Packet Flows across Hybrid Backbone"
          className="lg:col-span-2"
          headerIcon={<Activity className="w-4 h-4" />}
          action={
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Allowed
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Blocked
              </span>
            </div>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="allowed" stroke="#10b981" fillOpacity={1} fill="url(#colorAllowed)" />
                <Area type="monotone" dataKey="blocked" stroke="#f43f5e" fillOpacity={1} fill="url(#colorBlocked)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CyberCard>

        {/* Security Posture Breakdown by Vector */}
        <CyberCard
          title="Posture Vector Breakdown"
          subtitle="Calculated from real system state"
          headerIcon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
          action={
            <button 
              onClick={() => setActiveView('posture')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Details <ArrowUpRight className="w-3 h-3" />
            </button>
          }
        >
          <div className="space-y-3.5 pt-1">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">{cat.name}</span>
                  <span className="font-bold text-slate-100">{cat.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.score}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CyberCard>
      </div>

      {/* Bottom Grid: Active Threat Vector Distribution & Recent SIEM Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Types Distribution */}
        <CyberCard
          title="Simulated Threat Vectors"
          subtitle="Containment efficacy across attack types"
          headerIcon={<Flame className="w-4 h-4 text-rose-400" />}
        >
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] font-mono">
            {threatDistribution.map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="truncate">{t.name}</span>
              </div>
            ))}
          </div>
        </CyberCard>

        {/* Live SIEM Security Events Stream */}
        <CyberCard
          title="Recent SIEM & Audit Events"
          subtitle="Real-time MongoDB audit stream"
          className="lg:col-span-2"
          headerIcon={<Activity className="w-4 h-4 text-cyan-400" />}
          action={
            <button 
              onClick={() => setActiveView('audit')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Full Log <ArrowUpRight className="w-3 h-3" />
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">TIMESTAMP</th>
                  <th className="pb-2">EVENT</th>
                  <th className="pb-2">SOURCE → TARGET</th>
                  <th className="pb-2">ACTION</th>
                  <th className="pb-2">VERDICT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(dashboardStats?.recentEvents || []).slice(0, 5).map((evt: SecurityEvent) => (
                  <tr key={evt.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 text-slate-400">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 text-slate-200 font-semibold">{evt.eventType}</td>
                    <td className="py-2.5 text-cyan-300 truncate max-w-[180px]">
                      {evt.source} → {evt.target}
                    </td>
                    <td className="py-2.5 text-slate-300">{evt.action}</td>
                    <td className="py-2.5">
                      <Badge variant={evt.result === 'BLOCKED' ? 'danger' : 'success'}>
                        {evt.result}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CyberCard>
      </div>
    </div>
  );
};
