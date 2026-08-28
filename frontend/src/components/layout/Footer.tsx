import React from 'react';
import { ShieldCheck, Cpu, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-4 px-6 text-xs text-slate-400 font-mono flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>Secure Hybrid Data Center Network Security & Attack Containment Platform</span>
      </div>
      <div className="flex items-center gap-4 text-[11px]">
        <span className="text-slate-300 font-semibold">Student: KHUMAN DHAKAD</span>
        <span className="text-slate-500">•</span>
        <span>LNCT Bhopal</span>
        <span className="text-slate-500">•</span>
        <span className="text-cyan-400 flex items-center gap-1">
          <Terminal className="w-3.5 h-3.5" /> Cisco Virtual Internship 2026
        </span>
      </div>
    </footer>
  );
};
