import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AttackExecutionResult } from '../types';
import { api } from '../services/api';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { AttackPathCanvas } from '../components/visualization/AttackPathCanvas';
import { 
  Flame, 
  ShieldAlert, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Server, 
  Database, 
  Cloud, 
  Lock, 
  Terminal, 
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const AttackSimulatorView: React.FC = () => {
  const { latestAttackResult, setLatestAttackResult, refreshData, addToast, setActiveView } = useApp();
  const [selectedScenario, setSelectedScenario] = useState<string>('COMPROMISED_APP');
  const [isExecuting, setIsExecuting] = useState(false);

  const scenarios = [
    {
      type: 'COMPROMISED_APP',
      title: '1. Compromised Application & Containment',
      source: 'Adversary (203.0.113.45)',
      target: 'App Segment A (10.10.10.15)',
      vector: 'CVE-2026-RemoteCodeExecution Ingress',
      desc: 'Application A becomes compromised via unpatched web API. Attacker attempts to scan internal subnet and pivot to App B. Firewall Policy #130 blocks lateral movement.',
      expectedVerdict: 'BLOCKED BY POLICY #130'
    },
    {
      type: 'LATERAL_MOVEMENT',
      title: '2. Lateral Movement to Database Core',
      source: 'Compromised App A (10.10.10.15)',
      target: 'Database Core (10.10.30.5)',
      vector: 'SSH (Port 22) Administrative Pivot Attempt',
      desc: 'Adversary on App A attempts lateral SSH pivoting to Core Database. Policy #135 permits SQL (5432) but strictly DENIES administrative SSH port 22.',
      expectedVerdict: 'BLOCKED BY POLICY #135'
    },
    {
      type: 'CROSS_VPC_HOPPING',
      title: '3. Unauthorized Cross-VPC Hopping',
      source: 'VPC 3 Analytics (10.20.3.40)',
      target: 'VPC 1 Prod Web (10.20.1.10)',
      vector: 'Cross-VPC Peering Bypass Probe',
      desc: 'Compromised Analytics Pod attempts to hop inter-VPC boundaries directly into Production Web. Cloud Security Group denies unpeered cross-VPC traversal.',
      expectedVerdict: 'BLOCKED BY CLOUD SG #150'
    },
    {
      type: 'UNAUTHORIZED_DB_ACCESS',
      title: '4. Direct Cloud-to-DC Database Access',
      source: 'Public Cloud Web (10.20.1.10)',
      target: 'Internal DB Oracle (10.10.30.5)',
      vector: 'Hybrid Ingress Gateway Bypass',
      desc: 'External adversary attempts querying internal private database directly over hybrid link without API proxy termination. Policy #140 drops direct DB ingress.',
      expectedVerdict: 'BLOCKED BY POLICY #140'
    },
    {
      type: 'PRIVILEGE_ESCALATION',
      title: '5. IAM RBAC Privilege Escalation',
      source: 'Faculty Account (faculty_01)',
      target: 'Admin API (/api/policies/override)',
      vector: 'Unauthorized JWT Claim Elevation',
      desc: 'Faculty account attempts to invoke administrative policy modification endpoints. Spring Security RBAC intercepts and returns HTTP 403 Forbidden.',
      expectedVerdict: 'BLOCKED BY RBAC GUARD'
    },
    {
      type: 'C2_EXFILTRATION',
      title: '6. Suspicious C2 Data Exfiltration',
      source: 'K8s Payment Pod (10.20.2.14)',
      target: 'Malicious External C2 (198.51.100.77)',
      vector: 'Outbound Botnet Egress Socket',
      desc: 'Compromised container process attempts exfiltrating bundled database credentials to external C2 server. Egress firewall Policy #170 terminates connection.',
      expectedVerdict: 'BLOCKED BY EGRESS POLICY #170'
    }
  ];

  const handleRunAttack = async (scenarioType: string) => {
    try {
      setIsExecuting(true);
      setSelectedScenario(scenarioType);

      const result = await api.simulateAttack({ scenarioType });
      setLatestAttackResult(result);
      await refreshData();

      addToast(
        'danger',
        'Attack Simulation Executed',
        `${result.simulation.scenarioName} was evaluated against policy engine and CONTAINED.`
      );
    } catch (err: any) {
      addToast('danger', 'Simulation Error', err.message || 'Failed to simulate attack');
    } finally {
      setIsExecuting(false);
    }
  };

  const currentResult = latestAttackResult?.simulation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500 animate-pulse" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-100">
              Red-Team Attack Simulator & Automated Containment Engine
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Simulate realistic multi-vector cyber attacks and verify that Zero-Trust microsegmentation strictly contains lateral propagation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRunAttack(selectedScenario)}
            disabled={isExecuting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono text-xs font-bold transition-all shadow-cyber-rose flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isExecuting ? 'Simulating Attack Stages...' : 'Execute Selected Scenario'}</span>
          </button>
        </div>
      </div>

      {/* 6 Scenario Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((sc) => {
          const isSelected = selectedScenario === sc.type;
          return (
            <div
              key={sc.type}
              onClick={() => setSelectedScenario(sc.type)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/95 border-rose-500 shadow-cyber-rose scale-[1.01]'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-mono text-xs font-bold text-slate-100">{sc.title}</h4>
                  <Badge variant={isSelected ? 'danger' : 'neutral'}>
                    {sc.expectedVerdict}
                  </Badge>
                </div>

                <div className="text-[11px] font-mono space-y-1 mb-3 text-slate-400">
                  <div>
                    <span className="text-slate-500">SRC:</span> <span className="text-rose-400">{sc.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">TGT:</span> <span className="text-cyan-400">{sc.target}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">VECTOR:</span> <span className="text-slate-300">{sc.vector}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{sc.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {isSelected ? 'ACTIVE SELECTION' : 'Click to select'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRunAttack(sc.type);
                  }}
                  disabled={isExecuting}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Launch</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Attack Path & Forensics Canvas */}
      {currentResult && (
        <div className="space-y-4">
          <CyberCard
            title="Real-Time Attack Execution Trace & Policy Inspection"
            subtitle={`Live execution time: ${currentResult.executionTimeMs}ms • Policy Decision: ${currentResult.finalVerdict}`}
            headerIcon={<Flame className="w-4 h-4 text-rose-400" />}
            action={
              <div className="flex items-center gap-2">
                {latestAttackResult?.generatedIncident && (
                  <button
                    onClick={() => setActiveView('incidents')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs flex items-center gap-1"
                  >
                    <span>View Incident #{latestAttackResult.generatedIncident.id}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            }
          >
            <AttackPathCanvas simulation={currentResult} />
          </CyberCard>
        </div>
      )}
    </div>
  );
};
