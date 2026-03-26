const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkTasks() {
  try {
    // Check IN_PROGRESS tasks for project_user
    const result = await pool.query(`
      SELECT id, title, assignee, requester, status, created_at, updated_at, result
      FROM shared.tasks 
      WHERE assignee = 'project_user' AND status = 'IN_PROGRESS' 
      ORDER BY created_at
    `);
    
    console.log('=== IN_PROGRESS tasks for project_user ===');
    if (result.rows.length === 0) {
      console.log('No IN_PROGRESS tasks found.');
    } else {
      result.rows.forEach(row => {
        console.log(`ID: ${row.id}`);
        console.log(`Title: ${row.title}`);
        console.log(`Requester: ${row.requester}`);
        console.log(`Created: ${row.created_at}`);
        console.log(`Updated: ${row.updated_at}`);
        console.log(`Result: ${row.result || 'N/A'}`);
        console.log('---');
      });
    }
    
    // Also check for any tasks where project_user is the requester waiting on others
    const waitingResult = await pool.query(`
      SELECT id, title, assignee, requester, status, created_at, updated_at
      FROM shared.tasks 
      WHERE requester = 'project_user' AND status = 'IN_PROGRESS' 
      ORDER BY created_at
    `);
    
    console.log('\n=== Tasks where project_user is waiting on others ===');
    if (waitingResult.rows.length === 0) {
      console.log('No pending tasks found.');
    } else {
      waitingResult.rows.forEach(row => {
        console.log(`ID: ${row.id}`);
        console.log(`Title: ${row.title}`);
        console.log(`Waiting on: ${row.assignee}`);
        console.log(`Created: ${row.created_at}`);
        console.log('---');
      });
    }
    
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    await pool.end();
  }
}

checkTasks();
