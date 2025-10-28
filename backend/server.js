require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { initDB } = require('./config/db');
const routes = require('./routes');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api', routes);

app.use((_req, res) => res.status(404).json({ message: 'Not Found' }));

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ status, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3000;
(async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀 API listening on http://localhost:${PORT}`);
    console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? process.env.JWT_SECRET.slice(0,4) + '***' : 'missing');
  });
})();
