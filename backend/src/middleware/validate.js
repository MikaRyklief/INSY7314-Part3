export const validateBody = (validatorFn) => (req, res, next) => {
  const errors = validatorFn(req.body);
  if (errors.length > 0) {
    res.status(400).json({ status: 'error', errors });
    return;
  }
  next();
};
