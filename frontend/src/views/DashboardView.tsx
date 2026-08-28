import React from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { SecurityEvent, Incident } from '../types';
import { 
  ShieldCheck, 
  Server, 
  FileCheck, 
  AlertTriangle, 
  Flame, 
  Activity, 
  ArrowUpRight,
  Shield,
  Zap,
  Lock,
  Radio
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
  Cell
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { dashboardStats, securityPosture, incidents, setActiveView, startGuidedDemo } = useApp();

  const score = dashboardStats?.overallSecurityScore ?? securityPosture?.score ?? 95;
  const grade = securityPosture?.grade ?? 'A+';

  const trafficData = [
    { time: '12:00', allowed: 14200, blocked: 240 },
    { time: '13:00', allowed: 18400, blocked: 310 },
    { time: '14:00', allowed: 22100, blocked: 450 },
    { time: '15:00', allowed: 26800, blocked: 580 },
    { time: '16:00', allowed: 31200, blocked: 820 },
    { time: '17:00', allowed: 34900, blocked: 940 },
  ];

  const categoryBreakdown = [
    { name: 'IAM & MFA Governance', score: securityPosture?.categoryScores?.IAM_MFA ?? 95, color: '#38bdf8' },
    { name: 'Network Microsegmentation', score: securityPosture?.categoryScores?.MICROSEGMENTATION ?? 90, color: '#0284c7' },
    { name: 'Stateful Firewall Rules', score: securityPosture?.categoryScores?.FIREWALL_HEALTH ?? 92, color: '#10b981' },
    { name: 'Workload & Pod Hygiene', score: securityPosture?.categoryScores?.WORKLOAD_HYGIENE ?? 90, color: '#818cf8' },
    { name: 'Hybrid Trunk Integrity', score: securityPosture?.categoryScores?.HYBRID_LINK_INTEGRITY ?? 95, color: '#06b6d4' },
  ];

  // Base threat vector metrics augmented dynamically with active simulated incidents
  const baseThreatCounts: Record<string, { count: number; color: string }> = {
    'Lateral Movement': { count: 35, color: '#ef4444' },
    'Direct DB Ingress': { count: 25, color: '#f59e0b' },
    'Cross-VPC Hopping': { count: 20, color: '#8b5cf6' },
    'RBAC Escalation': { count: 12, color: '#0284c7' },
    'C2 Exfiltration': { count: 8, color: '#ec4899' },
  };

  const dynamicIncidentCounts = (incidents || []).reduce((acc: Record<string, number>, inc: Incident) => {
    const text = `${inc.attackType || ''} ${inc.title || ''}`.toLowerCase();
    if (text.includes('lateral') || text.includes('compromised_app')) {
      acc['Lateral Movement'] = (acc['Lateral Movement'] || 0) + 1;
    } else if (text.includes('db') || text.includes('database')) {
      acc['Direct DB Ingress'] = (acc['Direct DB Ingress'] || 0) + 1;
    } else if (text.includes('vpc')) {
      acc['Cross-VPC Hopping'] = (acc['Cross-VPC Hopping'] || 0) + 1;
    } else if (text.includes('rbac') || text.includes('privilege')) {
      acc['RBAC Escalation'] = (acc['RBAC Escalation'] || 0) + 1;
    } else if (text.includes('c2') || text.includes('exfiltration')) {
      acc['C2 Exfiltration'] = (acc['C2 Exfiltration'] || 0) + 1;
    }
    return acc;
  }, {});

  const threatDistribution = Object.entries(baseThreatCounts).map(([name, meta]) => ({
    name,
    value: meta.count + (dynamicIncidentCounts[name] || 0),
    color: meta.color,
  }));

  const totalAttacks = threatDistribution.reduce((acc, curr) => acc + curr.value, 0);

  // Custom high-contrast tooltip for Donut Chart
  const CustomThreatTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const val = data.value;
      const pct = totalAttacks > 0 ? ((val / totalAttacks) * 100).toFixed(1) : '0.0';
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl font-mono text-xs z-50">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: data.payload.color }} />
            <span className="font-bold text-slate-100">{data.name}</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Total Count:</span>
              <span className="text-slate-100 font-semibold">{val} attacks</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Percentage:</span>
              <span className="text-sky-400 font-bold">{pct}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: SOC Header & Console Overview */}
      <div className="relative overflow-hidden rounded-xl p-6 bg-slate-900/90 border border-slate-800 shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950/80 text-sky-400 border border-sky-800/60">
                SECURITY OPERATIONS CENTER
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse" /> ZERO TRUST ACTIVE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono tracking-tight">
              Hybrid Data Center Network Security & Attack Containment Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Continuous threat inspection, stateful priority-based firewall enforcement, and automated incident triage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startGuidedDemo}
              className="px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
            >
              <Flame className="w-4 h-4 fill-current text-amber-300" />
              <span>Launch 13-Step Guided Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary SOC Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Security Posture"
          value={`${score}/100`}
          subtitle={`Grade ${grade} • Zero-Trust Baseline`}
          icon={ShieldCheck}
          variant={score >= 80 ? 'emerald' : 'rose'}
          trend={score >= 80 ? '+12% vs Flat Network' : '-18% Active Incident'}
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
          trend="Default-Deny Boundary"
        />
        <MetricCard
          title="Blocked Ingress / Attacks"
          value={dashboardStats?.blockedConnections ?? 142}
          subtitle="Autonomous containment active"
          icon={AlertTriangle}
          variant="rose"
          trend="100% Contained"
        />
      </div>

      {/* Middle Grid: Charts & Security Posture Vectors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Traffic Telemetry Chart */}
        <CyberCard
          title="Live Traffic & Packet Inspection Telemetry"
          subtitle="Stateful Layer 3-7 Flows across Hybrid Network Boundary"
          className="lg:col-span-2"
          headerIcon={<Activity className="w-4 h-4 text-sky-400" />}
          action={
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Authorized Traffic
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Policy Drops
              </span>
            </div>
          }
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="allowed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAllowed)" />
                <Area type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocked)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CyberCard>

        {/* Security Posture Breakdown by Vector */}
        <CyberCard
          title="Security Posture Breakdown"
          subtitle="Dynamic composite score metrics"
          headerIcon={<Shield className="w-4 h-4 text-emerald-400" />}
          action={
            <button 
              onClick={() => setActiveView('posture')}
              className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
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

      {/* Bottom Grid: Active Threat Vector Distribution Donut & Recent SIEM Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Types Distribution Donut Chart */}
        <CyberCard
          title="Threat Vector Classification"
          subtitle="Red-team attack scenarios simulated"
          headerIcon={<Flame className="w-4 h-4 text-rose-400" />}
        >
          <div className="relative h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#0f172a"
                  strokeWidth={2}
                >
                  {threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomThreatTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Total Attack Counter */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold font-mono text-slate-100 tracking-tight transition-all duration-300">
                {totalAttacks}
              </span>
              <span className="text-[9px] font-mono tracking-wider uppercase text-slate-400 font-semibold mt-0.5">
                ATTACKS SIMULATED
              </span>
            </div>
          </div>

          {/* Category Legends with Live Counts & Percentage */}
          <div className="space-y-1.5 mt-2 text-[11px] font-mono border-t border-slate-800/80 pt-2.5">
            {threatDistribution.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-slate-300 py-0.5">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                  <span className="truncate text-slate-300">{t.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono shrink-0">
                  <span className="text-slate-100 font-bold">{t.value}</span>
                  <span className="text-slate-500 text-[10px]">
                    ({totalAttacks > 0 ? ((t.value / totalAttacks) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CyberCard>

        {/* Live SIEM Security Events Stream */}
        <CyberCard
          title="Recent Security Events & Audit Stream"
          subtitle="Immutable MongoDB audit log telemetry"
          className="lg:col-span-2"
          headerIcon={<Activity className="w-4 h-4 text-sky-400" />}
          action={
            <button 
              onClick={() => setActiveView('audit')}
              className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              Full Log <ArrowUpRight className="w-3 h-3" />
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-2.5 font-medium">TIMESTAMP</th>
                  <th className="pb-2.5 font-medium">EVENT TYPE</th>
                  <th className="pb-2.5 font-medium">SOURCE → TARGET</th>
                  <th className="pb-2.5 font-medium">ACTION</th>
                  <th className="pb-2.5 font-medium">DECISION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(dashboardStats?.recentEvents || []).slice(0, 5).map((evt: SecurityEvent) => (
                  <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 text-slate-400">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 text-slate-200 font-semibold">{evt.eventType}</td>
                    <td className="py-2.5 text-sky-300 truncate max-w-[180px]">
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
