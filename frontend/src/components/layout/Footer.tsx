import React from 'react';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950/90 border-t border-slate-800/80 py-3.5 px-6 text-xs text-slate-400 font-mono flex flex-col md:flex-row items-center justify-between gap-2.5">
      <div className="flex items-center gap-2 text-[11px] text-slate-300">
        <ShieldCheck className="w-4 h-4 text-sky-400" />
        <span>Secure Hybrid Data Center Network Security & Attack Containment Platform</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px]">
        <span className="text-slate-300 font-medium flex items-center gap-1">
          Built with <Heart className="w-3 h-3 text-rose-500 fill-current inline" /> by{' '}
          <a
            href="https://www.linkedin.com/in/khuman-dhakad/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Khuman Dhakad on LinkedIn (opens in a new tab)"
            className="text-slate-200 hover:text-sky-400 underline decoration-slate-600 hover:decoration-sky-400 underline-offset-4 transition-colors font-semibold inline-flex items-center gap-0.5 focus-visible:ring-1 focus-visible:ring-sky-400 rounded-sm"
          >
            <span>Khuman Dhakad</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
          </a>
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="text-slate-400">Lakshmi Narain College of Technology (LNCT), Bhopal</span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="text-sky-400 font-medium">Cisco AICTE VIP 2026 • Cyber Security</span>
      </div>
    </footer>
  );
};
