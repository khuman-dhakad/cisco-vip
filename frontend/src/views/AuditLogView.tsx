import React, { useState, useEffect } from 'react';
import { SecurityEvent } from '../types';
import { api } from '../services/api';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { History, Search, Download, Terminal, CheckCircle2, Shield } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<SecurityEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const data = await api.getEvents();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l => 
    l.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.source && l.source.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cisco_vip_security_audit_log_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-sky-400" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-100 tracking-tight">
              MongoDB Persistent Security Audit Trail
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Immutable Audit Records • User Actions • Policy State Modifications • Attack Telemetry Logs
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportJson}
            className="px-4 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 text-slate-200 font-mono text-xs font-semibold transition-all border border-slate-700 shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit JSON</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table Card */}
      <CyberCard
        title={`Audit Trail (${filteredLogs.length} Records)`}
        subtitle="Cryptographically timestamped MongoDB events"
        headerIcon={<Shield className="w-4 h-4 text-cyan-400" />}
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400 font-mono w-48 sm:w-64"
              />
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">TIMESTAMP</th>
                <th className="pb-3">ACTOR</th>
                <th className="pb-3">ACTION</th>
                <th className="pb-3">TARGET</th>
                <th className="pb-3">RESULT</th>
                <th className="pb-3">EVENT DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 font-bold text-cyan-300">{log.actor}</td>
                  <td className="py-3 text-slate-200">{log.action}</td>
                  <td className="py-3 text-slate-300 truncate max-w-[150px]">{log.target || log.source}</td>
                  <td className="py-3">
                    <Badge variant={log.result === 'SUCCESS' || log.result === 'CREATED' ? 'success' : log.result === 'BLOCKED' ? 'danger' : 'warning'}>
                      {log.result}
                    </Badge>
                  </td>
                  <td className="py-3 text-slate-400 truncate max-w-sm">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CyberCard>
    </div>
  );
};
