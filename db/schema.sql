-- Enterprise Database Schema for Health Risk Analysis & Lifestyle Recommendation Platform
-- PostgreSQL / ANSI SQL DDL

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Clinician',
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(50) PRIMARY KEY,
    mrn VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS biometric_observations (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    systolic_bp INTEGER NOT NULL,
    diastolic_bp INTEGER NOT NULL,
    total_cholesterol INTEGER NOT NULL,
    hdl_cholesterol INTEGER NOT NULL,
    ldl_cholesterol INTEGER NOT NULL,
    fasting_glucose INTEGER NOT NULL,
    hba1c NUMERIC(4, 2) NOT NULL,
    bmi NUMERIC(4, 1) NOT NULL,
    smoker BOOLEAN NOT NULL DEFAULT FALSE,
    on_hypertension_meds BOOLEAN NOT NULL DEFAULT FALSE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS health_risk_assessments (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    ascvd_risk_pct NUMERIC(5, 2) NOT NULL,
    ascvd_category VARCHAR(100) NOT NULL,
    diabetes_risk_score INTEGER NOT NULL,
    diabetes_risk_level VARCHAR(100) NOT NULL,
    metabolic_syndrome BOOLEAN NOT NULL DEFAULT FALSE,
    metabolic_criteria_met INTEGER NOT NULL DEFAULT 0,
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lifestyle_recommendations (
    id VARCHAR(50) PRIMARY KEY,
    assessment_id VARCHAR(50) NOT NULL REFERENCES health_risk_assessments(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    recommendation_text TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'org_clinical_default',
    action VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACCEPTED',
    tracking_id VARCHAR(100) UNIQUE NOT NULL,
    patient_id VARCHAR(50) REFERENCES patients(id),
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ephi_access_audit_log (
    id VARCHAR(50) PRIMARY KEY,
    actor_id VARCHAR(50) NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    client_ip VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & query optimization
CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(mrn);
CREATE INDEX IF NOT EXISTS idx_biometrics_patient ON biometric_observations(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_patient ON health_risk_assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON ephi_access_audit_log(timestamp);
