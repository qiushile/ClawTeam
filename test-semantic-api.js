const pg = require('pg');

async function run() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const res = await pool.query('SELECT current_user, current_schema;');
    console.log('Connected as:', res.rows[0]);

    // Test heartbeat
    await pool.query(
      `INSERT INTO shared.agent_heartbeats (db_username, status, current_task_id, last_seen_at) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (db_username) DO UPDATE SET status = EXCLUDED.status, last_seen_at = CURRENT_TIMESTAMP`,
       ['orchestrator_user', 'online', null]
    );
    console.log('Heartbeat recorded.');

    // Test lookup
    const depts = await pool.query('SELECT * FROM shared.department_registry WHERE code = $1', ['dev']);
    console.log('Dev department found:', depts.rows[0].db_username);

    // Test create task
    const taskRes = await pool.query(
      `INSERT INTO shared.tasks (title, description, assignee, requester, priority, tags) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, status`,
       ['Test semantic APIs', 'Testing the DB rewrite', 'dev_user', 'orchestrator_user', 'P1', ['test', 'db']]
    );
    console.log('Task created:', taskRes.rows[0]);

  } catch(e) {
    console.error('Test error:', e);
  } finally {
    await pool.end();
  }
}

run();
