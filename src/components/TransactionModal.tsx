import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transactionService';
import { ShieldCheck, X, CheckCircle, AlertTriangle, Send } from 'lucide-react';

interface TransactionModalProps {
  patientId: string;
  patientName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  patientId,
  patientName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, isOperator } = useAuth();
  const [systolic, setSystolic] = useState('142');
  const [diastolic, setDiastolic] = useState('88');
  const [cholesterol, setCholesterol] = useState('224');
  const [glucose, setGlucose] = useState('118');
  const [notes, setNotes] = useState('Updated clinical follow-up screening review');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOperator) {
      setError("Forbidden: Users must possess an 'Operator' role to submit transactions to /api/v1/transactions (REQ-F-007).");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await transactionService.submitRiskTransaction({
        action: 'SUBMIT_RISK_ASSESSMENT',
        patient_id: patientId,
        payload: {
          systolic_bp: parseInt(systolic, 10),
          diastolic_bp: parseInt(diastolic, 10),
          total_cholesterol: parseInt(cholesterol, 10),
          fasting_glucose: parseInt(glucose, 10),
          clinician_notes: notes,
          operator_id: user?.id,
        },
      });
      setSuccessData(response);
      setTimeout(() => {
        onSuccess();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Transaction submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Submit Clinical Transaction</h3>
              <p className="text-xs text-slate-500">POST /api/v1/transactions • Operator RBAC Guard</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {successData ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Transaction Committed</h4>
              <p className="text-sm text-slate-600">
                Tracking ID: <span className="font-mono font-semibold text-slate-800">{successData.tracking_id}</span>
              </p>
              <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 text-xs font-medium">
                Committed to PostgreSQL &amp; Logged to OpenSearch WORM Vault
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isOperator && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Permission Warning:</strong> Your account is currently role '{user?.role}'. Submitting
                    mutating transactions requires 'Operator' role (REQ-F-007).
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 flex justify-between">
                <span>Target Patient:</span>
                <span className="font-semibold text-slate-900">{patientName} ({patientId})</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    required
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    required
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Total Cholesterol (mg/dL)</label>
                  <input
                    type="number"
                    value={cholesterol}
                    onChange={(e) => setCholesterol(e.target.value)}
                    required
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Fasting Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    required
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Clinician Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="btn-secondary text-xs px-4 py-2">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {loading ? 'Submitting Transaction...' : 'Commit Transaction'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
