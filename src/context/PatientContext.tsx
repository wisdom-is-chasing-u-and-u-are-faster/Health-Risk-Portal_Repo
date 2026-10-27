import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, PatientDetail, RiskProfile } from '../types';
import { patientService } from '../services/patientService';

interface PatientContextType {
  patients: Patient[];
  selectedPatient: PatientDetail | null;
  selectedRiskProfile: RiskProfile | null;
  loading: boolean;
  error: string | null;
  searchPatients: (query?: string) => Promise<void>;
  selectPatient: (id: string) => Promise<void>;
  clearSelectedPatient: () => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Pure in-memory patient data without writing to localStorage/sessionStorage (Zero-ePHI compliant)
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(null);
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<RiskProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchPatients = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await patientService.searchPatients(query);
      setPatients(results);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const selectPatient = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const [detail, risk] = await Promise.all([
        patientService.getPatientDetails(id),
        patientService.getRiskAssessment(id),
      ]);
      setSelectedPatient(detail);
      setSelectedRiskProfile(risk);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patient details');
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedPatient = () => {
    setSelectedPatient(null);
    setSelectedRiskProfile(null);
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        selectedPatient,
        selectedRiskProfile,
        loading,
        error,
        searchPatients,
        selectPatient,
        clearSelectedPatient,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
