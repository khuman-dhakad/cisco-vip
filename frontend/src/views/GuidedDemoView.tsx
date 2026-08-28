import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { DashboardView } from './DashboardView';
import { ArchitectureView } from './ArchitectureView';
import { IamRbacView } from './IamRbacView';
import { SegmentationView } from './SegmentationView';
import { PoliciesView } from './PoliciesView';
import { AttackSimulatorView } from './AttackSimulatorView';
import { AttackPathView } from './AttackPathView';
import { IncidentsView } from './IncidentsView';
import { SecurityPostureView } from './SecurityPostureView';
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Flame, 
  ShieldAlert, 
  ShieldCheck, 
  X,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Sparkles
} from 'lucide-react';

type StepStatus = 'IDLE' | 'EXECUTING' | 'SUCCESS' | 'ERROR';

interface DemoStepDefinition {
  step: number;
  title: string;
  subtitle: string;
  narration: string;
  actionLabel: string;
  execute: () => Promise<void>;
}

export const GuidedDemoView: React.FC = () => {
  const { 
    demoStep, 
    nextDemoStep, 
    prevDemoStep, 
    exitGuidedDemo, 
    startGuidedDemo,
    setLatestAttackResult,
    refreshData,
    addToast
  } = useApp();

  const [stepStatuses, setStepStatuses] = useState<Record<number, StepStatus>>({});
  const [stepErrors, setStepErrors] = useState<Record<number, string>>({});
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const setStepState = useCallback((stepNum: number, status: StepStatus, errorMsg?: string) => {
    if (!isMountedRef.current) return;
    setStepStatuses(prev => ({ ...prev, [stepNum]: status }));
    if (errorMsg) {
      setStepErrors(prev => ({ ...prev, [stepNum]: errorMsg }));
    } else {
      setStepErrors(prev => {
        const next = { ...prev };
        delete next[stepNum];
        return next;
      });
    }
  }, []);

  const demoStepsInfo: DemoStepDefinition[] = [
    {
      step: 1,
      title: '1. Hybrid Security Operations Overview',
      subtitle: 'SOC Dashboard & Real-Time Security Posture Metric',
      narration: 'Welcome to the Cisco Hybrid Security Operations Platform. We begin at the SOC Overview displaying our real-time calculated security posture score (95/100), active telemetry, and protected workload status across on-premise subnets and public cloud VPCs.',
      actionLabel: 'Proceed to Hybrid Architecture',
      execute: async () => {
        nextDemoStep();
      }
    },
    {
      step: 2,
      title: '2. Interactive Hybrid Architecture',
      subtitle: 'Zero-Trust Topology from Campus Users to Multi-Cloud VPCs',
      narration: 'This interactive visualizer models the full enterprise topology: Remote/Campus Users → Central IAM/MFA Gateway → Next-Gen Enterprise Firewall → Private Data Center Subnets → AES-256-GCM Encrypted Hybrid Trunk → Public Cloud VPCs.',
      actionLabel: 'Proceed to IAM & RBAC Matrix',
      execute: async () => {
        nextDemoStep();
      }
    },
    {
      step: 3,
      title: '3. Identity & Role-Based Access Control (RBAC)',
      subtitle: 'Least-Privilege Enforcement & MFA Challenges',
      narration: 'We enforce strict least-privilege access using 6 granular enterprise personas (Security Admin, Network Admin, Cloud Admin, Developer, Faculty, Auditor). Notice how Faculty accounts can access teaching portals but are mathematically blocked from database administration.',
      actionLabel: 'Proceed to Network Segmentation',
      execute: async () => {
        nextDemoStep();
      }
    },
    {
      step: 4,
      title: '4. Network Segmentation & CIDR Boundaries',
      subtitle: 'Private DC Subnets (10.10.0.0/16) & Cloud VPCs (10.20.0.0/16)',
      narration: 'Network microsegmentation separates the Private DC (Management, App Segment A, App Segment B, Database Segment) and Public Cloud (VPC 1 Prod Web, VPC 2 Microservices, VPC 3 Analytics). Each segment possesses independent ingress/egress ACLs and emergency isolation triggers.',
      actionLabel: 'Proceed to Security Policy Engine',
      execute: async () => {
        nextDemoStep();
      }
    },
    {
      step: 5,
      title: '5. Stateful Security Policy Engine',
      subtitle: 'Priority-Ordered Firewall & Security Group Rules',
      narration: 'Our stateful rule engine evaluates every packet by priority. Notice Rule #130: DENY App A -> App B, and Rule #140: DENY Public Cloud -> Internal DC DB. All non-matching traffic drops under Cisco implicit Zero-Trust default-deny.',
      actionLabel: 'Select Target Application A',
      execute: async () => {
        nextDemoStep();
      }
    },
    {
      step: 6,
      title: '6. Target Selection: Application A (Academic Portal)',
      subtitle: 'Workload 10.10.10.15 in App Segment A',
      narration: 'We now target Workload-App-A (Academic Portal - 10.10.10.15). In the next step, we will simulate an external adversary exploiting a remote vulnerability on this public-facing endpoint.',
      actionLabel: 'Simulate Initial Breach on App A',
      execute: async () => {
        nextDemoStep();
      }
    },
    {
      step: 7,
      title: '7. Compromise Application A via CVE RCE',
      subtitle: 'Initial Breach Simulation & Foothold',
      narration: 'Application A has been exploited via CVE-2026-RemoteCodeExecution. The workload is flagged as COMPROMISED. Let us now simulate the attacker attempting lateral movement to pivot to adjacent internal systems.',
      actionLabel: 'Launch Lateral Movement Attack',
      execute: async () => {
        // Execute initial breach & attack simulation with robust error handling
        const res = await api.simulateAttack({ scenarioType: 'COMPROMISED_APP' });
        if (res && res.simulation) {
          setLatestAttackResult(res);
        }
        await refreshData().catch(() => {});
        addToast('danger', 'Initial Breach Simulated', 'Workload App A compromised; lateral movement blocked by Policy #130.');
        nextDemoStep();
      }
    },
    {
      step: 8,
      title: '8. Lateral Movement Probe Interception',
      subtitle: 'Adversary Attempts Pivot to Grading Engine (App B)',
      narration: 'The attacker on Application A executes internal network reconnaissance and attempts a TCP SYN connect to Workload-App-B (Grading Engine - 10.10.20.25). The packet reaches the enterprise security gateway.',
      actionLabel: 'Inspect Attack Path & Policy Gate',
      execute: async () => {
        nextDemoStep();
      }
    },
    {
      step: 9,
      title: '9. Attack Path & Policy Inspection',
      subtitle: 'Live Multi-Stage Packet Flow Inspection',
      narration: 'Observing the animated trace: Step 1 (Ingress) succeeded inside the container sandbox, but Step 2 (Lateral Pivot) encountered the stateful policy gate.',
      actionLabel: 'Verify Policy Block Decision',
      execute: async () => {
        nextDemoStep();
      }
    },
    {
      step: 10,
      title: '10. Attack Blocked by Security Policy #130',
      subtitle: 'Lateral Movement Denied & Blast Radius Contained',
      narration: 'The policy engine matched Rule #130: DENY App A -> App B. The packet was immediately dropped, and a TCP RST was dispatched to the attacker. Core Database and adjacent systems remain 100% protected.',
      actionLabel: 'View Generated SOC Incident',
      execute: async () => {
        nextDemoStep();
      }
    },
    {
      step: 11,
      title: '11. Automated SOC Incident Dispatch',
      subtitle: 'Critical Ticket Generated in Incident Center',
      narration: 'The firewall automatically opened Critical Incident Ticket with full packet forensics, source/target IPs, and the matched security rule.',
      actionLabel: 'Quarantine Workload & Contain Incident',
      execute: async () => {
        const incs = await api.getIncidents().catch(() => []);
        if (incs && incs.length > 0) {
          const targetInc = incs.find(i => i.status !== 'CONTAINED' && i.status !== 'RESOLVED') || incs[0];
          await api.updateIncident(targetInc.id, {
            status: 'CONTAINED',
            containmentNotes: 'Workload App A placed in automated sandbox quarantine.',
            resolvedBy: 'secadmin',
            quarantineWorkload: true
          }).catch(err => {
            console.warn('Incident update warning:', err);
          });
        }
        await refreshData().catch(() => {});
        addToast('success', 'Incident Contained', 'Workload quarantined and lateral containment enforced.');
        nextDemoStep();
      }
    },
    {
      step: 12,
      title: '12. Incident Containment & Workload Quarantine',
      subtitle: 'Automated Microsegmentation Quarantine Applied',
      narration: 'The security administrator has placed Application A into emergency sandbox quarantine. Its network interfaces are isolated, completely severing all east-west and north-south communications.',
      actionLabel: 'Verify Recalculated Security Posture',
      execute: async () => {
        nextDemoStep();
      }
    },
    {
      step: 13,
      title: '13. Final Security Posture Verification',
      subtitle: 'Containment Validated • Score Recalculated • Demonstration Complete',
      narration: 'Because the attack was swiftly contained and isolated, the dynamic security score reflects active quarantine defense. The enterprise core network remained entirely resilient against breach propagation. This concludes the demonstration.',
      actionLabel: 'Complete & Exit Guided Demo',
      execute: async () => {
        exitGuidedDemo();
        addToast('success', 'Guided Demo Complete', 'All 13 security workflow stages successfully demonstrated.');
      }
    }
  ];

  const currentStep = demoStepsInfo[demoStep - 1] || demoStepsInfo[0];
  const currentStatus: StepStatus = stepStatuses[demoStep] || 'IDLE';
  const currentError = stepErrors[demoStep];

  // Robust Step Execution Runner
  const handleExecuteStep = async () => {
    if (isExecuting) return; // Prevent double-clicks / race conditions

    setIsExecuting(true);
    setStepState(demoStep, 'EXECUTING');

    try {
      await currentStep.execute();
      if (isMountedRef.current) {
        setStepState(demoStep, 'SUCCESS');
      }
    } catch (err: any) {
      console.error(`Guided Demo Step ${demoStep} Error:`, err);
      if (isMountedRef.current) {
        const message = err.message || 'Operation failed. Please retry.';
        setStepState(demoStep, 'ERROR', message);
        addToast('danger', `Step ${demoStep} Failed`, message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsExecuting(false);
      }
    }
  };

  const renderStepPreview = () => {
    switch (demoStep) {
      case 1: return <DashboardView />;
      case 2: return <ArchitectureView />;
      case 3: return <IamRbacView />;
      case 4: return <SegmentationView />;
      case 5: return <PoliciesView />;
      case 6:
      case 7:
      case 8: return <AttackSimulatorView />;
      case 9:
      case 10: return <AttackPathView />;
      case 11:
      case 12: return <IncidentsView />;
      case 13:
      default: return <SecurityPostureView />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sticky Demo Controller Header */}
      <div className="sticky top-20 z-30 p-5 rounded-xl bg-slate-900/95 border border-sky-500/50 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-700">
                GUIDED DEMO MODE
              </span>
              <span className="text-xs font-mono text-sky-400 font-bold">
                STEP {demoStep} OF 13
              </span>
              {currentStatus === 'ERROR' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> FAILED
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold font-mono text-slate-100">
              {currentStep.title}: {currentStep.subtitle}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed font-sans">
              {currentStep.narration}
            </p>

            {/* Error Message & Retry Alert */}
            {currentError && (
              <div className="mt-2.5 p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-xs font-mono text-rose-300 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Reason: {currentError}</span>
                </div>
                <button
                  onClick={handleExecuteStep}
                  disabled={isExecuting}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isExecuting ? 'animate-spin' : ''}`} />
                  <span>Retry</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={prevDemoStep}
              disabled={demoStep === 1 || isExecuting}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 border border-slate-700"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleExecuteStep}
              disabled={isExecuting}
              className={`px-4 py-2.5 rounded-lg text-white font-mono text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                currentStatus === 'ERROR'
                  ? 'bg-rose-600 hover:bg-rose-500'
                  : 'bg-sky-600 hover:bg-sky-500'
              }`}
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing...</span>
                </>
              ) : currentStatus === 'ERROR' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Step {demoStep}</span>
                </>
              ) : (
                <>
                  <span>{currentStep.actionLabel}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={startGuidedDemo}
              disabled={isExecuting}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700"
              title="Restart Demo from Step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={exitGuidedDemo}
              disabled={isExecuting}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700"
              title="Exit Guided Demo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Ticker */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto pb-1">
          {demoStepsInfo.map((s) => (
            <div
              key={s.step}
              className={`h-1.5 flex-1 min-w-[20px] rounded-full transition-all ${
                s.step === demoStep
                  ? 'bg-sky-400 shadow-sm'
                  : s.step < demoStep
                  ? 'bg-emerald-400'
                  : 'bg-slate-800'
              }`}
              title={`Step ${s.step}: ${s.title}`}
            />
          ))}
        </div>
      </div>

      {/* Embedded Live View Preview */}
      <div className="mt-6">
        {renderStepPreview()}
      </div>
    </div>
  );
};
