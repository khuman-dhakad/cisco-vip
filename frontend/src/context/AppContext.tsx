import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  AttackExecutionResult, 
  DashboardStats, 
  Incident, 
  NetworkSegment, 
  SecurityPolicy, 
  SecurityPosture, 
  Workload, 
  HybridLinkState 
} from '../types';
import { api } from '../services/api';

export type AppView = 
  | 'dashboard'
  | 'architecture'
  | 'iam'
  | 'segmentation'
  | 'policies'
  | 'workloads'
  | 'attack-simulator'
  | 'attack-path'
  | 'incidents'
  | 'monitoring'
  | 'audit'
  | 'posture'
  | 'hybrid-link'
  | 'zero-trust'
  | 'guided-demo';

export interface ToastMessage {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

interface AppContextType {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  dashboardStats: DashboardStats | null;
  securityPosture: SecurityPosture | null;
  workloads: Workload[];
  segments: NetworkSegment[];
  policies: SecurityPolicy[];
  incidents: Incident[];
  hybridLink: HybridLinkState | null;
  latestAttackResult: AttackExecutionResult | null;
  setLatestAttackResult: (result: AttackExecutionResult | null) => void;
  selectedNode: any | null;
  setSelectedNode: (node: any | null) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'danger' | 'warning' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  isLoading: boolean;
  
  // Guided Demo Mode State
  isDemoActive: boolean;
  demoStep: number;
  startGuidedDemo: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  exitGuidedDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [securityPosture, setSecurityPosture] = useState<SecurityPosture | null>(null);
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [segments, setSegments] = useState<NetworkSegment[]>([]);
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [hybridLink, setHybridLink] = useState<HybridLinkState | null>(null);
  const [latestAttackResult, setLatestAttackResult] = useState<AttackExecutionResult | null>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Guided Demo
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(1);

  const addToast = (type: 'success' | 'danger' | 'warning' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [{ id, type, title, message, timestamp: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshData = useCallback(async () => {
    try {
      const [stats, posture, wList, sList, pList, incList, hLink] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getSecurityPosture().catch(() => null),
        api.getWorkloads().catch(() => []),
        api.getSegments().catch(() => []),
        api.getPolicies().catch(() => []),
        api.getIncidents().catch(() => []),
        api.getHybridLink().catch(() => null)
      ]);

      if (stats) setDashboardStats(stats);
      if (posture) setSecurityPosture(posture);
      if (wList) setWorkloads(wList);
      if (sList) setSegments(sList);
      if (pList) setPolicies(pList);
      if (incList) setIncidents(incList);
      if (hLink) setHybridLink(hLink);
    } catch (err) {
      console.error('Failed to fetch dashboard telemetry:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Guided Demo Controls
  const startGuidedDemo = () => {
    setIsDemoActive(true);
    setDemoStep(1);
    setActiveView('guided-demo');
    addToast('info', 'Guided Demo Started', '13-Step Presentation mode active for Cisco reviewers.');
  };

  const nextDemoStep = () => {
    if (demoStep < 13) {
      setDemoStep(prev => prev + 1);
    } else {
      setIsDemoActive(false);
      addToast('success', 'Demo Completed', 'Successfully completed 13-step hybrid security demonstration.');
    }
  };

  const prevDemoStep = () => {
    if (demoStep > 1) {
      setDemoStep(prev => prev - 1);
    }
  };

  const exitGuidedDemo = () => {
    setIsDemoActive(false);
    setDemoStep(1);
    setActiveView('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        dashboardStats,
        securityPosture,
        workloads,
        segments,
        policies,
        incidents,
        hybridLink,
        latestAttackResult,
        setLatestAttackResult,
        selectedNode,
        setSelectedNode,
        toasts,
        addToast,
        removeToast,
        refreshData,
        isLoading,
        isDemoActive,
        demoStep,
        startGuidedDemo,
        nextDemoStep,
        prevDemoStep,
        exitGuidedDemo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
