import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp, AppView } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Views
import { DashboardView } from './views/DashboardView';
import { ArchitectureView } from './views/ArchitectureView';
import { IamRbacView } from './views/IamRbacView';
import { SegmentationView } from './views/SegmentationView';
import { PoliciesView } from './views/PoliciesView';
import { WorkloadsView } from './views/WorkloadsView';
import { AttackSimulatorView } from './views/AttackSimulatorView';
import { AttackPathView } from './views/AttackPathView';
import { IncidentsView } from './views/IncidentsView';
import { MonitoringView } from './views/MonitoringView';
import { AuditLogView } from './views/AuditLogView';
import { SecurityPostureView } from './views/SecurityPostureView';
import { HybridLinkView } from './views/HybridLinkView';
import { ZeroTrustGuideView } from './views/ZeroTrustGuideView';
import { GuidedDemoView } from './views/GuidedDemoView';

import { X, CheckCircle2, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeView, toasts, removeToast } = useApp();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'architecture': return <ArchitectureView />;
      case 'iam': return <IamRbacView />;
      case 'segmentation': return <SegmentationView />;
      case 'policies': return <PoliciesView />;
      case 'workloads': return <WorkloadsView />;
      case 'attack-simulator': return <AttackSimulatorView />;
      case 'attack-path': return <AttackPathView />;
      case 'incidents': return <IncidentsView />;
      case 'monitoring': return <MonitoringView />;
      case 'audit': return <AuditLogView />;
      case 'posture': return <SecurityPostureView />;
      case 'hybrid-link': return <HybridLinkView />;
      case 'zero-trust': return <ZeroTrustGuideView />;
      case 'guided-demo': return <GuidedDemoView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderCurrentView()}
          </div>
          <Footer />
        </main>
      </div>

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all flex items-start gap-3 text-xs font-mono animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === 'danger'
                ? 'bg-rose-950/95 border-rose-500 text-rose-200 shadow-cyber-rose'
                : toast.type === 'warning'
                ? 'bg-amber-950/95 border-amber-500 text-amber-200 shadow-cyber-amber'
                : toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200 shadow-cyber-emerald'
                : 'bg-slate-900/95 border-cyan-500 text-cyan-200 shadow-cyber-cyan'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'danger' ? (
                <AlertOctagon className="w-4 h-4 text-rose-400" />
              ) : toast.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Info className="w-4 h-4 text-cyan-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold tracking-wide">{toast.title}</span>
                <span className="text-[10px] opacity-60">{toast.timestamp}</span>
              </div>
              <p className="mt-0.5 opacity-90 leading-tight">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded transition-colors opacity-70 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
