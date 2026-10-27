import { describe, it, expect, beforeEach } from 'vitest';
import { ZeroEphiGuard } from '../src/utils/security';

describe('Zero-ePHI Storage & HIPAA Compliance Security Suite (REQ-F-005, AC-4)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('verifies clean storage when no ePHI is stored', () => {
    const result = ZeroEphiGuard.verifyZeroEphiStorage();
    expect(result.clean).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('detects and flags forbidden ePHI stored in localStorage', () => {
    localStorage.setItem('patient_id', 'pat-101');
    const result = ZeroEphiGuard.verifyZeroEphiStorage();
    expect(result.clean).toBe(false);
    expect(result.violations.some((v) => v.includes('patient_id'))).toBe(true);
  });

  it('detects and flags forbidden biometrics stored in sessionStorage', () => {
    sessionStorage.setItem('ephi_cholesterol', '224');
    const result = ZeroEphiGuard.verifyZeroEphiStorage();
    expect(result.clean).toBe(false);
    expect(result.violations.some((v) => v.includes('ephi_cholesterol'))).toBe(true);
  });

  it('purges client storage cleanly', () => {
    localStorage.setItem('temp_data', 'test');
    sessionStorage.setItem('temp_session', 'test');
    ZeroEphiGuard.purgeClientStorage();

    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });
});
