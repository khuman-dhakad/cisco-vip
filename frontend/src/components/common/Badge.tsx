import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'neutral' | 'cisco';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  size = 'sm',
  pulse = false 
}) => {
  const variantStyles = {
    success: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
    danger: 'bg-rose-950/60 text-rose-400 border-rose-500/30',
    warning: 'bg-amber-950/60 text-amber-400 border-amber-500/30',
    info: 'bg-sky-950/60 text-sky-400 border-sky-500/30',
    purple: 'bg-purple-950/60 text-purple-400 border-purple-500/30',
    cisco: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30',
    neutral: 'bg-slate-800/60 text-slate-300 border-slate-700/50',
  };

  const sizeStyles = {
    sm: 'text-[11px] font-mono px-2 py-0.5 rounded',
    md: 'text-xs font-mono font-medium px-2.5 py-1 rounded-md',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-mono ${variantStyles[variant]} ${sizeStyles[size]} tracking-tight shrink-0 shadow-xs`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
        </span>
      )}
      {children}
    </span>
  );
};
