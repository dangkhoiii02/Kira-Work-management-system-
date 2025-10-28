// routes/tasks.js
const expressLib = require('express');
const express = expressLib.default || expressLib;   // ✅
const router = express.Router();                     // ✅

const z = require('zod');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const ctr = require('../controllers/tasks.controller');

// Create task
const createSchema = z.object({
  body: z.object({
    project_id: z.coerce.number().int().positive(),
    title: z.string().min(1),
    description: z.string().optional(),
    status_id: z.coerce.number().int().positive(),
    priority_id: z.coerce.number().int().positive().optional(),
    assignee_id: z.coerce.number().int().positive().optional(),
    start_date: z.string().optional(),
    due_date: z.string().optional(),
    creator_id: z.coerce.number().int().positive(),
    labels: z.array(z.number().int().positive()).optional()
  })
});
router.post('/', requireAuth, validate(createSchema), ctr.create);

// Assign by user id (có sẵn)
const assignSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({ assignee_id: z.coerce.number().int().positive() })
});
router.post('/:id/assign', requireAuth, validate(assignSchema), ctr.assign);

// Assign by email (mới)
const assignByEmailSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({ email: z.string().email() })
});
router.post('/:id/assign-email', requireAuth, validate(assignByEmailSchema), ctr.assignByEmail);

// Update progress
const progressSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({ percent_done: z.coerce.number().int().min(0).max(100) })
});
router.patch('/:id/progress', requireAuth, validate(progressSchema), ctr.updateProgress);

// Detail
const detailSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() })
});
router.get('/:id', requireAuth, validate(detailSchema), ctr.getDetail);

// List by project
const listSchema = z.object({
  params: z.object({ project_id: z.coerce.number().int().positive() }),
  query: z.object({
    q: z.string().optional(),
    status_id: z.coerce.number().int().positive().optional().nullable(),
    priority_id: z.coerce.number().int().positive().optional().nullable(),
    assignee_id: z.coerce.number().int().positive().optional().nullable(),
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().default(20)
  })
});
router.get('/project/:project_id', requireAuth, validate(listSchema), ctr.listByProject);

module.exports = router;
