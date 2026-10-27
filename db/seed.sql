-- Baseline Seed Data for Health Risk Analysis Platform

-- Clinician Users
INSERT INTO users (id, name, email, password_hash, role, department)
VALUES
('usr-01', 'Dr. Sarah Jenkins, MD', 'clinician@healthrisk.org', 'pbkdf2:sha256:default_hash_operator', 'Operator', 'Cardiology'),
('usr-02', 'Dr. Alan Morales, MD', 'morales@healthrisk.org', 'pbkdf2:sha256:default_hash_clinician', 'Clinician', 'Endocrinology')
ON CONFLICT (id) DO NOTHING;

-- Patients
INSERT INTO patients (id, mrn, first_name, last_name, birth_date, gender)
VALUES
('pat-101', 'MRN-849201', 'Eleanor', 'Vance', '1968-04-12', 'Female'),
('pat-102', 'MRN-391823', 'Marcus', 'Holloway', '1980-09-25', 'Male'),
('pat-103', 'MRN-512948', 'David', 'Kim', '1959-11-03', 'Male'),
('pat-104', 'MRN-723104', 'Maria', 'Santos', '1974-02-18', 'Female')
ON CONFLICT (id) DO NOTHING;

-- Biometric Observations
INSERT INTO biometric_observations (id, patient_id, systolic_bp, diastolic_bp, total_cholesterol, hdl_cholesterol, ldl_cholesterol, fasting_glucose, hba1c, bmi, smoker, on_hypertension_meds)
VALUES
('bio-101', 'pat-101', 142, 88, 224, 42, 148, 118, 6.2, 29.4, FALSE, TRUE),
('bio-102', 'pat-102', 124, 78, 182, 54, 110, 92, 5.4, 24.8, FALSE, FALSE),
('bio-103', 'pat-103', 156, 94, 252, 38, 172, 134, 7.1, 31.2, TRUE, TRUE),
('bio-104', 'pat-104', 130, 82, 198, 48, 126, 104, 5.8, 27.1, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Health Risk Assessments
INSERT INTO health_risk_assessments (id, patient_id, ascvd_risk_pct, ascvd_category, diabetes_risk_score, diabetes_risk_level, metabolic_syndrome, metabolic_criteria_met)
VALUES
('hra-101', 'pat-101', 14.2, 'Borderline / Intermediate', 5, 'High (Prediabetes)', TRUE, 3),
('hra-102', 'pat-102', 4.1, 'Low Risk (< 5%)', 2, 'Low Risk', FALSE, 1),
('hra-103', 'pat-103', 24.8, 'High Risk (>= 20%)', 8, 'Very High Risk (Diabetes)', TRUE, 4),
('hra-104', 'pat-104', 7.4, 'Borderline (5% - 7.4%)', 4, 'Moderate Risk', FALSE, 2)
ON CONFLICT (id) DO NOTHING;

-- Lifestyle Recommendations
INSERT INTO lifestyle_recommendations (id, assessment_id, category, recommendation_text, priority)
VALUES
('rec-101', 'hra-101', 'Diet & Nutrition', 'Adopt Mediterranean / DASH dietary pattern with sodium < 1,500mg/day to lower systolic pressure.', 'High'),
('rec-102', 'hra-101', 'Physical Activity', 'Engage in 150 min/week moderate-intensity aerobic physical activity plus 2 sessions resistance training.', 'High'),
('rec-103', 'hra-101', 'Clinical Follow-up', 'Schedule lipid panel re-evaluation and fasting glucose test in 90 days.', 'Medium'),
('rec-104', 'hra-103', 'Medication & Therapy', 'Initiate high-intensity statin therapy and evaluate metformin therapy for glycemic control.', 'High'),
('rec-105', 'hra-103', 'Smoking Cessation', 'Enroll in clinical nicotine replacement and behavioral counseling program immediately.', 'High')
ON CONFLICT (id) DO NOTHING;
