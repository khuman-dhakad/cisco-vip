import React, { useState, useEffect } from 'react';
import { AttackSimulation, AttackStep } from '../../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Play, 
  RotateCcw, 
  SkipForward, 
  CheckCircle2, 
  XCircle,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';

interface AttackPathCanvasProps {
  simulation: AttackSimulation | null;
  onContainWorkload?: () => void;
}

export const AttackPathCanvas: React.FC<AttackPathCanvasProps> = ({ 
  simulation, 
  onContainWorkload 
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps: AttackStep[] = simulation?.steps || [
    {
      stepNumber: 1,
      stageName: 'Ingress Probe',
      sourceNode: 'ADVERSARY (203.0.113.45)',
      destinationNode: 'APP_A (10.10.10.15:443)',
      attemptedAction: 'HTTP POST Exploitation Payload',
      status: 'SUCCESS',
      logMessage: 'Exploit payload executed in container sandbox.'
    },
    {
      stepNumber: 2,
      stageName: 'Lateral Movement Attempt',
      sourceNode: 'APP_A (10.10.10.15)',
      destinationNode: 'APP_B (10.10.20.25:8080)',
      attemptedAction: 'Lateral TCP SYN Connect',
      status: 'EVALUATING',
      logMessage: 'Packet intercepted at Enterprise Firewall Policy Engine.'
    },
    {
      stepNumber: 3,
      stageName: 'Policy Rule Evaluation',
      sourceNode: 'APP_A (10.10.10.15)',
      destinationNode: 'APP_B (10.10.20.25)',
      attemptedAction: 'Match Rule #130: DENY App A -> App B',
      status: 'BLOCKED',
      logMessage: 'Firewall DENIED packet. Connection reset dispatched.',
      policyIdMatched: 'POL_130',
      ruleDetails: 'DENY WORKLOAD:APP_A -> WORKLOAD:APP_B (Priority: 130)'
    },
    {
      stepNumber: 4,
      stageName: 'Incident Creation & Quarantine',
      sourceNode: 'SECURITY_GATEWAY',
      destinationNode: 'SOC_DASHBOARD',
      attemptedAction: 'Generate Critical Incident & Quarantine App A',
      status: 'QUARANTINED',
      logMessage: 'Incident opened. Application A quarantined. Lateral path severed.'
    }
  ];

  // Auto-play steps timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const activeStep = steps[currentStepIndex] || steps[0];

  const getStepStatusBadge = (status: string) => {
    switch (status) {
      case 'BLOCKED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">BLOCKED</span>;
      case 'SUCCESS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">TRIGGERED</span>;
      case 'QUARANTINED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">QUARANTINED</span>;
      case 'EVALUATING':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">INSPECTING</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Player Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-bold text-slate-100 font-mono">
              {simulation?.scenarioName || 'Lateral Movement & Containment Simulation'}
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time step-by-step packet inspection & Zero-Trust policy enforcement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold transition-all shadow-cyber-cyan"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPlaying ? 'Playing...' : 'Play Trace'}</span>
          </button>
          <button
            onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStepIndex >= steps.length - 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="Reset Trace"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="relative rounded-2xl bg-[#06080e] border border-slate-800/90 p-6 md:p-8 overflow-hidden">
        {/* Animated Background Laser Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.06)_0%,transparent_50%)] pointer-events-none" />

        {/* Step Progress Nodes */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          {steps.map((st, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isBlockedStep = st.status === 'BLOCKED';

            return (
              <React.Fragment key={idx}>
                {/* Node Box */}
                <div
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex-1 w-full p-4 rounded-xl border transition-all cursor-pointer text-center relative ${
                    isCurrent
                      ? isBlockedStep
                        ? 'bg-rose-950/70 border-rose-500 shadow-cyber-rose scale-105'
                        : 'bg-cyan-950/70 border-cyan-500 shadow-cyber-cyan scale-105'
                      : isCompleted
                      ? 'bg-slate-900/90 border-slate-700 opacity-90'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-50'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">
                    STEP 0{st.stepNumber}
                  </div>
                  <h5 className="text-xs font-bold text-slate-100 truncate">{st.stageName}</h5>
                  <div className="mt-2 flex justify-center">{getStepStatusBadge(st.status)}</div>
                </div>

                {/* Connecting Line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex flex-col items-center justify-center px-1">
                    <div className={`h-0.5 w-8 ${idx < currentStepIndex ? 'bg-rose-500' : 'bg-slate-800'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Active Step Deep Forensic Inspector */}
        <div className="mt-8 relative z-10 max-w-4xl mx-auto rounded-xl bg-slate-950/90 border border-slate-800 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-slate-200">
                ACTIVE STEP #{activeStep.stepNumber}: {activeStep.stageName.toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {activeStep.sourceNode} → {activeStep.destinationNode}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-2">
              <div>
                <span className="text-slate-400 text-[11px]">ATTEMPTED ACTION:</span>
                <p className="text-slate-200 font-semibold mt-0.5">{activeStep.attemptedAction}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">SECURITY VERDICT:</span>
                <div className="mt-1 flex items-center gap-2">
                  {activeStep.status === 'BLOCKED' ? (
                    <span className="text-rose-400 flex items-center gap-1 font-bold">
                      <XCircle className="w-4 h-4" /> TRAFFIC BLOCKED & DROPPED
                    </span>
                  ) : activeStep.status === 'QUARANTINED' ? (
                    <span className="text-purple-400 flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-4 h-4" /> COMPROMISED WORKLOAD ISOLATED
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1 font-bold">
                      <AlertTriangle className="w-4 h-4" /> EXPLOIT INITIATED
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px]">FIREWALL / POLICY ENGINE LOG:</span>
              <p className="text-cyan-300 text-[11px] leading-relaxed">{activeStep.logMessage}</p>
              {activeStep.ruleDetails && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-300">
                  <span className="text-slate-400">MATCHED RULE:</span> {activeStep.ruleDetails}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Final Containment Summary Card */}
        {simulation && (
          <div className="mt-4 max-w-4xl mx-auto p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-200 uppercase tracking-wide">
                CONTAINMENT VERDICT: {simulation.finalVerdict}
              </span>
              <p className="mt-1 text-slate-300 leading-relaxed">
                {simulation.mitigationRecommendation || 'Zero-Trust microsegmentation policy successfully thwarted lateral propagation. Enterprise Core Database integrity preserved.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
