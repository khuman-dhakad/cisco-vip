import React, { useState } from 'react';
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
  Compass,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const GuidedDemoView: React.FC = () => {
  const { 
    demoStep, 
    nextDemoStep, 
    prevDemoStep, 
    exitGuidedDemo, 
    setLatestAttackResult,
    refreshData,
    addToast
  } = useApp();

  const [isRunningAction, setIsRunningAction] = useState(false);

  const demoStepsInfo = [
    {
      step: 1,
      title: '1. Hybrid Security Operations Overview',
      subtitle: 'SOC Dashboard & Real-Time Security Posture Metric',
      narration: 'Welcome to the Cisco AICTE 2026 Hybrid Security Operations Platform built by Khuman Dhakad (LNCT Bhopal). We begin at the SOC Overview displaying our real-time calculated security posture score (95/100), active telemetry, and protected application status across both on-premise and public cloud environments.',
      actionLabel: 'Proceed to Hybrid Architecture',
      actionFn: async () => nextDemoStep()
    },
    {
      step: 2,
      title: '2. Interactive Hybrid Architecture',
      subtitle: 'Zero-Trust Topology from Campus Users to Multi-Cloud VPCs',
      narration: 'This interactive visualizer models the full enterprise topology: Remote/Campus Users → Central IAM/MFA Gateway → Next-Gen Enterprise Firewall → Private Data Center Subnets → AES-256-GCM Encrypted Hybrid Trunk → Public Cloud VPCs.',
      actionLabel: 'Proceed to IAM & RBAC Matrix',
      actionFn: async () => nextDemoStep()
    },
    {
      step: 3,
      title: '3. Identity & Role-Based Access Control (RBAC)',
      subtitle: 'Least-Privilege Enforcement & MFA Challenges',
      narration: 'We enforce strict least-privilege access using 6 granular enterprise personas (Security Admin, Network Admin, Cloud Admin, Developer, Faculty, Auditor). Notice how Faculty accounts can access teaching portals but are mathematically blocked from database administration.',
      actionLabel: 'Proceed to Network Segmentation',
      actionFn: async () => nextDemoStep()
    },
    {
      step: 4,
      title: '4. Network Segmentation & CIDR Boundaries',
      subtitle: 'Private DC Subnets (10.10.0.0/16) & Cloud VPCs (10.20.0.0/16)',
      narration: 'Network microsegmentation separates the Private DC (Management, App Segment A, App Segment B, Database Segment) and Public Cloud (VPC 1 Prod Web, VPC 2 Microservices, VPC 3 Analytics). Each segment possesses independent ingress/egress ACLs and emergency isolation triggers.',
      actionLabel: 'Proceed to Security Policy Engine',
      actionFn: async () => nextDemoStep()
    },
    {
      step: 5,
      title: '5. Stateful Security Policy Engine',
      subtitle: 'Priority-Ordered Firewall & Security Group Rules',
      narration: 'Our stateful rule engine evaluates every packet by priority. Notice Rule #130: DENY App A -> App B, and Rule #140: DENY Public Cloud -> Internal DC DB. All non-matching traffic drops under Cisco implicit Zero-Trust default-deny.',
      actionLabel: 'Select Application A',
      actionFn: async () => nextDemoStep()
    },
    {
      step: 6,
      title: '6. Target Selection: Application A (Academic Portal)',
      subtitle: 'Workload 10.10.10.15 in App Segment A',
      narration: 'We now target Workload-App-A (Academic Portal - 10.10.10.15). In the next step, we will simulate an external adversary exploiting a remote vulnerability on this public-facing endpoint.',
      actionLabel: 'Simulate CVE Exploitation on App A',
      actionFn: async () => nextDemoStep()
    },
    {
      step: 7,
      title: '7. Compromise Application A via CVE RCE',
      subtitle: 'Initial Breach Simulation & Foothold',
      narration: 'Application A has been exploited via CVE-2026-RemoteCodeExecution. The workload is flagged as COMPROMISED. Let us now simulate the attacker attempting lateral movement to pivot to adjacent internal systems.',
      actionLabel: 'Launch Lateral Movement Attack',
      actionFn: async () => {
        setIsRunningAction(true);
        try {
          const res = await api.simulateAttack({ scenarioType: 'COMPROMISED_APP' });
          setLatestAttackResult(res);
          await refreshData();
          addToast('danger', 'Attack Executed', 'Lateral movement probe blocked by Policy #130.');
          nextDemoStep();
        } finally {
          setIsRunningAction(false);
        }
      }
    },
    {
      step: 8,
      title: '8. Lateral Movement Probe Interception',
      subtitle: 'Adversary Attempts Pivot to Grading Engine (App B)',
      narration: 'The attacker on Application A executes internal network reconnaissance and attempts a TCP SYN connect to Workload-App-B (Grading Engine - 10.10.20.25). The packet reaches the enterprise security gateway.',
      actionLabel: 'Inspect Attack Path',
      actionFn: async () => nextDemoStep()
    },
    {
      step: 9,
      title: '9. Attack Path & Policy Inspection',
      subtitle: 'Live Multi-Stage Packet Flow Inspection',
      narration: 'Observing the animated trace: Step 1 (Ingress) succeeded inside the container sandbox, but Step 2 (Lateral Pivot) encountered the stateful policy gate.',
      actionLabel: 'Verify Policy Block Decision',
      actionFn: async () => nextDemoStep()
    },
    {
      step: 10,
      title: '10. Attack Blocked by Security Policy #130',
      subtitle: 'Lateral Movement Denied & Blast Radius Contained',
      narration: 'The policy engine matched Rule #130: DENY App A -> App B. The packet was immediately dropped, and a TCP RST was dispatched to the attacker. Core Database and adjacent systems remain 100% protected.',
      actionLabel: 'View Generated SOC Incident',
      actionFn: async () => nextDemoStep()
    },
    {
      step: 11,
      title: '11. Automated SOC Incident Dispatch',
      subtitle: 'Critical Ticket Generated in Incident Center',
      narration: 'The firewall automatically opened Critical Incident Ticket with full packet forensics, source/target IPs, and the matched security rule.',
      actionLabel: 'Quarantine Workload & Contain Incident',
      actionFn: async () => {
        setIsRunningAction(true);
        try {
          const incs = await api.getIncidents();
          if (incs.length > 0) {
            await api.updateIncident(incs[0].id, {
              status: 'CONTAINED',
              containmentNotes: 'Workload App A quarantined in automated sandbox.',
              resolvedBy: 'secadmin',
              quarantineWorkload: true
            });
          }
          await refreshData();
          addToast('success', 'Incident Contained', 'Workload quarantined and incident contained.');
          nextDemoStep();
        } finally {
          setIsRunningAction(false);
        }
      }
    },
    {
      step: 12,
      title: '12. Incident Containment & Workload Quarantine',
      subtitle: 'Automated Microsegmentation Quarantine Applied',
      narration: 'The security administrator has placed Application A into emergency sandbox quarantine. Its network interfaces are isolated, completely severing all east-west and north-south communications.',
      actionLabel: 'Verify Final Security Posture',
      actionFn: async () => nextDemoStep()
    },
    {
      step: 13,
      title: '13. Final Security Posture Verification',
      subtitle: 'Containment Validated • Score Recalculated • Demonstration Complete',
      narration: 'Because the attack was swiftly contained and isolated, the dynamic security score reflects active quarantine defense. The enterprise core network remained entirely resilient against breach propagation. This concludes the demonstration.',
      actionLabel: 'Complete & Exit Guided Demo',
      actionFn: async () => exitGuidedDemo()
    }
  ];

  const currentStep = demoStepsInfo[demoStep - 1] || demoStepsInfo[0];

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
      <div className="sticky top-20 z-30 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border border-cyan-500/50 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-900 text-cyan-300 border border-cyan-700">
                GUIDED DEMO MODE
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                STEP {demoStep} OF 13
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-mono text-slate-100">
              {currentStep.title}: {currentStep.subtitle}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {currentStep.narration}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={prevDemoStep}
              disabled={demoStep === 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={currentStep.actionFn}
              disabled={isRunningAction}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-cyber-cyan flex items-center gap-2"
            >
              <span>{isRunningAction ? 'Executing...' : currentStep.actionLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={exitGuidedDemo}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700"
              title="Exit Guided Demo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Ticker */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1">
          {demoStepsInfo.map((s) => (
            <div
              key={s.step}
              className={`h-1.5 flex-1 min-w-[20px] rounded-full transition-all ${
                s.step === demoStep
                  ? 'bg-cyan-400 shadow-cyber-cyan'
                  : s.step < demoStep
                  ? 'bg-emerald-400'
                  : 'bg-slate-800'
              }`}
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
