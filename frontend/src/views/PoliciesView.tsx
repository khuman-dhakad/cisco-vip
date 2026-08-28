import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SecurityPolicy, PolicyEvaluationRecord } from '../types';
import { api } from '../services/api';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { 
  FileCheck, 
  ShieldCheck, 
  ShieldAlert, 
  Play, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Filter, 
  Layers,
  ArrowRight
} from 'lucide-react';

export const PoliciesView: React.FC = () => {
  const { policies: globalPolicies, addToast } = useApp() as any;
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterScope, setFilterScope] = useState<string>('ALL');

  // Policy Evaluation Tester State
  const [testSource, setTestSource] = useState('WORKLOAD:APP_A');
  const [testDestination, setTestDestination] = useState('WORKLOAD:APP_B');
  const [testProtocol, setTestProtocol] = useState('TCP');
  const [testPort, setTestPort] = useState('8080');
  const [testRole, setTestRole] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<{
    verdict: string;
    allowed: boolean;
    matchedPolicyId: string;
    matchedPolicyName: string;
    matchedRuleSummary: string;
    reason: string;
    evaluationChain: PolicyEvaluationRecord[];
  } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // New Policy Form
  const [newPolicy, setNewPolicy] = useState<Partial<SecurityPolicy>>({
    name: '',
    source: '',
    destination: '',
    protocol: 'TCP',
    port: '443',
    action: 'DENY',
    priority: 150,
    description: '',
    enabled: true,
    scope: 'PRIVATE_DC',
    ruleCategory: 'ZERO_TRUST'
  });

  const fetchPolicies = async () => {
    try {
      setIsLoading(true);
      const data = await api.getPolicies();
      setPolicies(data);
    } catch (err) {
      console.error('Failed to fetch policies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createPolicy(newPolicy);
      setPolicies(prev => [...prev, created].sort((a, b) => a.priority - b.priority));
      setShowCreateModal(false);
      addToast('success', 'Policy Created', `Policy #${created.priority} [${created.name}] added.`);
      setNewPolicy({
        name: '',
        source: '',
        destination: '',
        protocol: 'TCP',
        port: '443',
        action: 'DENY',
        priority: 150,
        description: '',
        enabled: true,
        scope: 'PRIVATE_DC',
        ruleCategory: 'ZERO_TRUST'
      });
    } catch (err: any) {
      addToast('danger', 'Creation Failed', err.message || 'Error creating policy');
    }
  };

  const handleDeletePolicy = async (id: string) => {
    try {
      await api.deletePolicy(id);
      setPolicies(prev => prev.filter(p => p.id !== id));
      addToast('info', 'Policy Deleted', 'Security policy removed from active rulebase.');
    } catch (err: any) {
      addToast('danger', 'Delete Failed', err.message || 'Could not delete policy');
    }
  };

  const handleRunEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsEvaluating(true);
      const res = await api.evaluateTraffic({
        source: testSource,
        destination: testDestination,
        protocol: testProtocol,
        port: testPort,
        role: testRole
      });
      setEvaluationResult(res);
      addToast(
        res.allowed ? 'success' : 'warning',
        `Traffic Evaluation: ${res.verdict}`,
        `Evaluated traffic: ${res.verdict} by ${res.matchedPolicyName}`
      );
    } catch (err: any) {
      addToast('danger', 'Evaluation Error', err.message || 'Error during policy evaluation');
    } finally {
      setIsEvaluating(false);
    }
  };

  const filteredPolicies = filterScope === 'ALL'
    ? policies
    : policies.filter(p => p.scope === filterScope);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-100">
              Stateful Firewall & Security Policy Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Priority-Based Evaluation • CIDR & Workload Tagging • Implicit Zero-Trust Default Deny Boundary
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold transition-all shadow-cyber-cyan flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Security Policy</span>
          </button>
        </div>
      </div>

      {/* Interactive Policy Evaluation Tester Tool */}
      <CyberCard
        title="Live Traffic & Packet Policy Evaluation Tester"
        subtitle="Test any source, target, protocol, and port against the active priority rule engine"
        headerIcon={<Terminal className="w-4 h-4 text-cyan-400" />}
      >
        <form onSubmit={handleRunEvaluation} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">SOURCE</label>
              <input
                type="text"
                required
                value={testSource}
                onChange={(e) => setTestSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                placeholder="e.g. WORKLOAD:APP_A"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">DESTINATION</label>
              <input
                type="text"
                required
                value={testDestination}
                onChange={(e) => setTestDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                placeholder="e.g. WORKLOAD:APP_B"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">PROTOCOL</label>
              <select
                value={testProtocol}
                onChange={(e) => setTestProtocol(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
              >
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
                <option value="ANY">ANY</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">PORT</label>
              <input
                type="text"
                value={testPort}
                onChange={(e) => setTestPort(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                placeholder="e.g. 8080, 5432, 22"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">ROLE CONTEXT (OPTIONAL)</label>
              <select
                value={testRole}
                onChange={(e) => setTestRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
              >
                <option value="">(None - IP Only)</option>
                <option value="FACULTY">FACULTY</option>
                <option value="DEVELOPER">DEVELOPER</option>
                <option value="SECURITY_ADMIN">SECURITY_ADMIN</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isEvaluating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold transition-all shadow-cyber-cyan flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isEvaluating ? 'Evaluating Rule Chain...' : 'Evaluate Traffic'}</span>
            </button>
          </div>
        </form>

        {/* Evaluation Output Window */}
        {evaluationResult && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 font-mono">
            <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
              evaluationResult.allowed
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-start gap-3">
                {evaluationResult.allowed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider text-sm">
                      VERDICT: {evaluationResult.verdict}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-current">
                      {evaluationResult.matchedPolicyName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1">{evaluationResult.reason}</p>
                </div>
              </div>
            </div>

            {/* Step by step evaluation chain */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
              <span className="text-slate-400 font-bold block mb-1">RULE CHAIN EVALUATION LOG:</span>
              {evaluationResult.evaluationChain.map((rec, i) => (
                <div key={i} className={`flex items-start gap-2 ${rec.matched ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>
                  <span>[{rec.matched ? 'MATCH' : 'SKIP'}]</span>
                  <span>Rule #{rec.priority} ({rec.policyName}):</span>
                  <span>{rec.evaluationReason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CyberCard>

      {/* Security Policies Table */}
      <CyberCard
        title="Active Security Policy Rulebase"
        subtitle="Priority-ordered stateful firewall and security group rules"
        headerIcon={<FileCheck className="w-4 h-4 text-cyan-400" />}
        action={
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Scope:</span>
            <select
              value={filterScope}
              onChange={(e) => setFilterScope(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-cyan-300 outline-none"
            >
              <option value="ALL">All Scopes</option>
              <option value="ENTERPRISE_GATEWAY">Enterprise Gateway</option>
              <option value="PRIVATE_DC">Private DC</option>
              <option value="PUBLIC_CLOUD_SG">Public Cloud SG</option>
              <option value="HYBRID_LINK">Hybrid Link</option>
              <option value="K8S_NETWORK_POLICY">K8s Calico CNI</option>
            </select>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">PRIORITY</th>
                <th className="pb-3">RULE NAME</th>
                <th className="pb-3">SOURCE → DESTINATION</th>
                <th className="pb-3">PROTO:PORT</th>
                <th className="pb-3">ACTION</th>
                <th className="pb-3">SCOPE</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPolicies.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-bold text-cyan-400">#{p.priority}</td>
                  <td className="py-3">
                    <span className="font-bold text-slate-100">{p.name}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">{p.description}</p>
                  </td>
                  <td className="py-3 text-slate-300">
                    <span className="text-cyan-300">{p.source}</span> → <span className="text-emerald-300">{p.destination}</span>
                  </td>
                  <td className="py-3 text-slate-300">{p.protocol}:{p.port}</td>
                  <td className="py-3">
                    <Badge variant={p.action === 'ALLOW' ? 'success' : 'danger'}>
                      {p.action}
                    </Badge>
                  </td>
                  <td className="py-3 text-[11px] text-slate-400">{p.scope}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeletePolicy(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 rounded transition-colors"
                      title="Delete Policy"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CyberCard>

      {/* Policy Creation Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Security Policy Rule"
        subtitle="Add a stateful firewall or cloud security group rule"
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePolicy} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Policy Name</label>
            <input
              type="text"
              required
              value={newPolicy.name}
              onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
              placeholder="e.g. DENY App A to App B"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Source Endpoint / CIDR / Tag</label>
              <input
                type="text"
                required
                value={newPolicy.source}
                onChange={(e) => setNewPolicy({ ...newPolicy, source: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                placeholder="e.g. WORKLOAD:APP_A or 10.10.10.0/24"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Destination Endpoint / CIDR / Tag</label>
              <input
                type="text"
                required
                value={newPolicy.destination}
                onChange={(e) => setNewPolicy({ ...newPolicy, destination: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                placeholder="e.g. WORKLOAD:APP_B or 10.10.30.0/24"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Protocol</label>
              <select
                value={newPolicy.protocol}
                onChange={(e) => setNewPolicy({ ...newPolicy, protocol: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
              >
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
                <option value="ANY">ANY</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Port</label>
              <input
                type="text"
                value={newPolicy.port}
                onChange={(e) => setNewPolicy({ ...newPolicy, port: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                placeholder="443, 8080, ANY"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Action</label>
              <select
                value={newPolicy.action}
                onChange={(e) => setNewPolicy({ ...newPolicy, action: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
              >
                <option value="ALLOW">ALLOW</option>
                <option value="DENY">DENY</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Priority (1-1000)</label>
              <input
                type="number"
                value={newPolicy.priority}
                onChange={(e) => setNewPolicy({ ...newPolicy, priority: parseInt(e.target.value) || 100 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Scope</label>
              <select
                value={newPolicy.scope}
                onChange={(e) => setNewPolicy({ ...newPolicy, scope: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
              >
                <option value="PRIVATE_DC">PRIVATE_DC</option>
                <option value="PUBLIC_CLOUD_SG">PUBLIC_CLOUD_SG</option>
                <option value="HYBRID_LINK">HYBRID_LINK</option>
                <option value="ENTERPRISE_GATEWAY">ENTERPRISE_GATEWAY</option>
                <option value="K8S_NETWORK_POLICY">K8S_NETWORK_POLICY</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Description & Security Justification</label>
            <textarea
              rows={2}
              value={newPolicy.description}
              onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
              placeholder="State rationale for zero-trust access control..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold shadow-cyber-cyan"
            >
              Save Policy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
