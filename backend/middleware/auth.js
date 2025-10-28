const jwt = require('jsonwebtoken');

function getToken(req) {
  if (req.cookies && req.cookies.token) return req.cookies.token;
  const h = req.headers.authorization || '';
  if (h.startsWith('Bearer ')) return h.slice(7);
  return null;
}

exports.requireAuth = (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: 'Missing token' });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.attachUserIfAny = (req, _res, next) => {
  try {
    const token = getToken(req);
    if (token) req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {}
  next();
};
