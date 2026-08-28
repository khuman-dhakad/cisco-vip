import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { User, Role } from '../types';
import { api } from '../services/api';
import { CyberCard } from '../components/common/CyberCard';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  Key, 
  Users, 
  BookOpen, 
  FileCode, 
  SearchCheck, 
  Check, 
  X, 
  Plus, 
  ToggleLeft, 
  ToggleRight,
  ShieldAlert
} from 'lucide-react';

export const IamRbacView: React.FC = () => {
  const { user: currentUser, switchDemoRole } = useAuth();
  const { addToast } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    email: '',
    password: 'Password@123',
    role: 'DEVELOPER' as Role,
    department: 'Software Engineering',
    mfaEnabled: true
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleMfa = async (userId: string, currentMfa: boolean) => {
    try {
      const updated = await api.toggleMfa(userId, !currentMfa);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      addToast('success', 'MFA Updated', `MFA has been ${!currentMfa ? 'enabled' : 'disabled'} for ${updated.username}`);
    } catch (err: any) {
      addToast('danger', 'Update Failed', err.message || 'Could not update MFA');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const updated = await api.updateRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      addToast('success', 'Role Updated', `Role updated to ${newRole} for ${updated.username}`);
    } catch (err: any) {
      addToast('danger', 'Update Failed', err.message || 'Could not update role');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('cisco_jwt_token')}`
        },
        body: JSON.stringify(newUser)
      });
      if (!res.ok) throw new Error('Failed to create user');
      const data = await res.json();
      setUsers(prev => [...prev, data]);
      setShowCreateModal(false);
      addToast('success', 'User Created', `User ${data.username} registered with role ${data.role}`);
      setNewUser({
        username: '',
        fullName: '',
        email: '',
        password: 'Password@123',
        role: 'DEVELOPER',
        department: 'Software Engineering',
        mfaEnabled: true
      });
    } catch (err: any) {
      addToast('danger', 'Creation Failed', err.message || 'Error creating user');
    }
  };

  const permissionMatrix: { permission: string; desc: string; roles: Record<Role, boolean> }[] = [
    {
      permission: 'VIEW_DASHBOARD',
      desc: 'View overarching hybrid SOC telemetry and system posture score',
      roles: { SECURITY_ADMIN: true, NETWORK_ADMIN: true, CLOUD_ADMIN: true, DEVELOPER: true, FACULTY: true, AUDITOR: true }
    },
    {
      permission: 'VIEW_ARCHITECTURE',
      desc: 'Inspect interactive hybrid network visualizer and subnet nodes',
      roles: { SECURITY_ADMIN: true, NETWORK_ADMIN: true, CLOUD_ADMIN: true, DEVELOPER: false, FACULTY: false, AUDITOR: true }
    },
    {
      permission: 'MANAGE_POLICIES',
      desc: 'Create, update, prioritize, and delete stateful firewall & SG rules',
      roles: { SECURITY_ADMIN: true, NETWORK_ADMIN: true, CLOUD_ADMIN: false, DEVELOPER: false, FACULTY: false, AUDITOR: false }
    },
    {
      permission: 'RUN_ATTACK_SIMULATION',
      desc: 'Trigger multi-stage red-team attack scenarios and containment',
      roles: { SECURITY_ADMIN: true, NETWORK_ADMIN: true, CLOUD_ADMIN: false, DEVELOPER: false, FACULTY: false, AUDITOR: false }
    },
    {
      permission: 'CONTAIN_INCIDENTS',
      desc: 'Triage incident tickets and execute automated workload quarantine',
      roles: { SECURITY_ADMIN: true, NETWORK_ADMIN: false, CLOUD_ADMIN: false, DEVELOPER: false, FACULTY: false, AUDITOR: false }
    },
    {
      permission: 'MANAGE_SEGMENTS',
      desc: 'Configure VPC subnets and trigger emergency network isolation',
      roles: { SECURITY_ADMIN: true, NETWORK_ADMIN: true, CLOUD_ADMIN: true, DEVELOPER: false, FACULTY: false, AUDITOR: false }
    },
    {
      permission: 'ACCESS_TEACHING_PORTAL',
      desc: 'Access academic curriculum, lecture portals, and grading inputs',
      roles: { SECURITY_ADMIN: false, NETWORK_ADMIN: false, CLOUD_ADMIN: false, DEVELOPER: false, FACULTY: true, AUDITOR: false }
    },
    {
      permission: 'VIEW_AUDIT_LOGS',
      desc: 'Inspect immutable MongoDB audit logs and SIEM security traces',
      roles: { SECURITY_ADMIN: true, NETWORK_ADMIN: false, CLOUD_ADMIN: false, DEVELOPER: false, FACULTY: false, AUDITOR: true }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-100">
              IAM & Role-Based Access Control (RBAC) Governance
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Least-Privilege Enforcement • Multi-Factor Authentication • Dynamic JWT Token Claims
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold transition-all shadow-cyber-cyan flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Identity Account</span>
          </button>
        </div>
      </div>

      {/* User Directory Table */}
      <CyberCard
        title="Enterprise Identity Directory"
        subtitle="Active user accounts, assigned roles, and MFA enforcement"
        headerIcon={<Users className="w-4 h-4 text-cyan-400" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">USER</th>
                <th className="pb-3">DEPARTMENT</th>
                <th className="pb-3">ROLE</th>
                <th className="pb-3">MFA STATUS</th>
                <th className="pb-3">LAST LOGIN</th>
                <th className="pb-3 text-right">SWITCH CONTEXT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => {
                const isCurrent = currentUser?.username === u.username;
                return (
                  <tr key={u.id} className={`hover:bg-slate-800/30 transition-colors ${isCurrent ? 'bg-cyan-950/30' : ''}`}>
                    <td className="py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100">{u.fullName}</span>
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-900 text-cyan-300 border border-cyan-700">
                              ACTIVE CONTEXT
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 text-[11px]">@{u.username} • {u.email}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">{u.department || 'Enterprise Security'}</td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                      >
                        <option value="SECURITY_ADMIN">SECURITY_ADMIN</option>
                        <option value="NETWORK_ADMIN">NETWORK_ADMIN</option>
                        <option value="CLOUD_ADMIN">CLOUD_ADMIN</option>
                        <option value="DEVELOPER">DEVELOPER</option>
                        <option value="FACULTY">FACULTY</option>
                        <option value="AUDITOR">AUDITOR</option>
                      </select>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleToggleMfa(u.id, u.mfaEnabled)}
                        className="flex items-center gap-1.5"
                      >
                        {u.mfaEnabled ? (
                          <Badge variant="success">
                            <Check className="w-3 h-3" /> MFA ACTIVE
                          </Badge>
                        ) : (
                          <Badge variant="danger">
                            <X className="w-3 h-3" /> MFA DISABLED
                          </Badge>
                        )}
                      </button>
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleTimeString() : 'Recent'}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => switchDemoRole(u.username)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                          isCurrent
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {isCurrent ? 'Current' : 'Simulate Role'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CyberCard>

      {/* Role Permission Matrix */}
      <CyberCard
        title="Zero-Trust RBAC Permission Matrix"
        subtitle="Rigorous least-privilege capability mapping across the 6 enterprise roles"
        headerIcon={<Lock className="w-4 h-4 text-purple-400" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 min-w-[200px]">PERMISSION / CAPABILITY</th>
                <th className="pb-3 text-center">SEC ADMIN</th>
                <th className="pb-3 text-center">NET ADMIN</th>
                <th className="pb-3 text-center">CLOUD ADMIN</th>
                <th className="pb-3 text-center">DEVELOPER</th>
                <th className="pb-3 text-center">FACULTY</th>
                <th className="pb-3 text-center">AUDITOR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {permissionMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3">
                    <span className="font-bold text-slate-200">{item.permission}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </td>
                  <td className="py-3 text-center">
                    {item.roles.SECURITY_ADMIN ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {item.roles.NETWORK_ADMIN ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {item.roles.CLOUD_ADMIN ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {item.roles.DEVELOPER ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {item.roles.FACULTY ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {item.roles.AUDITOR ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CyberCard>

      {/* User Creation Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Provision Enterprise User Identity"
        subtitle="Add a new IAM identity with least-privilege role assignment"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 font-mono">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Username</label>
            <input
              type="text"
              required
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-cyan-400 outline-none"
              placeholder="e.g. jsmith"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-cyan-400 outline-none"
              placeholder="e.g. John Smith"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-cyan-400 outline-none"
              placeholder="e.g. jsmith@enterprise.org"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-cyan-400 outline-none"
              >
                <option value="SECURITY_ADMIN">SECURITY_ADMIN</option>
                <option value="NETWORK_ADMIN">NETWORK_ADMIN</option>
                <option value="CLOUD_ADMIN">CLOUD_ADMIN</option>
                <option value="DEVELOPER">DEVELOPER</option>
                <option value="FACULTY">FACULTY</option>
                <option value="AUDITOR">AUDITOR</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Department</label>
              <input
                type="text"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-cyan-400 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="mfaCheckbox"
              checked={newUser.mfaEnabled}
              onChange={(e) => setNewUser({ ...newUser, mfaEnabled: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <label htmlFor="mfaCheckbox" className="text-xs text-slate-300">
              Enforce Multi-Factor Authentication (MFA)
            </label>
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
              Save User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
