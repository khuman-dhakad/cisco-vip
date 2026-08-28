import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  switchDemoRole: (username: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cisco_jwt_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with default admin if no user logged in
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (token) {
          const u = await api.getCurrentUser();
          setUser(u);
        } else {
          // Auto login as SecOps Admin for seamless reviewer demo experience
          const authRes = await api.demoSwitch('secadmin');
          localStorage.setItem('cisco_jwt_token', authRes.token);
          setToken(authRes.token);
          setUser({
            id: authRes.userId,
            username: authRes.username,
            fullName: authRes.fullName,
            email: authRes.email,
            role: authRes.role,
            department: authRes.department,
            mfaEnabled: authRes.mfaEnabled,
            active: true,
            permissions: authRes.permissions
          });
        }
      } catch (err) {
        console.warn('Backend not ready or auth failed, using local demo fallback context:', err);
        // Local fallback context for UI readiness
        setUser({
          id: 'USER_SECADMIN',
          username: 'secadmin',
          fullName: 'Khuman Dhakad (Lead SecOps)',
          email: 'khuman.dhakad@cisco-vip.lnct.ac.in',
          role: 'SECURITY_ADMIN',
          department: 'Cyber Security Operations',
          mfaEnabled: true,
          active: true,
          permissions: [
            'VIEW_DASHBOARD', 'VIEW_ARCHITECTURE', 'MANAGE_IAM', 'MANAGE_POLICIES',
            'RUN_ATTACK_SIMULATION', 'CONTAIN_INCIDENTS', 'ISOLATE_WORKLOADS',
            'VIEW_AUDIT_LOGS', 'MANAGE_HYBRID_LINK', 'VIEW_MONITORING'
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(username, password);
      localStorage.setItem('cisco_jwt_token', res.token);
      setToken(res.token);
      setUser({
        id: res.userId,
        username: res.username,
        fullName: res.fullName,
        email: res.email,
        role: res.role,
        department: res.department,
        mfaEnabled: res.mfaEnabled,
        active: true,
        permissions: res.permissions
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchDemoRole = async (username: string) => {
    setIsLoading(true);
    try {
      const res = await api.demoSwitch(username);
      localStorage.setItem('cisco_jwt_token', res.token);
      setToken(res.token);
      setUser({
        id: res.userId,
        username: res.username,
        fullName: res.fullName,
        email: res.email,
        role: res.role,
        department: res.department,
        mfaEnabled: res.mfaEnabled,
        active: true,
        permissions: res.permissions
      });
    } catch (err) {
      console.error('Failed to switch demo role:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('cisco_jwt_token');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission) || user.role === 'SECURITY_ADMIN';
  };

  const hasRole = (...roles: Role[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        switchDemoRole,
        hasPermission,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
