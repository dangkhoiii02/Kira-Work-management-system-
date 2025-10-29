const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { exec } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';
const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

function signJWT(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

exports.register = async ({ nick_name, email, username, password, avatar }) => {
  const passwordHash = await bcrypt.hash(password, ROUNDS);

  const r = await exec('dbo.sp_User_Register', {
    nick_name,
    email,
    username: username || null,
    password: passwordHash,
    avatar: avatar || null
  });

  const user = r.recordsets?.[0]?.[0];
  const project = r.recordsets?.[1]?.[0];

  const token = signJWT({ id: user.id, email: user.email, nick_name: user.nick_name });
  return { user, project, token };
};

exports.login = async ({ email, password }) => {
  // Gọi SP: recordsets[0] = user, recordsets[1] = projects (nếu có)
  const r = await exec('dbo.sp_User_Login', { Email: email, Password: password });

  // Lấy user
  const u = r?.recordsets?.[0]?.[0] || null;
  if (!u) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }

  // So khớp mật khẩu
  const ok = await bcrypt.compare(password || '', u.password || '');
  if (!ok) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }

  // Ẩn trường nhạy cảm
  delete u.password;

  // Lấy đúng 1 project (phần tử đầu), nếu không có -> null
  const project = r?.recordsets?.[1]?.[0] ?? null;

  // Tạo token
  const token = signJWT({ id: u.id, email: u.email, nick_name: u.nick_name });

  return { user: u, project, token };
};

