export type UserRole = 'Clinician' | 'Operator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: string;
  birth_date?: string;
  ascvd_risk_pct?: number;
  diabetes_risk_tier?: string;
  metabolic_syndrome?: boolean;
  last_assessed?: string;
}

export interface Biometrics {
  systolic_bp: number;
  diastolic_bp: number;
  total_cholesterol: number;
  hdl_cholesterol: number;
  ldl_cholesterol: number;
  fasting_glucose: number;
  hba1c: number;
  bmi: number;
  smoker: boolean;
  on_hypertension_meds: boolean;
  recorded_at?: string;
}

export interface PatientDetail extends Patient {
  biometrics: Biometrics;
}

export interface AscvdScore {
  ten_year_risk_pct: number;
  risk_category: 'Low (< 5%)' | 'Borderline (5% - 7.4%)' | 'Intermediate (7.5% - 19.9%)' | 'High (>= 20%)';
  target_ldl: string;
}

export interface DiabetesScore {
  risk_score: number;
  max_score: number;
  risk_level: 'Low Risk' | 'Moderate Risk' | 'High (Prediabetes range)' | 'Very High Risk (Diabetes)';
}

export interface MetabolicSyndromeScore {
  criteria_met: number;
  threshold: number;
  diagnosed: boolean;
  factors: string[];
}

export interface LifestyleRecommendation {
  id?: string;
  category: 'Diet & Nutrition' | 'Physical Activity' | 'Medication & Therapy' | 'Clinical Follow-up' | 'Smoking Cessation';
  action: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface RiskProfile {
  patient_id: string;
  patient_name: string;
  ascvd: AscvdScore;
  diabetes: DiabetesScore;
  metabolic_syndrome: MetabolicSyndromeScore;
  recommendations: LifestyleRecommendation[];
}

export interface TransactionPayload {
  transaction_id?: string;
  action: string;
  patient_id: string;
  payload: Record<string, any>;
}

export interface TransactionResponse {
  status: string;
  tracking_id: string;
  created_at: string;
  next_step: string;
  audit_logged: boolean;
}

export interface AuditLog {
  audit_id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  client_ip: string;
  status: string;
}
