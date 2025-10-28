module.exports = (err, _req, res, _next) => {
  const status = err.status || 500;
  console.error('💥', status, err.message);
  res.status(status).json({ status, message: err.message, details: err.details });
};
