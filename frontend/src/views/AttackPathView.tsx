import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AttackSimulation } from '../types';
import { api } from '../services/api';
import { AttackPathCanvas } from '../components/visualization/AttackPathCanvas';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { GitFork, Flame, History, Terminal, ArrowRight } from 'lucide-react';

export const AttackPathView: React.FC = () => {
  const { latestAttackResult, setActiveView } = useApp();
  const [history, setHistory] = useState<AttackSimulation[]>([]);
  const [selectedSim, setSelectedSim] = useState<AttackSimulation | null>(latestAttackResult?.simulation || null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getAttackHistory();
        setHistory(data);
        if (!selectedSim && data.length > 0) {
          setSelectedSim(data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch attack history:', err);
      }
    };
    fetchHistory();
  }, [latestAttackResult]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-100">
              Attack Path & Blast Radius Visualizer
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual Packet Flow Tracing • Microsegmentation Policy Gates • Red-to-Green Containment Verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('attack-simulator')}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold transition-all shadow-cyber-rose flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Launch New Attack</span>
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <AttackPathCanvas simulation={selectedSim} />

      {/* History Selector */}
      {history.length > 0 && (
        <CyberCard
          title="Past Attack Simulation Runs (MongoDB Stored)"
          subtitle="Select any historical attack to replay its animated packet trace"
          headerIcon={<History className="w-4 h-4 text-cyan-400" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            {history.map((sim) => (
              <div
                key={sim.id}
                onClick={() => setSelectedSim(sim)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedSim?.id === sim.id
                    ? 'bg-cyan-950/50 border-cyan-500 shadow-cyber-cyan'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-100 truncate">{sim.scenarioName}</span>
                  <Badge variant={sim.blocked ? 'danger' : 'warning'}>
                    {sim.blocked ? 'BLOCKED' : 'EXPLOITED'}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {sim.attackerSource} → {sim.targetWorkload}
                </div>
                <div className="mt-2 text-[10px] text-slate-500">
                  {new Date(sim.timestamp).toLocaleString()} • {sim.executionTimeMs}ms
                </div>
              </div>
            ))}
          </div>
        </CyberCard>
      )}
    </div>
  );
};
