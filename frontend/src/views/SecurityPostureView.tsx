import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SecurityPosture, PostureFactor } from '../types';
import { api } from '../services/api';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export const SecurityPostureView: React.FC = () => {
  const { securityPosture: globalPosture, refreshData } = useApp();
  const [posture, setPosture] = useState<SecurityPosture | null>(globalPosture);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosture = async () => {
    try {
      setIsLoading(true);
      const data = await api.getSecurityPosture();
      setPosture(data);
    } catch (err) {
      console.error('Failed to fetch security posture:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosture();
  }, [globalPosture]);

  const score = posture?.score ?? 95;
  const grade = posture?.grade ?? 'A+';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-sky-400" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-100 tracking-tight">
              Enterprise Security Posture & Dynamic Risk Index
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Real-Time Mathematical Posture Score (0-100) Computed From Active IAM, Microsegmentation, Firewall Health & Incident Backlog
          </p>
        </div>
      </div>

      {/* Main Score Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Dial / Banner */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/30 border border-slate-800/90 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">
              OVERALL POSTURE SCORE
            </span>
            <div className="text-6xl sm:text-7xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-tr from-sky-400 via-emerald-400 to-white">
              {score}
              <span className="text-2xl text-slate-500 font-normal">/100</span>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> GRADE {grade} • ZERO TRUST ACTIVE
            </div>
            <p className="text-xs text-slate-300 mt-4 leading-relaxed max-w-sm font-sans">
              {posture?.statusSummary}
            </p>
          </div>
        </div>

        {/* Categories Scoring Breakdown */}
        <CyberCard
          title="Posture Dimension Scores"
          subtitle="Real-time weights from current system configuration"
          className="lg:col-span-2"
          headerIcon={<Layers className="w-4 h-4 text-cyan-400" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {Object.entries(posture?.categoryScores || {
              IAM_MFA: 95,
              MICROSEGMENTATION: 90,
              FIREWALL_HEALTH: 92,
              WORKLOAD_HYGIENE: 90,
              HYBRID_LINK_INTEGRITY: 95,
              INCIDENT_IMPACT: 100
            }).map(([cat, val], idx) => {
              const numericVal = typeof val === 'number' ? val : 90;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold">{cat.replace(/_/g, ' ')}</span>
                    <span className="text-cyan-400 font-bold">{numericVal}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${numericVal}%`,
                        backgroundColor: numericVal >= 80 ? '#10b981' : numericVal >= 60 ? '#f59e0b' : '#f43f5e'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CyberCard>
      </div>

      {/* Why the Score Changed: Positive & Negative Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive Factors */}
        <CyberCard
          title="Positive Posture Drivers"
          subtitle="Architectural strengths elevating the score"
          headerIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        >
          <div className="space-y-3 font-mono text-xs">
            {(posture?.positiveFactors || []).map((f: PostureFactor, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-1">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>{f.name}</span>
                  <Badge variant="success">+{f.impact} PTS</Badge>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </CyberCard>

        {/* Negative Factors / Vulnerabilities */}
        <CyberCard
          title="Risk & Penalty Factors"
          subtitle="Active compromises, open incidents, or configuration gaps"
          headerIcon={<AlertTriangle className="w-4 h-4 text-rose-400" />}
        >
          <div className="space-y-3 font-mono text-xs">
            {posture?.negativeFactors && posture.negativeFactors.length > 0 ? (
              posture.negativeFactors.map((f: PostureFactor, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-1">
                  <div className="flex items-center justify-between text-rose-300 font-bold">
                    <span>{f.name}</span>
                    <Badge variant="danger">{f.impact} PTS</Badge>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{f.description}</p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                Zero active risk penalties detected.
              </div>
            )}
          </div>
        </CyberCard>
      </div>

      {/* Actionable Recommendations */}
      <CyberCard
        title="Automated SOC Security Recommendations"
        subtitle="Prioritized recommendations to achieve maximum resilience"
        headerIcon={<Info className="w-4 h-4 text-cyan-400" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          {(posture?.recommendations || [
            'Maintain zero-trust default-deny boundaries across all hybrid subnets.',
            'Ensure all Faculty and Developer personas maintain active MFA challenges.',
            'Periodically simulate red-team attack scenarios to validate containment rules.'
          ]).map((rec: string, i: number) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <span className="text-cyan-400 font-bold shrink-0">•</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </CyberCard>
    </div>
  );
};
