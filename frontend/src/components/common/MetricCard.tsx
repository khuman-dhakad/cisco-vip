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
      border: 'border-sky-500/20 hover:border-sky-500/40',
      iconBg: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
      glow: 'hover:shadow-soc-glow-sky',
      line: 'from-sky-500/60 via-sky-400/40 to-transparent',
      text: 'text-sky-400',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      glow: 'hover:shadow-soc-glow-emerald',
      line: 'from-emerald-500/60 via-emerald-400/40 to-transparent',
      text: 'text-emerald-400',
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      glow: 'hover:shadow-soc-glow-rose',
      line: 'from-rose-500/60 via-rose-400/40 to-transparent',
      text: 'text-rose-400',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      glow: 'hover:shadow-soc-glow-amber',
      line: 'from-amber-500/60 via-amber-400/40 to-transparent',
      text: 'text-amber-400',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      glow: 'hover:shadow-soc-md',
      line: 'from-purple-500/60 via-purple-400/40 to-transparent',
      text: 'text-purple-400',
    },
    cisco: {
      border: 'border-sky-500/20 hover:border-sky-500/40',
      iconBg: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
      glow: 'hover:shadow-soc-glow-sky',
      line: 'from-sky-500/60 via-sky-400/40 to-transparent',
      text: 'text-sky-400',
    },
  };

  const current = colorMap[variant] || colorMap.cyan;

  return (
    <div
      className={`group relative bg-slate-900/80 backdrop-blur-md rounded-xl p-5 border ${current.border} transition-all duration-200 shadow-sm ${current.glow} overflow-hidden`}
    >
      {/* Subtle top accent line */}
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${current.line}`} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-mono font-medium text-slate-400 tracking-wider uppercase truncate">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2.5 flex-wrap">
            <h3 className="text-2xl lg:text-3xl font-bold font-mono text-slate-100 tracking-tight">
              {value}
            </h3>
            {trend && (
              <span
                className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                  trendPositive
                    ? 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30'
                    : 'text-rose-400 bg-rose-950/50 border-rose-500/30'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 truncate">{subtitle}</p>
          )}
        </div>

        <div className={`p-2.5 rounded-lg ${current.iconBg} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
