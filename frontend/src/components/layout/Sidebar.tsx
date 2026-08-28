import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Network, 
  UserCheck, 
  Grid, 
  FileCheck, 
  Server, 
  Flame, 
  GitFork, 
  AlertOctagon, 
  Activity, 
  History, 
  ShieldAlert, 
  Link2, 
  Lock, 
  Compass,
  Info,
  ChevronRight,
  LucideIcon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: 'danger' | 'rose' | 'info';
  highlight?: boolean;
}

interface NavCategory {
  label: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { activeView, setActiveView, incidents } = useApp();

  const openIncidentsCount = incidents.filter(i => i.status === 'DETECTED').length;

  const navCategories: NavCategory[] = [
    {
      label: 'OPERATIONS & ARCHITECTURE',
      items: [
        { id: 'dashboard', label: 'SOC Overview', icon: LayoutDashboard },
        { id: 'architecture', label: 'Hybrid Architecture', icon: Network, highlight: true },
        { id: 'segmentation', label: 'Network Segmentation', icon: Grid },
        { id: 'workloads', label: 'Workloads & K8s', icon: Server },
        { id: 'hybrid-link', label: 'Hybrid Connectivity', icon: Link2 },
      ]
    },
    {
      label: 'ACCESS & GOVERNANCE',
      items: [
        { id: 'iam', label: 'IAM & RBAC Matrix', icon: UserCheck },
        { id: 'policies', label: 'Security Policy Engine', icon: FileCheck },
        { id: 'zero-trust', label: 'Zero Trust Principles', icon: Lock },
      ]
    },
    {
      label: 'ATTACK & INCIDENT RESPONSE',
      items: [
        { id: 'attack-simulator', label: 'Attack Simulator', icon: Flame, badge: 'CORE DEMO', badgeVariant: 'danger' },
        { id: 'attack-path', label: 'Attack Path Visualizer', icon: GitFork },
        { id: 'incidents', label: 'Incident Center', icon: AlertOctagon, badge: openIncidentsCount > 0 ? `${openIncidentsCount}` : undefined, badgeVariant: 'rose' },
      ]
    },
    {
      label: 'SIEM, AUDIT & SCORE',
      items: [
        { id: 'monitoring', label: 'Security Monitoring', icon: Activity },
        { id: 'audit', label: 'MongoDB Audit Log', icon: History },
        { id: 'posture', label: 'Security Posture (0-100)', icon: ShieldAlert },
        { id: 'guided-demo', label: 'Guided Demo Mode', icon: Compass, badge: '13 STEPS', badgeVariant: 'info' },
      ]
    },
    {
      label: 'PROJECT SPECIFICATIONS',
      items: [
        { id: 'about', label: 'About Project', icon: Info },
      ]
    }
  ];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId as AppView);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-slate-950/95 border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex-1 space-y-5">
          {navCategories.map((cat, idx) => (
            <div key={idx}>
              <p className="text-[10px] font-mono font-semibold text-slate-400 tracking-wider px-3 mb-1.5">
                {cat.label}
              </p>
              <div className="space-y-1">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 shadow-sm shadow-cyan-950/50'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge ? (
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            item.badgeVariant === 'danger'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                              : item.badgeVariant === 'rose'
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : (
                        isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 opacity-60" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Project Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left rounded-lg p-2.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-[11px] font-mono text-slate-400 group"
          >
            <div className="text-slate-200 font-semibold flex items-center justify-between">
              <span>Cisco AICTE VIP 2026</span>
              <Info className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300" />
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Cyber Security Track</div>
          </button>
        </div>
      </aside>
    </>
  );
};
