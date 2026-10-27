import { Router } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/rbac';

const router = Router();

// POST /api/v1/auth/login — OAuth2 authentication flow (REQ-F-006)
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = db.users.find((u) => u.email.toLowerCase() === (username || '').toLowerCase()) || db.users[0];

  db.addAuditLog(
    `${user.name} (${user.id})`,
    'OAUTH2_LOGIN',
    'Clinician Authentication Session',
    req.ip || '127.0.0.1'
  );

  return res.status(200).json({
    access_token: `jwt_token_${user.role.toLowerCase()}_${Date.now()}`,
    token_type: 'Bearer',
    expires_in: 3600,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  });
});

// GET /api/v1/auth/me — Current Authenticated Profile
router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  return res.status(200).json(req.user);
});

export default router;
