import React from 'react';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { 
  ShieldCheck, 
  Info, 
  Layers, 
  Cpu, 
  Server, 
  Lock, 
  Terminal, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink,
  Code,
  Heart
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800/90 shadow-sm backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950/80 text-sky-400 border border-sky-800/60 shadow-xs">
                PROJECT INFORMATION
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 shadow-xs">
                CISCO AICTE VIP 2026
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 tracking-tight">
              About the Cybersecurity Platform
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-sans">
              Architecture specifications, Zero-Trust compliance standards, and project ownership details.
            </p>
          </div>
        </div>
      </div>

      {/* Project Ownership & Attribution Card */}
      <CyberCard
        title="Project & Developer Information"
        subtitle="Official submission details for the Cisco AICTE Virtual Internship Program"
        headerIcon={<Award className="w-4 h-4 text-cyan-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">PROJECT TITLE</span>
              <span className="text-slate-100 font-bold text-sm">
                Secure Hybrid Data Center Network Security & Attack Containment Platform
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">DEVELOPED BY</span>
              <span className="text-cyan-400 font-bold text-sm">Khuman Dhakad</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">INSTITUTION</span>
              <span className="text-slate-200">Lakshmi Narain College of Technology (LNCT), Bhopal</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">PROGRAM</span>
              <span className="text-slate-200 font-bold">Cisco AICTE Virtual Internship Program 2026</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">SPECIALIZATION TRACK</span>
              <span className="text-emerald-400 font-bold">Cyber Security</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">ARCHITECTURE GROUNDING</span>
              <span className="text-slate-300">NIST SP 800-207 Zero Trust & Cisco SAFE Security Reference Architecture</span>
            </div>
          </div>
        </div>
      </CyberCard>

      {/* Platform Capabilities & Architectural Scope */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <Server className="w-4 h-4" />
            <span>Hybrid Microsegmentation</span>
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Partitions on-premise private subnets (10.10.0.0/16) and public cloud VPCs (10.20.0.0/16) to constrain breach blast radiuses.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Lock className="w-4 h-4" />
            <span>Stateful Policy Engine</span>
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Evaluates Layer 3–7 traffic with priority matching, enforcing an implicit Zero-Trust default-deny perimeter.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Automated Containment</span>
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Detects multi-stage attack vectors, opens SOC forensic tickets, and isolates compromised workloads in 1 click.
          </p>
        </div>
      </div>

      {/* Technology Implementation Scope */}
      <CyberCard
        title="Engineering & Technology Implementation"
        subtitle="Software stack and architectural delivery model"
        headerIcon={<Code className="w-4 h-4 text-cyan-400" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">BACKEND ENGINE</span>
            <span className="text-slate-200 font-bold">Java 21 • Spring Boot 3.3</span>
            <p className="text-[11px] text-slate-400 mt-1">REST APIs, Spring Security 6, JWT, and Policy Engine.</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">DATA PERSISTENCE</span>
            <span className="text-slate-200 font-bold">MongoDB 8.2</span>
            <p className="text-[11px] text-slate-400 mt-1">Document store for policies, SIEM telemetry, and incident tickets.</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">FRONTEND SOC UI</span>
            <span className="text-slate-200 font-bold">React 18 • TypeScript</span>
            <p className="text-[11px] text-slate-400 mt-1">Vite, Tailwind CSS, Lucide Icons, and Recharts analytics.</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">QUALITY & TESTS</span>
            <span className="text-slate-200 font-bold">JUnit 5 • Surefire</span>
            <p className="text-[11px] text-slate-400 mt-1">Automated unit and integration test verification suite.</p>
          </div>
        </div>
      </CyberCard>
    </div>
  );
};
