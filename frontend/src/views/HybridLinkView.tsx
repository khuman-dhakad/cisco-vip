import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HybridLinkState } from '../types';
import { api } from '../services/api';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { 
  Link2, 
  Lock, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Radio,
  Server,
  Cloud,
  ArrowRight
} from 'lucide-react';

export const HybridLinkView: React.FC = () => {
  const { hybridLink: globalLink, refreshData, addToast } = useApp();
  const [linkState, setLinkState] = useState<HybridLinkState | null>(globalLink);
  const [isToggling, setIsToggling] = useState(false);

  const fetchLink = async () => {
    try {
      const data = await api.getHybridLink();
      setLinkState(data);
    } catch (err) {
      console.error('Failed to fetch hybrid link:', err);
    }
  };

  useEffect(() => {
    fetchLink();
  }, [globalLink]);

  const handleToggleDegrade = async () => {
    if (!linkState) return;
    try {
      setIsToggling(true);
      const isDegraded = linkState.simulatedDegraded;
      const updated = await api.toggleHybridLinkDegrade(!isDegraded);
      setLinkState(updated);
      await refreshData();
      addToast(
        !isDegraded ? 'warning' : 'success',
        !isDegraded ? 'Hybrid Link Degraded (Simulation)' : 'Hybrid Link Restored',
        `Link status set to: ${updated.status} (Latency: ${updated.latencyMs}ms)`
      );
    } catch (err: any) {
      addToast('danger', 'Action Failed', err.message || 'Could not update hybrid link');
    } finally {
      setIsToggling(false);
    }
  };

  const isDegraded = linkState?.simulatedDegraded || linkState?.status === 'DEGRADED';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-100">
              Hybrid Connection & Direct Connect Gateway Controller
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Redundant IPsec VPN Trunk + AWS Direct Connect Dedicated 10 Gbps Fabric with 802.1AE MACsec Layer 2 Encryption
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleDegrade}
            disabled={isToggling}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 ${
              isDegraded
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-cyber-emerald'
                : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{isDegraded ? 'Restore Hybrid Trunk Health' : 'Inject Simulated Degradation'}</span>
          </button>
        </div>
      </div>

      {/* Main Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Trunk Status</span>
          <div className="mt-1 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isDegraded ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className={`text-base font-bold ${isDegraded ? 'text-amber-400' : 'text-emerald-400'}`}>
              {linkState?.status || 'SECURE'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Round-Trip Latency</span>
          <div className="mt-1">
            <span className={`text-base font-bold ${isDegraded ? 'text-rose-400' : 'text-cyan-400'}`}>
              {linkState?.latencyMs ?? 4} ms
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Packet Loss</span>
          <div className="mt-1">
            <span className={`text-base font-bold ${isDegraded ? 'text-rose-400' : 'text-slate-200'}`}>
              {linkState?.packetLossPercent ?? 0.001}%
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Bandwidth Capacity</span>
          <div className="mt-1">
            <span className="text-base font-bold text-slate-200">
              {linkState?.primaryBandwidth || '10 Gbps'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Link Backbone */}
      <CyberCard
        title="Hybrid Encryption & BGP Route Inspection"
        subtitle="Cryptographic standard: AES-256-GCM / SHA-384 / IKEv2 / MACsec"
        headerIcon={<Lock className="w-4 h-4 text-cyan-400" />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center p-4 rounded-xl bg-slate-950 border border-slate-800">
          {/* Left: Private DC */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-center">
            <Server className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-100 font-mono">PRIVATE DATA CENTER</h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Enterprise Gateway (10.10.0.1)</p>
          </div>

          {/* Center: Encrypted IPsec Trunk */}
          <div className="flex flex-col items-center justify-center text-center space-y-2 font-mono text-xs">
            <div className={`w-full h-1.5 rounded-full ${isDegraded ? 'bg-amber-500' : 'bg-gradient-to-r from-cyan-500 via-emerald-400 to-sky-500'} relative`}>
              <span className="absolute left-1/2 -top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
            </div>
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> AES-256-GCM ENCRYPTED TUNNEL
            </span>
            <p className="text-[10px] text-slate-400">Total Transferred: 14.89 GB • 9.42M Inspected Packets</p>
          </div>

          {/* Right: Public Cloud */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-center">
            <Cloud className="w-8 h-8 text-sky-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-100 font-mono">PUBLIC CLOUD (AWS/VPC)</h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Virtual Private Gateway (10.20.0.1)</p>
          </div>
        </div>
      </CyberCard>

      {/* Allowed vs Blocked Hybrid Routes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CyberCard
          title="Allowed Cross-Premise Routes"
          subtitle="Explicitly permitted sync routes"
          headerIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        >
          <ul className="space-y-2 font-mono text-xs text-slate-300">
            {(linkState?.allowedRoutes || [
              '10.10.0.0/16 <-> 10.20.0.0/16 (Approved Hybrid Sync)',
              '10.10.10.0/24 <-> 10.20.1.0/24 (Academic API Relay)'
            ]).map((r: string, i: number) => (
              <li key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-emerald-900/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </CyberCard>

        <CyberCard
          title="Blocked Cross-Premise Routes"
          subtitle="Zero-Trust perimeter drop policies"
          headerIcon={<XCircle className="w-4 h-4 text-rose-400" />}
        >
          <ul className="space-y-2 font-mono text-xs text-slate-300">
            {(linkState?.blockedRoutes || [
              '0.0.0.0/0 Direct DC Egress without Proxy',
              '10.20.3.0/24 -> 10.10.30.0/24 (Direct DB Ingress blocked)'
            ]).map((r: string, i: number) => (
              <li key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-rose-900/30">
                <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </CyberCard>
      </div>
    </div>
  );
};
