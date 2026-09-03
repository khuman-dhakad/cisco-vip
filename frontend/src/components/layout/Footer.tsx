import React from 'react';
import { ShieldCheck, Heart, ExternalLink, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-md py-4 px-6 text-xs text-slate-400 font-mono">
      {/* Subtle glowing top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Platform Identity & Cryptographic Badge */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-200 font-medium">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Secure Hybrid Data Center Network Security & Attack Containment Platform</span>
          </div>
          <span className="hidden sm:inline text-slate-700">•</span>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>AES-256-GCM / MACsec</span>
          </div>
        </div>

        {/* Right: Author Attribution, Institution & Program */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-2.5 text-[11px]">
          <span className="text-slate-300 font-medium inline-flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-current inline mx-0.5" />
            <span>by</span>
            <a
              href="https://www.linkedin.com/in/khuman-dhakad/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Khuman Dhakad on LinkedIn (opens in a new tab)"
              className="px-2 py-0.5 rounded bg-sky-950/60 hover:bg-sky-900/70 border border-sky-800/50 hover:border-sky-700 text-sky-300 hover:text-sky-200 transition-all font-semibold inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-sky-400 shadow-xs"
            >
              <span>Khuman Dhakad</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          </span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="text-slate-400">Lakshmi Narain College of Technology (LNCT), Bhopal</span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800/80 text-sky-400 font-medium text-[10px]">
            Cisco AICTE VIP 2026 • Cyber Security
          </span>
          <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SOC ONLINE
          </span>
        </div>
      </div>
    </footer>
  );
};
