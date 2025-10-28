require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { query, initDB } = require('./config/db');

async function runSqlFile(rel) {
  const p = path.join(process.cwd(), rel);
  const text = fs.readFileSync(p, 'utf8');
  const batches = text.split(/^\s*GO\s*$/gim);
  for (const b of batches) {
    const t = b.trim();
    if (t) await query(t);
  }
  console.log('✅ Ran', rel);
}

(async () => {
  await initDB();
  const files = [
    'migrations/001_schema.sql',
    'migrations/002_seed.sql',
    'migrations/101_sp_task_create.sql',
    'migrations/102_sp_task_assign.sql',
    'migrations/103_sp_task_update_progress.sql',
    'migrations/104_sp_task_get_detail.sql',
    'migrations/105_sp_task_list_by_project.sql',
    'migrations/201_sp_user_register.sql',
    'migrations/202_sp_user_get_by_email.sql',
    'migrations/203_sp_user_get_or_create_by_email.sql' // nếu bạn đã thêm file này
  ];
  for (const f of files) await runSqlFile(f);
  console.log('🎉 Migrations done');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
