import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SecurityEvent } from '../types';
import { api } from '../services/api';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Filter, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Cpu, 
  RefreshCw 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export const MonitoringView: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await api.getEvents(severityFilter, typeFilter);
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, [severityFilter, typeFilter]);

  const telemetryChartData = [
    { time: '14:00', allowed: 120, blocked: 4, auth: 15 },
    { time: '15:00', allowed: 180, blocked: 8, auth: 22 },
    { time: '16:00', allowed: 240, blocked: 19, auth: 29 },
    { time: '17:00', allowed: 310, blocked: 35, auth: 40 },
  ];

  const getSeverityBadge = (sev: string) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL': return <Badge variant="danger" pulse>{sev}</Badge>;
      case 'HIGH': return <Badge variant="danger">{sev}</Badge>;
      case 'MEDIUM': return <Badge variant="warning">{sev}</Badge>;
      case 'LOW': return <Badge variant="info">{sev}</Badge>;
      case 'INFO':
      default: return <Badge variant="neutral">{sev}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-100">
              SIEM Security Monitoring & Network Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-Time Packet Flow Analytics • Cross-Premise Log Ingestion • Automated Threat Correlation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchEvents}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Monitoring Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CyberCard
          title="Packet Ingress / Egress Activity (Packets / Sec)"
          subtitle="Real-time hybrid trunk flow telemetry"
          headerIcon={<TrendingUp className="w-4 h-4 text-cyan-400" />}
        >
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={telemetryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="allowed" fill="#10b981" radius={[4, 4, 0, 0]} name="Allowed" />
                <Bar dataKey="blocked" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Blocked" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CyberCard>

        <CyberCard
          title="Identity & Authentication Traffic"
          subtitle="IAM login challenges, MFA verifications, and role switches"
          headerIcon={<Cpu className="w-4 h-4 text-purple-400" />}
        >
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Line type="monotone" dataKey="auth" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} name="Auth Attempts" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CyberCard>
      </div>

      {/* Telemetry Filter & Table */}
      <CyberCard
        title="Live Security Telemetry Stream"
        subtitle={`Displaying ${events.length} real-time system events`}
        headerIcon={<Terminal className="w-4 h-4 text-cyan-400" />}
        action={
          <div className="flex items-center gap-2 text-xs font-mono">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-cyan-300 outline-none"
            >
              <option value="">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="INFO">Info</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-cyan-300 outline-none"
            >
              <option value="">All Event Types</option>
              <option value="AUTH_ATTEMPT">Auth Attempts</option>
              <option value="POLICY_VIOLATION">Policy Violations</option>
              <option value="TRAFFIC_FLOW">Traffic Flows</option>
              <option value="ATTACK_SIMULATION_COMPLETED">Attack Runs</option>
              <option value="QUARANTINE_TRIGGERED">Quarantines</option>
            </select>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">TIMESTAMP</th>
                <th className="pb-3">SEVERITY</th>
                <th className="pb-3">EVENT TYPE</th>
                <th className="pb-3">ACTOR</th>
                <th className="pb-3">SOURCE → TARGET</th>
                <th className="pb-3">ACTION</th>
                <th className="pb-3">VERDICT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 text-slate-400">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5">{getSeverityBadge(evt.severity)}</td>
                  <td className="py-2.5 font-bold text-slate-200">{evt.eventType}</td>
                  <td className="py-2.5 text-slate-400">{evt.actor}</td>
                  <td className="py-2.5 text-slate-300 truncate max-w-xs">
                    <span className="text-cyan-400">{evt.source}</span> → <span className="text-emerald-400">{evt.target}</span>
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
  );
};
