import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'cyan' | 'emerald' | 'rose' | 'amber' | 'purple' | 'cisco';
  trend?: string;
  trendPositive?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'cyan',
  trend,
  trendPositive = true,
}) => {
  const colorMap = {
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/50',
      iconBg: 'bg-cyan-500/10 text-cyan-400',
      glow: 'group-hover:shadow-cyber-cyan',
      text: 'text-cyan-400',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      glow: 'group-hover:shadow-cyber-emerald',
      text: 'text-emerald-400',
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/50',
      iconBg: 'bg-rose-500/10 text-rose-400',
      glow: 'group-hover:shadow-cyber-rose',
      text: 'text-rose-400',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/50',
      iconBg: 'bg-amber-500/10 text-amber-400',
      glow: 'group-hover:shadow-cyber-amber',
      text: 'text-amber-400',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/50',
      iconBg: 'bg-purple-500/10 text-purple-400',
      glow: 'group-hover:shadow-cyber-cyan',
      text: 'text-purple-400',
    },
    cisco: {
      border: 'border-sky-500/20 hover:border-sky-500/50',
      iconBg: 'bg-sky-500/10 text-sky-400',
      glow: 'group-hover:shadow-cyber-cyan',
      text: 'text-sky-400',
    },
  };

  const current = colorMap[variant];

  return (
    <div
      className={`group relative bg-slate-900/80 backdrop-blur-md rounded-xl p-5 border ${current.border} transition-all duration-300 ${current.glow} overflow-hidden`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wider uppercase">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-bold font-mono text-slate-100">{value}</h3>
            {trend && (
              <span
                className={`text-xs font-mono font-medium ${
                  trendPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${current.iconBg} ring-1 ring-white/5`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-slate-700/40 to-transparent group-hover:via-cyan-500/50 transition-all duration-300" />
    </div>
  );
};
