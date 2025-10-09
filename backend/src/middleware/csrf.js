import csrf from 'csurf';
import { config } from '../config.js';

export const csrfProtection = csrf({
  cookie: {
    key: 'csrfSecret',
    httpOnly: true,
    sameSite: 'strict',
    secure: config.security.cookieSecure
  }
});

export const respondWithCsrfToken = (req, res) => {
  const token = req.csrfToken();
  res.cookie('csrfToken', token, {
    httpOnly: false,
    sameSite: 'strict',
    secure: config.security.cookieSecure
  });
  res.json({ status: 'ok', csrfToken: token });
};

export const handleCsrfErrors = (err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    next(err);
    return;
  }
  res.status(403).json({ status: 'error', message: 'Invalid CSRF token.' });
};
