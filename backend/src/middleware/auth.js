import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.session;
  if (!token) {
    res.status(401).json({ status: 'error', message: 'Authentication required.' });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = {
      id: payload.sub,
      fullName: payload.fullName,
      accountNumber: payload.accountNumber
    };
    next();
  } catch (err) {
    res.status(401).json({ status: 'error', message: 'Invalid or expired session.' });
  }
};
