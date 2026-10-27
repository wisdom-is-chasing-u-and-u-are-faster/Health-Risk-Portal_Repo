import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { usePatient } from './context/PatientContext';
import { LoginView } from './components/LoginView';
import { Navbar } from './components/Navbar';
import { PatientDashboard } from './components/PatientDashboard';
import { PatientProfileView } from './components/PatientProfileView';
import { AuditLogView } from './components/AuditLogView';

export const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { selectPatient, clearSelectedPatient } = usePatient();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'profile' | 'audit'>('dashboard');

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const handleSelectPatient = async (id: string) => {
    await selectPatient(id);
    setCurrentTab('profile');
  };

  const handleBackToDashboard = () => {
    clearSelectedPatient();
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1">
        {currentTab === 'dashboard' && (
          <PatientDashboard onSelectPatient={handleSelectPatient} />
        )}
        {currentTab === 'profile' && (
          <PatientProfileView onBack={handleBackToDashboard} />
        )}
        {currentTab === 'audit' && <AuditLogView />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Health Risk Analysis &amp; Lifestyle Recommendation System • React 18 Single Page Application • HIPAA Zero-ePHI Protected
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
