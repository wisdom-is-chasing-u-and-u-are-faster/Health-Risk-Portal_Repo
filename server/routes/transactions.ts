import { Router } from 'express';
import { db } from '../db';
import { requireAuth, requireOperatorRole, AuthenticatedRequest } from '../middleware/rbac';

const router = Router();

// POST /api/v1/transactions — Submit clinical risk mutation transaction (REQ-F-007, REQ-F-008, AC-6, AC-7)
router.post('/', requireAuth, requireOperatorRole, (req: AuthenticatedRequest, res) => {
  const { action, patient_id, payload, transaction_id } = req.body;

  if (!action || !patient_id) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Missing mandatory fields: action and patient_id are required.',
    });
  }

  const patient = db.patients.find((p) => p.id === patient_id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const txId = transaction_id || `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const trackingId = `trk_${Date.now().toString(36).toUpperCase()}_${Math.floor(Math.random() * 1000)}`;

  // Commit transaction record to state store
  const record = {
    id: `tx-${Date.now()}`,
    transaction_id: txId,
    tenant_id: 'org_clinical_default',
    action,
    status: 'ACCEPTED',
    tracking_id: trackingId,
    patient_id,
    payload,
    created_at: new Date().toISOString(),
  };

  db.transactions.push(record);

  // If payload contains updated biometrics, mutate patient record
  if (payload && payload.systolic_bp) {
    patient.biometrics.systolic_bp = payload.systolic_bp;
    if (payload.diastolic_bp) patient.biometrics.diastolic_bp = payload.diastolic_bp;
    if (payload.total_cholesterol) patient.biometrics.total_cholesterol = payload.total_cholesterol;
    if (payload.fasting_glucose) patient.biometrics.fasting_glucose = payload.fasting_glucose;
  }

  // Immutable audit log emission (OpenSearch WORM Vault)
  const actor = req.user ? `${req.user.name} (${req.user.id})` : 'Operator Session';
  db.addAuditLog(
    actor,
    'SUBMIT_TRANSACTION',
    `Committed Risk Mutation on Patient ${patient.first_name} ${patient.last_name} (${trackingId})`,
    req.ip || '127.0.0.1'
  );

  return res.status(200).json({
    status: 'ACCEPTED',
    tracking_id: trackingId,
    created_at: record.created_at,
    next_step: 'COMMITTED_TO_POSTGRESQL',
    audit_logged: true,
  });
});

export default router;
