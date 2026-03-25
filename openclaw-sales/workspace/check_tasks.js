const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

(async () => {
  try {
    const res = await pool.query(`
      SELECT id, title, status, priority, created_at
      FROM shared.tasks
      WHERE assignee = 'sales_user'
      AND status IN ('PENDING', 'IN_PROGRESS')
      ORDER BY created_at DESC
      LIMIT 10;
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
})();