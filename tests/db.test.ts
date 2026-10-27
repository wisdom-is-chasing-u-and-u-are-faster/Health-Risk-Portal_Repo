import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Database Schema & Seed Infrastructure Suite', () => {
  it('validates db/schema.sql contains mandatory HIPAA & clinical entities', () => {
    const schemaPath = path.resolve(__dirname, '../db/schema.sql');
    expect(fs.existsSync(schemaPath)).toBe(true);

    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS users');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS patients');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS biometric_observations');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS health_risk_assessments');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS lifestyle_recommendations');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS transactions');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS ephi_access_audit_log');
  });

  it('validates db/seed.sql contains baseline clinical cohorts and recommendations', () => {
    const seedPath = path.resolve(__dirname, '../db/seed.sql');
    expect(fs.existsSync(seedPath)).toBe(true);

    const seedContent = fs.readFileSync(seedPath, 'utf-8');
    expect(seedContent).toContain('Dr. Sarah Jenkins, MD');
    expect(seedContent).toContain('Eleanor');
    expect(seedContent).toContain('Vance');
    expect(seedContent).toContain('Diet & Nutrition');
  });
});
