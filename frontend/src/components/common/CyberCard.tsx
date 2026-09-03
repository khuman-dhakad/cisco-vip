import React from 'react';

interface CyberCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerIcon?: React.ReactNode;
  badge?: React.ReactNode;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  headerIcon,
  badge,
}) => {
  return (
    <div className={`cyber-panel p-5 bg-slate-900/80 backdrop-blur-md border border-slate-800/90 rounded-xl relative overflow-hidden transition-all duration-200 shadow-sm hover:border-slate-700/80 ${className}`}>
      {/* Top subtle highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />

      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {headerIcon && <div className="text-sky-400 shrink-0">{headerIcon}</div>}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-slate-100 text-sm md:text-base tracking-tight truncate">
                  {title}
                </h4>
                {badge}
              </div>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
