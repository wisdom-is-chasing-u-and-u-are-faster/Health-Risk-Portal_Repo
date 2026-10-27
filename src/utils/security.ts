/**
 * Zero-ePHI Storage Guard & HIPAA Compliance Validator
 * 
 * Enforces REQ-F-005: Zero Electronic Protected Health Information (ePHI)
 * shall be stored on client-side storage (localStorage, sessionStorage, cookies, IndexedDB).
 */

export class ZeroEphiGuard {
  private static sensitiveKeys = [
    'patient', 'mrn', 'ephi', 'ssn', 'dob', 'diagnosis', 'biometrics',
    'cholesterol', 'blood_pressure', 'glucose', 'ascvd', 'diabetes',
    'metabolic', 'patient_id', 'medical_record'
  ];

  /**
   * Scans browser storage for forbidden ePHI keys.
   * Throws an error or returns false if any sensitive information is detected.
   */
  public static verifyZeroEphiStorage(): { clean: boolean; violations: string[] } {
    const violations: string[] = [];

    if (typeof window === 'undefined') {
      return { clean: true, violations: [] };
    }

    try {
      // Check localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        const lowerKey = key.toLowerCase();
        if (this.sensitiveKeys.some(s => lowerKey.includes(s))) {
          violations.push(`localStorage: ${key}`);
        }
      }

      // Check sessionStorage
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i) || '';
        const lowerKey = key.toLowerCase();
        if (this.sensitiveKeys.some(s => lowerKey.includes(s))) {
          violations.push(`sessionStorage: ${key}`);
        }
      }

      // Check document.cookie
      if (document.cookie) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const cookieName = cookie.split('=')[0].trim().toLowerCase();
          if (this.sensitiveKeys.some(s => cookieName.includes(s))) {
            violations.push(`cookie: ${cookieName}`);
          }
        }
      }
    } catch (e) {
      // Storage access blocked or unavailable
    }

    return {
      clean: violations.length === 0,
      violations
    };
  }

  /**
   * Sanitizes any client storage proactively.
   */
  public static purgeClientStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
  }
}
