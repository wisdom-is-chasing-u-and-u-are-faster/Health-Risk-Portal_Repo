import React, { useState } from 'react';
import { usePatient } from '../context/PatientContext';
import { RiskCard } from './RiskCard';
import { LifestyleAccordion } from './LifestyleAccordion';
import { TransactionModal } from './TransactionModal';
import { ArrowLeft, User, HeartPulse, PlusCircle, ShieldAlert, Sparkles, Activity } from 'lucide-react';

interface PatientProfileViewProps {
  onBack: () => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({ onBack }) => {
  const { selectedPatient, selectedRiskProfile, loading, error, selectPatient } = usePatient();
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <Activity className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
        <p>Loading patient clinical profile and calculating risk algorithms...</p>
      </div>
    );
  }

  if (error || !selectedPatient || !selectedRiskProfile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button onClick={onBack} className="btn-secondary text-xs mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Cohort
        </button>
        <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200">
          {error || 'Patient data could not be loaded.'}
        </div>
      </div>
    );
  }

  const { biometrics } = selectedPatient;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">{selectedPatient.name}</h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {selectedPatient.mrn}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedPatient.age} years old • {selectedPatient.gender} • DOB: {selectedPatient.birth_date || '1968-04-12'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Transaction / Assessment</span>
          </button>
        </div>
      </div>

      {/* Patient Biometrics Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Recent Biometric Observations (HL7 FHIR R4)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 text-center">
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-2xs text-slate-500 block">Blood Pressure</span>
            <span className="text-sm font-bold text-slate-800">
              {biometrics.systolic_bp}/{biometrics.diastolic_bp} <span className="text-2xs font-normal">mmHg</span>
            </span>
          </div>

          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-2xs text-slate-500 block">Total Cholesterol</span>
            <span className="text-sm font-bold text-slate-800">
              {biometrics.total_cholesterol} <span className="text-2xs font-normal">mg/dL</span>
            </span>
          </div>

          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-2xs text-slate-500 block">HDL / LDL</span>
            <span className="text-sm font-bold text-slate-800">
              {biometrics.hdl_cholesterol} / {biometrics.ldl_cholesterol}
            </span>
          </div>

          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-2xs text-slate-500 block">Fasting Glucose</span>
            <span className="text-sm font-bold text-slate-800">
              {biometrics.fasting_glucose} <span className="text-2xs font-normal">mg/dL</span>
            </span>
          </div>

          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-2xs text-slate-500 block">HbA1c</span>
            <span className="text-sm font-bold text-slate-800">{biometrics.hba1c}%</span>
          </div>

          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-2xs text-slate-500 block">Body Mass Index</span>
            <span className="text-sm font-bold text-slate-800">
              {biometrics.bmi} <span className="text-2xs font-normal">kg/m²</span>
            </span>
          </div>

          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-2xs text-slate-500 block">Hypertension Meds</span>
            <span className="text-sm font-bold text-slate-800">
              {biometrics.on_hypertension_meds ? 'Prescribed' : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Algorithmic Risk Scores */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-blue-600" />
            <span>Algorithmic Risk Engine Calculations</span>
          </h3>
          <span className="text-xs text-slate-500">ACC/AHA • ADA • NCEP ATP III Standards</span>
        </div>

        <RiskCard
          ascvd={selectedRiskProfile.ascvd}
          diabetes={selectedRiskProfile.diabetes}
          metabolic={selectedRiskProfile.metabolic_syndrome}
        />
      </div>

      {/* Synthesized Lifestyle Recommendations */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <span>Actionable Lifestyle Recommendations &amp; CarePlan</span>
          </h3>
          <span className="text-xs text-slate-500">Personalized Preventative Protocol</span>
        </div>

        <LifestyleAccordion recommendations={selectedRiskProfile.recommendations} />
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        patientId={selectedPatient.id}
        patientName={selectedPatient.name}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          selectPatient(selectedPatient.id);
        }}
      />
    </div>
  );
};
