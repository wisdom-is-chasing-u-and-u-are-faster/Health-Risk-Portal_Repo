import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server/app';

describe('Operator Role & RBAC Enforcement Suite', () => {
  it('POST /api/v1/transactions succeeds for Operator role (REQ-F-007, AC-6, AC-7)', async () => {
    const res = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', 'Bearer operator_token_sample')
      .send({
        action: 'SUBMIT_RISK_ASSESSMENT',
        patient_id: 'pat-101',
        payload: {
          systolic_bp: 138,
          diastolic_bp: 86,
          total_cholesterol: 210,
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ACCEPTED');
    expect(res.body).toHaveProperty('tracking_id');
    expect(res.body).toHaveProperty('audit_logged', true);
  });

  it('POST /api/v1/transactions rejects non-Operator clinicians with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', 'Bearer valid_clinician_token')
      .send({
        action: 'SUBMIT_RISK_ASSESSMENT',
        patient_id: 'pat-101',
        payload: {
          systolic_bp: 138,
        },
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden');
    expect(res.body.message).toContain('Operator');
  });

  it('POST /api/v1/transactions rejects requests missing mandatory fields with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', 'Bearer operator_token_sample')
      .send({
        // Missing action and patient_id
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bad Request');
  });
});
