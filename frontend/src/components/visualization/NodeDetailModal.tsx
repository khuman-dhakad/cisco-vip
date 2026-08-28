import React from 'react';
import { Drawer } from '../common/Drawer';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Network, 
  Server, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface NodeDetailModalProps {
  node: any | null;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({ node, onClose }) => {
  const { setActiveView } = useApp();

  if (!node) return null;

  const getRiskVariant = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case 'CRITICAL': return 'danger';
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      case 'LOW':
      default: return 'success';
    }
  };

  return (
    <Drawer
      isOpen={!!node}
      onClose={onClose}
      title={node.label || node.name}
      subtitle={`Topology Node Type: ${node.type || 'Enterprise Network Asset'}`}
      icon={<Network className="w-5 h-5" />}
      width="max-w-xl"
    >
      <div className="space-y-5 font-sans">
        {/* Top Status Banner */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Environment</span>
            <p className="text-xs font-semibold text-slate-200 mt-0.5">{node.environment || 'Hybrid Enterprise'}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Simulated CIDR / IP</span>
            <p className="text-xs font-mono font-semibold text-sky-400 mt-0.5">{node.cidr || node.ip || '10.10.0.0/16'}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Security Status</span>
            <div className="mt-1">
              <Badge variant={node.status === 'COMPROMISED' ? 'danger' : node.status === 'ISOLATED' ? 'warning' : 'success'} pulse={node.status === 'COMPROMISED'}>
                {node.status || 'SECURE'}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Risk Level</span>
            <div className="mt-1">
              <Badge variant={getRiskVariant(node.riskLevel || 'LOW')}>
                {node.riskLevel || 'LOW'} RISK
              </Badge>
            </div>
          </div>
        </div>

        {/* Node Description & Architecture Context */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs leading-relaxed text-slate-300 space-y-1.5">
          <p className="font-semibold text-slate-200 flex items-center gap-1.5 font-mono text-xs">
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            Architectural Role & Security Boundary
          </p>
          <p className="text-slate-400">{node.description || 'Core hybrid architecture component providing structured access control, microsegmentation, and lateral containment.'}</p>
        </div>

        {/* Security Controls & Policies */}
        <div>
          <h4 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            Active Security Controls
          </h4>
          <div className="space-y-1.5">
            {(node.controls || [
              'Stateful Inspection Next-Gen Firewall (NGFW)',
              'Zero-Trust Identity-Aware Proxy',
              'Microsegmentation CIDR ACLs',
              'Calico CNI East-West NetworkPolicies',
              'IPsec AES-256-GCM Encrypted Tunnel'
            ]).map((ctrl: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{ctrl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Allowed vs Blocked Vectors */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/40">
            <h5 className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Authorized Flows (Permit)
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(node.allowedConnections || [
                'Faculty -> Academic Portal (HTTPS 443)',
                'App A -> Core Database (SQL 5432)',
                'Approved Hybrid API Sync (TLS 443)'
              ]).map((c: string, i: number) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-900/40">
            <h5 className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              Blocked Vectors (Containment Boundary)
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(node.blockedConnections || [
                'App A -> App B (Lateral Movement Blocked)',
                'Public Cloud -> Internal DB Direct Ingress',
                'Unapproved Admin SSH (Port 22)',
                'Internal Workload -> Unknown External C2 Egress'
              ]).map((b: string, i: number) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              setActiveView('policies');
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors"
          >
            Inspect Policy Rules
          </button>
          <button
            onClick={() => {
              onClose();
              setActiveView('attack-simulator');
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5" />
            Launch Attack Simulator
          </button>
        </div>
      </div>
    </Drawer>
  );
};
