import React, { useEffect, useState } from 'react';
import { usePatient } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { Search, UserCheck, AlertCircle, HeartPulse, ChevronRight, Filter, ShieldCheck, Activity } from 'lucide-react';

interface PatientDashboardProps {
  onSelectPatient: (patientId: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onSelectPatient }) => {
  const { patients, searchPatients, loading, error } = usePatient();
  const { isOperator } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  useEffect(() => {
    searchPatients();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPatients(searchTerm);
  };

  const filteredPatients = patients.filter((p) => {
    if (filterTier === 'all') return true;
    if (filterTier === 'high') return (p.ascvd_risk_pct || 0) >= 20 || p.diabetes_risk_tier?.includes('High');
    if (filterTier === 'borderline') return (p.ascvd_risk_pct || 0) >= 5 && (p.ascvd_risk_pct || 0) < 20;
    if (filterTier === 'low') return (p.ascvd_risk_pct || 0) < 5;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-blue-500 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Cohort</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{patients.length} Patients</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="card border-l-4 border-l-rose-500 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Risk ASCVD</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {patients.filter((p) => (p.ascvd_risk_pct || 0) >= 10).length} Patients
            </div>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <HeartPulse className="w-6 h-6" />
          </div>
        </div>

        <div className="card border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Metabolic Syndrome</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {patients.filter((p) => p.metabolic_syndrome).length} Diagnosed
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="card border-l-4 border-l-teal-500 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operator Clearance</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{isOperator ? 'Granted' : 'Standard'}</div>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="patient-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Patient Name, MRN (e.g. MRN-849201), or Risk Category..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button type="submit" className="btn-primary text-sm px-4 py-2">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Risk Categories</option>
            <option value="high">High Risk (ASCVD &gt;= 20%)</option>
            <option value="borderline">Borderline / Intermediate (5% - 19.9%)</option>
            <option value="low">Low Risk (&lt; 5%)</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900 text-base">Assigned Clinical Cohort</h3>
          <span className="text-xs text-slate-500">HIPAA Protected • Audit Logging Active</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <Activity className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
            <p>Loading patient clinical data...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 bg-red-50">{error}</div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No patients found matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-3.5">Patient Details</th>
                  <th className="px-6 py-3.5">MRN</th>
                  <th className="px-6 py-3.5">Age / Gender</th>
                  <th className="px-6 py-3.5">10-Yr ASCVD Risk</th>
                  <th className="px-6 py-3.5">Diabetes Risk</th>
                  <th className="px-6 py-3.5">Metabolic Syndrome</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((patient) => {
                  const ascvd = patient.ascvd_risk_pct || 0;
                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50 transition cursor-pointer"
                      onClick={() => onSelectPatient(patient.id)}
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900">{patient.name}</td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">{patient.mrn}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {patient.age} yrs • {patient.gender}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            ascvd >= 20 ? 'badge-high' : ascvd >= 7.5 ? 'badge-borderline' : 'badge-low'
                          }
                        >
                          {ascvd}% 10-Yr
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                            patient.diabetes_risk_tier?.includes('High')
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {patient.diabetes_risk_tier || 'Assessed'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {patient.metabolic_syndrome ? (
                          <span className="badge-borderline">Criteria Met</span>
                        ) : (
                          <span className="text-slate-400 text-xs">Negative</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatient(patient.id);
                          }}
                          className="btn-secondary text-xs px-2.5 py-1.5 rounded inline-flex items-center gap-1 hover:border-blue-500 hover:text-blue-600"
                        >
                          <span>Review Risk Profile</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
