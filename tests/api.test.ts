import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server/app';
import { db } from '../server/db';

describe('Health Risk Clinical Portal API Suite', () => {
  beforeEach(() => {
    // Reset any state if necessary
  });

  it('GET /health returns 200 OK and healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('POST /api/v1/auth/login authenticates clinician and returns JWT token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'clinician@healthrisk.org', passcode: 'sample_oauth2_token' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body.user).toHaveProperty('role', 'Operator');
  });

  it('GET /api/v1/patients lists cohort and filters by search term', async () => {
    const res = await request(app).get('/api/v1/patients');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const searchRes = await request(app).get('/api/v1/patients?search=Eleanor');
    expect(searchRes.status).toBe(200);
    expect(searchRes.body[0].name).toContain('Eleanor');
  });

  it('GET /api/v1/patients/:id returns patient details and triggers access audit log', async () => {
    const initialAuditCount = db.auditLogs.length;

    const res = await request(app).get('/api/v1/patients/pat-101');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('pat-101');
    expect(res.body.biometrics).toHaveProperty('systolic_bp', 142);

    // Verify audit log entry was created (AC-5)
    expect(db.auditLogs.length).toBe(initialAuditCount + 1);
    expect(db.auditLogs[0].action).toBe('VIEW_PATIENT_RECORD');
    expect(db.auditLogs[0].resource).toContain('pat-101');
  });

  it('GET /api/v1/patients/:id/risk-profile returns ASCVD, Diabetes, and Metabolic Syndrome scores', async () => {
    const res = await request(app).get('/api/v1/patients/pat-101/risk-profile');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ascvd');
    expect(res.body.ascvd).toHaveProperty('ten_year_risk_pct', 14.2);
    expect(res.body).toHaveProperty('diabetes');
    expect(res.body.diabetes).toHaveProperty('risk_score', 5);
    expect(res.body).toHaveProperty('metabolic_syndrome');
    expect(res.body.metabolic_syndrome).toHaveProperty('diagnosed', true);
    expect(res.body.recommendations.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/audit/logs returns compliance audit trail', async () => {
    const res = await request(app).get('/api/v1/audit/logs');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
