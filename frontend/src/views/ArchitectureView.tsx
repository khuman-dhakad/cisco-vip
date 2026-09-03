import React from 'react';
import { HybridArchitectureGraph } from '../components/visualization/HybridArchitectureGraph';
import { CyberCard } from '../components/common/CyberCard';
import { Network, ShieldCheck, Lock, Layers, Server, Cloud, Cpu, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ArchitectureView: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-sky-400" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-100 tracking-tight">
              Hybrid Data Center & Cloud Architecture Visualizer
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Zero-Trust Network Topology: Campus Identity → NGFW Gateway → Private DC → Encrypted Hybrid Trunk → Public Cloud VPCs
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveView('attack-simulator')}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Simulate Attack</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Graph */}
      <HybridArchitectureGraph />

      {/* Architectural Security Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CyberCard
          title="1. Private Data Center Security"
          subtitle="Subnet isolation & Least Privilege"
          headerIcon={<Server className="w-4 h-4 text-sky-400" />}
        >
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            The Private DC is partitioned into dedicated subnets: Management (<code className="text-sky-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded border border-slate-800">10.10.0.0/24</code>), Application Segment A (<code className="text-sky-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded border border-slate-800">10.10.10.0/24</code>), Application Segment B (<code className="text-sky-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded border border-slate-800">10.10.20.0/24</code>), and Database Segment (<code className="text-sky-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded border border-slate-800">10.10.30.0/24</code>). Lateral hops between Application tiers are strictly denied.
          </p>
        </CyberCard>

        <CyberCard
          title="2. Encrypted Hybrid Trunk"
          subtitle="IPsec VPN + Direct Connect"
          headerIcon={<Lock className="w-4 h-4 text-emerald-400" />}
        >
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Cross-datacenter data exchange occurs over a redundant IPsec tunnel using <code className="text-emerald-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded border border-slate-800">AES-256-GCM</code> encryption and <code className="text-emerald-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded border border-slate-800">802.1AE MACsec</code>. Direct Cloud ingress into internal database clusters is blocked at the gateway boundary.
          </p>
        </CyberCard>

        <CyberCard
          title="3. Public Cloud Microsegmentation"
          subtitle="VPCs, Security Groups & K8s CNI"
          headerIcon={<Cloud className="w-4 h-4 text-purple-400" />}
        >
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Cloud infrastructure is segmented into VPC 1 (Prod Web), VPC 2 (Kubernetes Payment/Research Pods), and VPC 3 (Analytics). Inter-VPC traversal is prevented via strict cloud Security Groups, while Calico CNI isolates container namespaces.
          </p>
        </CyberCard>
      </div>
    </div>
  );
};
