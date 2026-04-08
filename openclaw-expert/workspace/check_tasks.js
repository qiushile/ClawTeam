// Quick script to check expert_user tasks
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1
  });
  
  try {
    // Check tasks assigned to expert_user
    const tasksResult = await pool.query(`
      SELECT id, title, status, priority, requester, assignee, created_at, result
      FROM shared.tasks 
      WHERE assignee = 'expert_user' AND status IN ('PENDING', 'IN_PROGRESS')
      ORDER BY created_at DESC
      LIMIT 10;
    `);
    
    console.log('=== Tasks assigned to expert_user (PENDING/IN_PROGRESS) ===');
    if (tasksResult.rows.length === 0) {
      console.log('No pending or in-progress tasks found.');
    } else {
      console.log(JSON.stringify(tasksResult.rows, null, 2));
    }
    
    // Check unread messages
    const messagesResult = await pool.query(`
      SELECT id, from_agent, msg_type, payload, created_at
      FROM shared.inter_agent_messages
      WHERE (to_agent = 'expert_user' OR to_agent IS NULL) AND is_read = false
      ORDER BY created_at ASC
      LIMIT 10;
    `);
    
    console.log('\n=== Unread messages for expert_user ===');
    if (messagesResult.rows.length === 0) {
      console.log('No unread messages.');
    } else {
      console.log(JSON.stringify(messagesResult.rows, null, 2));
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await pool.end();
  }
}

main();