import { Router } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/rbac';

const router = Router();

// GET /api/v1/patients — Search and list patients (REQ-F-001, AC-2)
router.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const search = (req.query.search as string || '').toLowerCase().trim();

  let results = db.patients.map((p) => {
    const birthYear = new Date(p.birth_date).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    return {
      id: p.id,
      mrn: p.mrn,
      name: `${p.first_name} ${p.last_name}`,
      age,
      gender: p.gender,
      birth_date: p.birth_date,
      ascvd_risk_pct: p.assessment.ascvd_risk_pct,
      diabetes_risk_tier: p.assessment.diabetes_risk_level,
      metabolic_syndrome: p.assessment.metabolic_syndrome,
      last_assessed: '2026-10-27',
    };
  });

  if (search) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.mrn.toLowerCase().includes(search) ||
        p.diabetes_risk_tier.toLowerCase().includes(search)
    );
  }

  return res.status(200).json(results);
});

// GET /api/v1/patients/:id — View single patient record (Triggers Audit Log - AC-5, REQ-F-002)
router.get('/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const patient = db.patients.find((p) => p.id === req.params.id);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  // Trigger Audit Transaction for viewing ePHI record (AC-5 Requirement)
  const actor = req.user ? `${req.user.name} (${req.user.id})` : 'Clinician Session';
  db.addAuditLog(
    actor,
    'VIEW_PATIENT_RECORD',
    `Patient: ${patient.first_name} ${patient.last_name} (${patient.id}, ${patient.mrn})`,
    req.ip || '127.0.0.1'
  );

  const birthYear = new Date(patient.birth_date).getFullYear();
  const age = new Date().getFullYear() - birthYear;

  return res.status(200).json({
    id: patient.id,
    mrn: patient.mrn,
    name: `${patient.first_name} ${patient.last_name}`,
    age,
    gender: patient.gender,
    birth_date: patient.birth_date,
    biometrics: patient.biometrics,
  });
});

// GET /api/v1/patients/:id/risk-profile — Multi-model risk calculations & Lifestyle recommendations (AC-3, REQ-F-003, REQ-F-004)
router.get('/:id/risk-profile', requireAuth, (req: AuthenticatedRequest, res) => {
  const patient = db.patients.find((p) => p.id === req.params.id);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  return res.status(200).json({
    patient_id: patient.id,
    patient_name: `${patient.first_name} ${patient.last_name}`,
    ascvd: {
      ten_year_risk_pct: patient.assessment.ascvd_risk_pct,
      risk_category: patient.assessment.ascvd_category,
      target_ldl: patient.assessment.ascvd_risk_pct >= 20 ? '< 70 mg/dL' : '< 100 mg/dL',
    },
    diabetes: {
      risk_score: patient.assessment.diabetes_risk_score,
      max_score: 10,
      risk_level: patient.assessment.diabetes_risk_level,
    },
    metabolic_syndrome: {
      criteria_met: patient.assessment.metabolic_criteria_met,
      threshold: 3,
      diagnosed: patient.assessment.metabolic_syndrome,
      factors: patient.assessment.factors,
    },
    recommendations: patient.recommendations,
  });
});

export default router;
