const sql = require('mssql');

const config = {
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'OOAD',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASS || 'YourStrong!Passw0rd',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  options: {
    encrypt: true,
    trustServerCertificate: String(process.env.DB_TRUST_CERT || 'true').toLowerCase() === 'true',
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  }
};

let pool;

async function initDB() {
  if (pool) return pool;
  pool = await sql.connect(config);
  console.log(`✅ DB connected: ${config.server} ${config.database}`);
  return pool;
}

async function query(text, params = {}) {
  const p = await initDB();
  const req = p.request();
  for (const [k, v] of Object.entries(params)) req.input(k, v);
  return req.query(text);
}

async function exec(sp, params = {}) {
  const p = await initDB();
  const req = p.request();
  for (const [k, v] of Object.entries(params)) req.input(k, v);
  return req.execute(sp);
}

module.exports = { initDB, query, exec };
