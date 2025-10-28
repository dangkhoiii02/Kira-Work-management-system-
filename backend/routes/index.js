const express = require('express');
const router = express.Router();

router.get('/healthz', (_req, res) => res.json({ status: 'ok' }));
router.use('/auth', require('./auth'));
router.use('/tasks', require('./tasks'));

module.exports = router;
