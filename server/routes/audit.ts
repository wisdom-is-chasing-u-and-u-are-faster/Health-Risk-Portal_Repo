import { Router } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/rbac';

const router = Router();

// GET /api/v1/audit/logs — Retrieve immutable HIPAA access and transaction audit trail (REQ-F-005, CONSTRAINT-005)
router.get('/logs', requireAuth, (req: AuthenticatedRequest, res) => {
  return res.status(200).json(db.auditLogs);
});

export default router;
