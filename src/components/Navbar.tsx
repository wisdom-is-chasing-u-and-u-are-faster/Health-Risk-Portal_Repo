import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, ShieldCheck, LogOut, FileText, Users } from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'profile' | 'audit';
  setCurrentTab: (tab: 'dashboard' | 'profile' | 'audit') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout, isOperator } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">HealthRisk</span>
              <span className="text-xs ml-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">Clinical Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition ${
                currentTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Patient Cohort
            </button>
            <button
              onClick={() => setCurrentTab('audit')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition ${
                currentTab === 'audit'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              Audit Vault
            </button>
          </nav>

          {/* User Profile & Role */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-800">{user?.name || 'Dr. Sarah Jenkins, MD'}</div>
              <div className="flex items-center justify-end gap-1 text-xs text-slate-500">
                <span className="capitalize">{user?.department || 'Cardiology'}</span>
                <span>•</span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded font-medium ${
                    isOperator ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {user?.role || 'Operator'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
