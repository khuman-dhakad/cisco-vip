import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { NetworkSegment } from '../types';
import { api } from '../services/api';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { 
  Grid, 
  Server, 
  Cloud, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Radio, 
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const SegmentationView: React.FC = () => {
  const { addToast } = useApp();
  const [localSegments, setLocalSegments] = useState<NetworkSegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSegments = async () => {
    try {
      setIsLoading(true);
      const data = await api.getSegments();
      setLocalSegments(data);
    } catch (err) {
      console.error('Failed to fetch segments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const handleToggleIsolation = async (id: string, currentMode: boolean) => {
    try {
      const updated = await api.toggleSegmentIsolation(id, !currentMode);
      setLocalSegments(prev => prev.map(s => s.id === id ? updated : s));
      addToast(
        !currentMode ? 'warning' : 'success',
        !currentMode ? 'Emergency Isolation Enforced' : 'Segment Routing Restored',
        `Segment ${updated.name} isolation mode set to: ${!currentMode}`
      );
    } catch (err: any) {
      addToast('danger', 'Action Failed', err.message || 'Could not update segment isolation');
    }
  };

  const privateSegments = localSegments.filter(s => s.environment === 'PRIVATE_DATACENTER');
  const cloudSegments = localSegments.filter(s => s.environment === 'PUBLIC_CLOUD');

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-100">
              Hybrid Network Microsegmentation & Blast Radius Control
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulated CIDR Topology: Private DC (10.10.0.0/16) • Public Cloud VPCs (10.20.0.0/16) • Subnet-Level Isolation Controls
          </p>
        </div>
      </div>

      {/* Domain 1: Private Datacenter Segments */}
      <CyberCard
        title="Private Data Center Segments (10.10.0.0/16)"
        subtitle="On-Premises High-Security Subnets & Workload Enclaves"
        headerIcon={<Server className="w-4 h-4 text-cyan-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {privateSegments.map((seg) => (
            <div
              key={seg.id}
              className={`p-4 rounded-xl border transition-all ${
                seg.isolationMode
                  ? 'bg-rose-950/40 border-rose-500 shadow-cyber-rose'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${seg.isolationMode ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                    <h4 className="font-mono text-xs font-bold text-slate-100">{seg.name}</h4>
                  </div>
                  <p className="text-[11px] font-mono text-cyan-400 mt-0.5">CIDR: {seg.cidr}</p>
                </div>
                <Badge variant={seg.isolationMode ? 'danger' : 'success'}>
                  {seg.isolationMode ? 'ISOLATED' : 'ROUTING ACTIVE'}
                </Badge>
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{seg.description}</p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Workloads: {seg.workloadCount} Instances</span>
                <button
                  onClick={() => handleToggleIsolation(seg.id, seg.isolationMode)}
                  className={`px-3 py-1 rounded text-xs transition-all font-semibold ${
                    seg.isolationMode
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                  }`}
                >
                  {seg.isolationMode ? 'Restore Routing' : 'Emergency Isolate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </CyberCard>

      {/* Domain 2: Public Cloud VPC Segments */}
      <CyberCard
        title="Public Cloud VPC Segments (10.20.0.0/16)"
        subtitle="Cloud Virtual Private Clouds, Microservice Clusters & Data Lakes"
        headerIcon={<Cloud className="w-4 h-4 text-sky-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cloudSegments.map((seg) => (
            <div
              key={seg.id}
              className={`p-4 rounded-xl border transition-all ${
                seg.isolationMode
                  ? 'bg-rose-950/40 border-rose-500 shadow-cyber-rose'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${seg.isolationMode ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                    <h4 className="font-mono text-xs font-bold text-slate-100">{seg.name}</h4>
                  </div>
                  <p className="text-[11px] font-mono text-sky-400 mt-0.5">CIDR: {seg.cidr}</p>
                </div>
                <Badge variant={seg.isolationMode ? 'danger' : 'info'}>
                  {seg.vpcId}
                </Badge>
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{seg.description}</p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{seg.workloadCount} Pods/Nodes</span>
                <button
                  onClick={() => handleToggleIsolation(seg.id, seg.isolationMode)}
                  className={`px-2.5 py-1 rounded text-xs transition-all font-semibold ${
                    seg.isolationMode
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                  }`}
                >
                  {seg.isolationMode ? 'Restore' : 'Isolate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </CyberCard>
    </div>
  );
};
