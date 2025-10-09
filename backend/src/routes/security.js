import express from 'express';
import { csrfProtection, respondWithCsrfToken } from '../middleware/csrf.js';

const router = express.Router();

router.get('/csrf-token', csrfProtection, respondWithCsrfToken);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API healthy.' });
});

export default router;
