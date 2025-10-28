const { exec } = require('../config/db');

exports.create = async (req, res, next) => {
  try {
    const b = req.valid.body;
    const labelsCsv = (b.labels || []).join(',');
    const r = await exec('dbo.sp_Task_Create', {
      project_id: b.project_id,
      title: b.title,
      description: b.description || null,
      status_id: b.status_id,
      priority_id: b.priority_id || null,
      assignee_id: b.assignee_id || null,
      start_date: b.start_date || null,
      due_date: b.due_date || null,
      creator_id: b.creator_id,
      labels_csv: labelsCsv || null
    });
    res.status(201).json(r.recordset[0]);
  } catch (e) { next(e); }
};

exports.assign = async (req, res, next) => {
  try {
    const { id } = req.valid.params;
    const { assignee_id } = req.valid.body;
    const r = await exec('dbo.sp_Task_Assign', { task_id: id, assignee_id });
    res.json(r.recordset[0]);
  } catch (e) { next(e); }
};

exports.assignByEmail = async (req, res, next) => {
  try {
    const { id } = req.valid.params;
    const { email } = req.valid.body;
    const u = await exec('dbo.sp_User_GetByEmail', { email });
    const user = u.recordset?.[0];
    if (!user) return res.status(404).json({ status: 404, message: 'User not found for given email' });
    const r = await exec('dbo.sp_Task_Assign', { task_id: id, assignee_id: user.id });
    res.json({
      assigned: r.recordset?.[0] || {},
      assignee: { id: user.id, nick_name: user.nick_name, email: user.email }
    });
  } catch (e) { next(e); }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const { id } = req.valid.params;
    const { percent_done } = req.valid.body;
    const r = await exec('dbo.sp_Task_UpdateProgress', { task_id: id, percent_done });
    res.json(r.recordset[0]);
  } catch (e) { next(e); }
};

exports.getDetail = async (req, res, next) => {
  try {
    const { id } = req.valid.params;
    const r = await exec('dbo.sp_Task_GetDetail', { task_id: id });
    res.json({
      task: r.recordsets[0]?.[0] || null,
      labels: r.recordsets[1] || [],
      attachments: r.recordsets[2] || [],
      comments: r.recordsets[3] || []
    });
  } catch (e) { next(e); }
};

exports.listByProject = async (req, res, next) => {
  try {
    const { project_id } = req.valid.params;
    const q = req.valid.query;
    const r = await exec('dbo.sp_Task_ListByProject', {
      project_id,
      q: q.q || '',
      status_id: q.status_id ?? null,
      priority_id: q.priority_id ?? null,
      assignee_id: q.assignee_id ?? null,
      page: q.page,
      page_size: q.page_size
    });
    res.json({ items: r.recordsets[0], pageInfo: r.recordsets[1]?.[0] || { total: 0 } });
  } catch (e) { next(e); }
};
