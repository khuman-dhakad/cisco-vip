import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Workload } from '../types';
import { api } from '../services/api';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { 
  Server, 
  Cpu, 
  Database, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  Layers, 
  ArrowRight, 
  Flame 
} from 'lucide-react';

export const WorkloadsView: React.FC = () => {
  const { workloads, refreshData, addToast, setActiveView } = useApp();
  const [localWorkloads, setLocalWorkloads] = useState<Workload[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PRIVATE_DC' | 'K8S_CLOUD'>('ALL');

  const fetchWorkloads = async () => {
    try {
      const data = await api.getWorkloads();
      setLocalWorkloads(data);
    } catch (err) {
      console.error('Failed to fetch workloads:', err);
    }
  };

  useEffect(() => {
    fetchWorkloads();
  }, [workloads]);

  const handleToggleCompromise = async (id: string, currentCompromised: boolean) => {
    try {
      const updated = await api.toggleWorkloadCompromise(id, !currentCompromised);
      setLocalWorkloads(prev => prev.map(w => w.id === id ? updated : w));
      refreshData();
      addToast(
        !currentCompromised ? 'danger' : 'success',
        !currentCompromised ? 'Workload Marked Compromised' : 'Workload Restored',
        `Workload ${updated.name} compromise flag set to: ${!currentCompromised}`
      );
    } catch (err: any) {
      addToast('danger', 'Action Failed', err.message || 'Error updating workload');
    }
  };

  const handleToggleQuarantine = async (id: string, currentQuarantined: boolean) => {
    try {
      const updated = await api.toggleWorkloadQuarantine(id, !currentQuarantined);
      setLocalWorkloads(prev => prev.map(w => w.id === id ? updated : w));
      refreshData();
      addToast(
        !currentQuarantined ? 'warning' : 'info',
        !currentQuarantined ? 'Workload Quarantined' : 'Quarantine Lifted',
        `Workload ${updated.name} quarantine state set to: ${!currentQuarantined}`
      );
    } catch (err: any) {
      addToast('danger', 'Action Failed', err.message || 'Error quarantining workload');
    }
  };

  const filteredWorkloads = localWorkloads.filter(w => {
    if (activeTab === 'PRIVATE_DC') return w.environment === 'PRIVATE_DATACENTER';
    if (activeTab === 'K8S_CLOUD') return w.environment === 'PUBLIC_CLOUD';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-sky-400" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-100 tracking-tight">
              Workload & Kubernetes Container Security Management
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Microservice Hygiene • Namespace Isolation • East-West CNI Calico Policies • Automated Sandbox Quarantine
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
              activeTab === 'ALL' ? 'bg-sky-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Workloads
          </button>
          <button
            onClick={() => setActiveTab('PRIVATE_DC')}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
              activeTab === 'PRIVATE_DC' ? 'bg-sky-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Private DC
          </button>
          <button
            onClick={() => setActiveTab('K8S_CLOUD')}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
              activeTab === 'K8S_CLOUD' ? 'bg-sky-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Public Cloud / K8s
          </button>
        </div>
      </div>

      {/* Kubernetes Microsegmentation Rules Panel */}
      <CyberCard
        title="Kubernetes CNI East-West NetworkPolicy Rules"
        subtitle="Namespace-level traffic boundary enforcement"
        headerIcon={<Cpu className="w-4 h-4 text-purple-400" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-emerald-800/40">
            <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
              <span>frontend → backend</span>
              <Badge variant="success">ALLOW</Badge>
            </div>
            <p className="text-[11px] text-slate-400">Permitted via HTTP/REST on TCP port 8080.</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-emerald-800/40">
            <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
              <span>backend → database</span>
              <Badge variant="success">ALLOW</Badge>
            </div>
            <p className="text-[11px] text-slate-400">Permitted SQL queries on port 5432/1521.</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-rose-800/40">
            <div className="flex items-center justify-between text-rose-400 font-bold mb-1">
              <span>frontend → database</span>
              <Badge variant="danger">DENY</Badge>
            </div>
            <p className="text-[11px] text-slate-400">Direct query bypassing backend is dropped.</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-rose-800/40">
            <div className="flex items-center justify-between text-rose-400 font-bold mb-1">
              <span>payments → research</span>
              <Badge variant="danger">DENY</Badge>
            </div>
            <p className="text-[11px] text-slate-400">PCI-DSS namespace boundary isolation.</p>
          </div>
        </div>
      </CyberCard>

      {/* Workloads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkloads.map((w) => {
          const isCompromised = w.isCompromised;
          const isQuarantined = w.isQuarantined;

          return (
            <div
              key={w.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isCompromised
                  ? 'bg-rose-950/40 border-rose-500 shadow-cyber-rose'
                  : isQuarantined
                  ? 'bg-purple-950/40 border-purple-500'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      isCompromised ? 'bg-rose-500 animate-ping' : isQuarantined ? 'bg-purple-400' : 'bg-emerald-400'
                    }`} />
                    <span className="text-xs font-mono font-bold text-slate-100">{w.name}</span>
                  </div>
                  <Badge variant={isCompromised ? 'danger' : isQuarantined ? 'purple' : 'success'}>
                    {w.status}
                  </Badge>
                </div>

                <div className="mt-2 space-y-1 text-xs font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">IP ADDRESS:</span>
                    <span className="text-cyan-400">{w.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NAMESPACE:</span>
                    <span className="text-slate-200">{w.namespace}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ENVIRONMENT:</span>
                    <span className="text-slate-200">{w.environment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">RISK SCORE:</span>
                    <span className={`font-bold ${w.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {w.riskScore} / 100
                    </span>
                  </div>
                </div>

                {/* Port Services */}
                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">EXPOSED SERVICES:</span>
                  <div className="flex flex-wrap gap-1">
                    {w.portServices.map((p: string, i: number) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2 font-mono text-xs">
                <button
                  onClick={() => handleToggleCompromise(w.id, w.isCompromised)}
                  className={`px-2.5 py-1 rounded transition-all font-semibold ${
                    w.isCompromised
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                  }`}
                >
                  {w.isCompromised ? 'Cleanse' : 'Simulate Compromise'}
                </button>

                <button
                  onClick={() => handleToggleQuarantine(w.id, w.isQuarantined)}
                  className={`px-2.5 py-1 rounded transition-all font-semibold ${
                    w.isQuarantined
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-purple-950 text-purple-300 border border-purple-800 hover:bg-purple-900'
                  }`}
                >
                  {w.isQuarantined ? 'Release' : 'Quarantine'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
