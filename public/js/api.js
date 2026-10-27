// Clinical Portal Public JS API Client
const API_BASE = '/api/v1';

window.ClinicalAPI = {
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  async getPatients(search = '') {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`${API_BASE}/patients${query}`);
    return res.json();
  },

  async getPatientDetails(id) {
    const res = await fetch(`${API_BASE}/patients/${id}`);
    return res.json();
  },

  async getRiskProfile(id) {
    const res = await fetch(`${API_BASE}/patients/${id}/risk-profile`);
    return res.json();
  },

  async submitTransaction(payload, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/audit/logs`);
    return res.json();
  },
};
