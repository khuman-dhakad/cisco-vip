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
    <div className={`cyber-panel p-5 bg-slate-900/90 border border-slate-800 rounded-xl relative overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-2">
          <div className="flex items-center gap-3">
            {headerIcon && <div className="text-cyan-400">{headerIcon}</div>}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-100 text-sm md:text-base tracking-wide">{title}</h4>
                {badge}
              </div>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
