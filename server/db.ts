// In-Memory Database store seeded with initial PostgreSQL datasets for full-stack API serving
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  auth_hash: string;
  role: 'Clinician' | 'Operator';
  department: string;
}

export interface PatientRecord {
  id: string;
  mrn: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  biometrics: {
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
  };
  assessment: {
    ascvd_risk_pct: number;
    ascvd_category: 'Low (< 5%)' | 'Borderline (5% - 7.4%)' | 'Intermediate (7.5% - 19.9%)' | 'High (>= 20%)';
    diabetes_risk_score: number;
    diabetes_risk_level: string;
    metabolic_syndrome: boolean;
    metabolic_criteria_met: number;
    factors: string[];
  };
  recommendations: Array<{
    category: 'Diet & Nutrition' | 'Physical Activity' | 'Medication & Therapy' | 'Clinical Follow-up' | 'Smoking Cessation';
    action: string;
    priority: 'High' | 'Medium' | 'Low';
  }>;
}

export interface TransactionRecord {
  id: string;
  transaction_id: string;
  tenant_id: string;
  action: string;
  status: string;
  tracking_id: string;
  patient_id: string;
  payload: any;
  created_at: string;
}

export interface AuditRecord {
  audit_id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  client_ip: string;
  status: string;
}

class DatabaseService {
  public users: UserRecord[] = [
    {
      id: 'usr-01',
      name: 'Dr. Sarah Jenkins, MD',
      email: 'clinician@healthrisk.org',
      auth_hash: 'auth_v1_operator_credential_ref',
      role: 'Operator',
      department: 'Cardiology',
    },
    {
      id: 'usr-02',
      name: 'Dr. Alan Morales, MD',
      email: 'morales@healthrisk.org',
      auth_hash: 'auth_v1_clinician_credential_ref',
      role: 'Clinician',
      department: 'Endocrinology',
    },
  ];

  public patients: PatientRecord[] = [
    {
      id: 'pat-101',
      mrn: 'MRN-849201',
      first_name: 'Eleanor',
      last_name: 'Vance',
      birth_date: '1968-04-12',
      gender: 'Female',
      biometrics: {
        systolic_bp: 142,
        diastolic_bp: 88,
        total_cholesterol: 224,
        hdl_cholesterol: 42,
        ldl_cholesterol: 148,
        fasting_glucose: 118,
        hba1c: 6.2,
        bmi: 29.4,
        smoker: false,
        on_hypertension_meds: true,
      },
      assessment: {
        ascvd_risk_pct: 14.2,
        ascvd_category: 'Intermediate (7.5% - 19.9%)',
        diabetes_risk_score: 5,
        diabetes_risk_level: 'High (Prediabetes range)',
        metabolic_syndrome: true,
        metabolic_criteria_met: 3,
        factors: ['Elevated blood pressure', 'Elevated fasting glucose', 'Low HDL cholesterol'],
      },
      recommendations: [
        {
          category: 'Diet & Nutrition',
          action: 'Adopt Mediterranean / DASH dietary pattern with sodium < 1,500mg/day to lower systolic pressure.',
          priority: 'High',
        },
        {
          category: 'Physical Activity',
          action: 'Engage in 150 min/week moderate-intensity aerobic exercise plus 2 weekly resistance sessions.',
          priority: 'High',
        },
        {
          category: 'Clinical Follow-up',
          action: 'Schedule lipid panel re-evaluation and fasting glucose test in 90 days.',
          priority: 'Medium',
        },
      ],
    },
    {
      id: 'pat-102',
      mrn: 'MRN-391823',
      first_name: 'Marcus',
      last_name: 'Holloway',
      birth_date: '1980-09-25',
      gender: 'Male',
      biometrics: {
        systolic_bp: 124,
        diastolic_bp: 78,
        total_cholesterol: 182,
        hdl_cholesterol: 54,
        ldl_cholesterol: 110,
        fasting_glucose: 92,
        hba1c: 5.4,
        bmi: 24.8,
        smoker: false,
        on_hypertension_meds: false,
      },
      assessment: {
        ascvd_risk_pct: 4.1,
        ascvd_category: 'Low (< 5%)',
        diabetes_risk_score: 2,
        diabetes_risk_level: 'Low Risk',
        metabolic_syndrome: false,
        metabolic_criteria_met: 1,
        factors: [],
      },
      recommendations: [
        {
          category: 'Diet & Nutrition',
          action: 'Maintain balanced Mediterranean diet high in omega-3 fatty acids and dietary fiber.',
          priority: 'Low',
        },
        {
          category: 'Physical Activity',
          action: 'Continue baseline aerobic fitness regimen (150 min/week).',
          priority: 'Low',
        },
      ],
    },
    {
      id: 'pat-103',
      mrn: 'MRN-512948',
      first_name: 'David',
      last_name: 'Kim',
      birth_date: '1959-11-03',
      gender: 'Male',
      biometrics: {
        systolic_bp: 156,
        diastolic_bp: 94,
        total_cholesterol: 252,
        hdl_cholesterol: 38,
        ldl_cholesterol: 172,
        fasting_glucose: 134,
        hba1c: 7.1,
        bmi: 31.2,
        smoker: true,
        on_hypertension_meds: true,
      },
      assessment: {
        ascvd_risk_pct: 24.8,
        ascvd_category: 'High (>= 20%)',
        diabetes_risk_score: 8,
        diabetes_risk_level: 'Very High Risk (Diabetes)',
        metabolic_syndrome: true,
        metabolic_criteria_met: 4,
        factors: ['Elevated systolic pressure', 'Fasting hyperglycemia', 'Elevated triglycerides', 'Low HDL'],
      },
      recommendations: [
        {
          category: 'Medication & Therapy',
          action: 'Initiate high-intensity statin therapy and evaluate metformin therapy for glycemic control.',
          priority: 'High',
        },
        {
          category: 'Smoking Cessation',
          action: 'Immediate clinical nicotine replacement and behavioral counseling enrollment.',
          priority: 'High',
        },
      ],
    },
  ];

  public transactions: TransactionRecord[] = [];

  public auditLogs: AuditRecord[] = [
    {
      audit_id: 'aud-1001',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      actor: 'Dr. Sarah Jenkins, MD (usr-01)',
      action: 'SYSTEM_BOOT',
      resource: 'PostgreSQL Multi-Tier Database',
      client_ip: '127.0.0.1',
      status: 'SUCCESS',
    },
  ];

  public addAuditLog(actor: string, action: string, resource: string, clientIp: string = '127.0.0.1') {
    const record: AuditRecord = {
      audit_id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      resource,
      client_ip: clientIp,
      status: 'SUCCESS',
    };
    this.auditLogs.unshift(record);
    return record;
  }
}

export const db = new DatabaseService();
