import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Info, X } from 'lucide-react';

export const NotificationDropdown: React.FC = () => {
  const { toasts, removeToast, incidents, setActiveView } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const openIncidentsCount = incidents.filter(i => i.status === 'DETECTED').length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-slate-300 transition-colors shadow-xs"
        aria-label="Security alerts and notifications"
      >
        <Bell className="w-4 h-4" />
        {openIncidentsCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-soc-glow-rose animate-pulse">
            {openIncidentsCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900/98 border border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider font-mono">
                Active Security Alerts ({incidents.length})
              </h4>
            </div>
            <button
              onClick={() => {
                setActiveView('incidents');
                setIsOpen(false);
              }}
              className="text-[11px] text-sky-400 hover:text-sky-300 hover:underline font-mono transition-colors"
            >
              View Queue
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/60">
            {incidents.length === 0 && toasts.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400 opacity-60" />
                No active threats. Perimeter is secure.
              </div>
            ) : (
              <>
                {incidents.slice(0, 4).map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => {
                      setActiveView('incidents');
                      setIsOpen(false);
                    }}
                    className="p-2.5 hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${inc.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            inc.severity === 'CRITICAL'
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                              : 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                          }`}>
                            {inc.severity}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-200 mt-1 truncate">{inc.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono truncate">
                          {inc.sourceWorkload || inc.sourceIp} → {inc.targetWorkload || inc.targetIp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
