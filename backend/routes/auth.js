// routes/auth.js
const expressLib = require('express');
const express = expressLib.default || expressLib;   // ✅
const router = express.Router();                     // ✅

const z = require('zod');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/auth.controller');

const registerSchema = z.object({
  body: z.object({
    nick_name: z.string().min(1),
    email: z.string().email(),
    username: z.string().optional(),
    password: z.string().min(6),
    avatar: z.string().optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});

router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);
router.post('/logout', ctrl.logout);

module.exports = router;
