import { api } from './api';
import { Patient, PatientDetail, RiskProfile } from '../types';

export const patientService = {
  async searchPatients(query?: string): Promise<Patient[]> {
    return api.getPatients(query);
  },

  async getPatientDetails(id: string): Promise<PatientDetail> {
    return api.getPatientById(id);
  },

  async getRiskAssessment(id: string): Promise<RiskProfile> {
    return api.getRiskProfile(id);
  }
};
