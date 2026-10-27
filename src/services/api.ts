import { User, Patient, PatientDetail, RiskProfile, TransactionPayload, TransactionResponse, AuditLog } from '../types';

const API_BASE = '/api/v1';

// In-memory token holder to prevent storing in localStorage (Zero-ePHI & Security Rule)
let memoryToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  memoryToken = token;
};

export const getAuthToken = () => memoryToken;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (memoryToken) {
    headers.set('Authorization', `Bearer ${memoryToken}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Health
  checkHealth: () => fetch('/health').then(r => r.json()),

  // Auth
  login: (credentials: { username: string; password?: string }) =>
    request<{ access_token: string; token_type: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => request<User>('/auth/me'),

  // Patients
  getPatients: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<Patient[]>(`/patients${query}`);
  },

  getPatientById: (id: string) => request<PatientDetail>(`/patients/${id}`),

  getRiskProfile: (id: string) => request<RiskProfile>(`/patients/${id}/risk-profile`),

  // Transactions
  submitTransaction: (payload: TransactionPayload, idempotencyKey?: string) => {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    return request<TransactionResponse>('/transactions', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  },

  // Audit Logs
  getAuditLogs: () => request<AuditLog[]>('/audit/logs'),
};
