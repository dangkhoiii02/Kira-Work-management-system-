const svc = require('../services/auth.service');

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const cookieOpts = {
  httpOnly: true,
  secure: false,      // true nếu chạy HTTPS
  sameSite: 'lax',
  maxAge: ONE_WEEK_MS,
  path: '/',
};

exports.register = async (req, res, next) => {
  try {
    const { user, project, token } = await svc.register(req.valid.body);
    res.cookie('token', token, cookieOpts);
    res.status(201).json({ user, project });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { token, user } = await svc.login(req.valid.body);
    res.cookie('token', token, cookieOpts);
    res.json({ user });
  } catch (e) { next(e); }
};

exports.logout = async (_req, res, _next) => {
  res.clearCookie('token', { ...cookieOpts, maxAge: 0 });
  res.json({ ok: true });
};
