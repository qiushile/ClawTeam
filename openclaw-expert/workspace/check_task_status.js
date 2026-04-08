const { Pool } = require('pg');

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1
  });
  
  try {
    // Check status of tasks mentioned in messages
    const tasksResult = await pool.query(`
      SELECT id, title, status, priority, requester, assignee, result, created_at, updated_at
      FROM shared.tasks 
      WHERE id IN (15, 33, 48)
      ORDER BY id;
    `);
    
    console.log('=== Status of tasks #15, #33, #48 ===');
    console.log(JSON.stringify(tasksResult.rows, null, 2));
    
    // Mark messages as read
    await pool.query(`
      UPDATE shared.inter_agent_messages 
      SET is_read = true 
      WHERE to_agent = 'expert_user' OR to_agent IS NULL;
    `);
    console.log('\n=== All messages marked as read ===');
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await pool.end();
  }
}

main();