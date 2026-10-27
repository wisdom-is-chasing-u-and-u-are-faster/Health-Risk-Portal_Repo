import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AuditLog } from '../types';
import { ShieldCheck, RefreshCw, FileText } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (e) {
      console.error('Failed to load audit logs', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            <span>HIPAA Audit Vault &amp; Access Logs</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable, write-once audit capture (OpenSearch / PostgreSQL WORM Trail)
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Audit ID</th>
                <th className="px-6 py-3">Timestamp (UTC)</th>
                <th className="px-6 py-3">Clinician Actor</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Resource Target</th>
                <th className="px-6 py-3">Client IP</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-2xs">
              {logs.map((log) => (
                <tr key={log.audit_id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-slate-800 font-semibold">{log.audit_id}</td>
                  <td className="px-6 py-3 text-slate-500">{log.timestamp}</td>
                  <td className="px-6 py-3 font-sans text-xs text-slate-900">{log.actor}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-sans text-xs text-slate-700">{log.resource}</td>
                  <td className="px-6 py-3 text-slate-500">{log.client_ip}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
