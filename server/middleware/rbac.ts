import { Request, Response, NextFunction } from 'express';
import { db } from '../db';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'Clinician' | 'Operator';
  };
}

/**
 * Authentication Middleware: Extracts bearer token or simulated clinician context
 */
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // For local/demo testing, if no header provide default clinician
    req.user = db.users[0]; // Dr. Sarah Jenkins (Operator)
    return next();
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  // Check if token matches operator or clinician
  if (token.includes('clinician') || token === 'valid_clinician_token') {
    req.user = db.users[1]; // Dr. Alan Morales (Clinician role)
  } else {
    req.user = db.users[0]; // Dr. Sarah Jenkins (Operator role)
  }

  next();
};

/**
 * Operator RBAC Enforcement Middleware: Required by REQ-F-007
 * "Users must have an 'Operator' role to submit transactions."
 */
export const requireOperatorRole = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;

  if (userRole !== 'Operator') {
    return res.status(403).json({
      error: 'Forbidden',
      message: "Insufficient Privileges: Users must possess an 'Operator' role to submit mutating transactions (REQ-F-007).",
      required_role: 'Operator',
      current_role: userRole || 'Anonymous',
    });
  }

  next();
};
