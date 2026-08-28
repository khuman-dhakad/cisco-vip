import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { Shield, ChevronDown, Check, UserCircle2, Key, Users, BookOpen, FileCode, SearchCheck } from 'lucide-react';

export const QuickRoleSwitcher: React.FC = () => {
  const { user, switchDemoRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const demoRoles: { username: string; label: string; role: Role; desc: string; icon: any }[] = [
    {
      username: 'secadmin',
      label: 'Security Administrator',
      role: 'SECURITY_ADMIN',
      desc: 'Full SOC permissions, firewall rules & containment',
      icon: Shield
    },
    {
      username: 'netadmin',
      label: 'Network Administrator',
      role: 'NETWORK_ADMIN',
      desc: 'Segmentation, hybrid link routing & policy config',
      icon: Key
    },
    {
      username: 'cloudadmin',
      label: 'Cloud Administrator',
      role: 'CLOUD_ADMIN',
      desc: 'VPC management, cloud security groups & workloads',
      icon: Users
    },
    {
      username: 'developer',
      label: 'Application Developer',
      role: 'DEVELOPER',
      desc: 'Application deployment & telemetry (Least Privilege)',
      icon: FileCode
    },
    {
      username: 'faculty',
      label: 'Faculty User (LNCT)',
      role: 'FACULTY',
      desc: 'Teaching applications only; restricted from DB/Admin',
      icon: BookOpen
    },
    {
      username: 'auditor',
      label: 'Compliance Auditor',
      role: 'AUDITOR',
      desc: 'Read-only access to audit logs & posture reports',
      icon: SearchCheck
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = async (username: string) => {
    await switchDemoRole(username);
    setIsOpen(false);
  };

  const currentRoleInfo = demoRoles.find(r => r.role === user?.role) || demoRoles[0];
  const CurrentIcon = currentRoleInfo.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-mono text-slate-200 transition-all shadow-sm"
        title="Switch Active RBAC Role for Demonstration"
      >
        <CurrentIcon className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline font-medium">{currentRoleInfo.label}</span>
        <span className="sm:hidden font-medium">{user?.role}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <UserCircle2 className="w-3.5 h-3.5" />
              RBAC Demo Role Switcher
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Instantly simulate different enterprise personas
            </p>
          </div>
          <div className="p-1.5 space-y-1">
            {demoRoles.map((r) => {
              const Icon = r.icon;
              const isSelected = user?.role === r.role;
              return (
                <button
                  key={r.username}
                  onClick={() => handleSelectRole(r.username)}
                  className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-800/50'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-100">{r.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
