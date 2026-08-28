import React from 'react';
import { useApp } from '../../context/AppContext';
import { QuickRoleSwitcher } from './QuickRoleSwitcher';
import { NotificationDropdown } from './NotificationDropdown';
import {
  ShieldCheck,
  Play,
  Activity,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { 
    activeView, 
    setActiveView, 
    securityPosture, 
    startGuidedDemo, 
    isDemoActive,
    hybridLink 
  } = useApp();

  const score = securityPosture?.score ?? 95;
  const grade = securityPosture?.grade ?? 'A+';

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left: Product Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg lg:hidden"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-emerald-400 flex items-center justify-center shadow-cyber-cyan ring-1 ring-white/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-wide bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent font-mono">
                  CISCO HYBRID SECOPS
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800/60 rounded">
                  ZERO TRUST
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono hidden md:block">
                Security Operations Center • <span className="text-emerald-400">System Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Controls & Quick Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Security Posture Live Pill */}
          <button
            onClick={() => setActiveView('posture')}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all shadow-sm ${
              score >= 80 
                ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300 hover:border-emerald-400/60'
                : score >= 60
                ? 'bg-amber-950/50 border-amber-500/30 text-amber-300 hover:border-amber-400/60'
                : 'bg-rose-950/50 border-rose-500/30 text-rose-300 hover:border-rose-400/60'
            }`}
            title="Calculated Security Posture Score"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>POSTURE:</span>
            <span className="font-bold">{score}/100</span>
            <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px]">{grade}</span>
          </button>

          {/* Hybrid Link Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className={`w-2 h-2 rounded-full ${hybridLink?.status === 'SECURE' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span>HYBRID TRUNK:</span>
            <span className={`font-semibold ${hybridLink?.status === 'SECURE' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {hybridLink?.status || 'SECURE'}
            </span>
          </div>

          {/* Guided Demo Button */}
          <button
            onClick={startGuidedDemo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all shadow-cyber-cyan ${
              isDemoActive
                ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300'
                : 'bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Guided Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* Quick RBAC Role Switcher */}
          <QuickRoleSwitcher />

          {/* Notification Alerts */}
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
};
