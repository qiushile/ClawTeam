const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function dailyCheck() {
  const client = await pool.connect();
  try {
    // Step 1: Query all unfinished tasks assigned to project_user
    const unfinishedResult = await client.query(`
      SELECT id, title, description, assignee, requester, status, created_at, updated_at, result
      FROM shared.tasks 
      WHERE assignee = 'project_user' AND status NOT IN ('COMPLETED', 'FAILED', 'CANCELLED') 
      ORDER BY created_at
    `);
    
    console.log('=== Unfinished tasks for project_user ===');
    if (unfinishedResult.rows.length === 0) {
      console.log('NO_TASKS');
    } else {
      const tasks = [];
      for (const row of unfinishedResult.rows) {
        tasks.push({
          id: row.id,
          title: row.title,
          status: row.status,
          created: row.created_at,
          updated: row.updated_at,
          result: row.result
        });
        console.log(`ID: ${row.id} | Status: ${row.status} | Title: ${row.title} | Created: ${row.created_at}`);
        
        // Step 2: Update PENDING tasks to IN_PROGRESS
        if (row.status === 'PENDING') {
          await client.query(`
            UPDATE shared.tasks 
            SET status = 'IN_PROGRESS', updated_at = NOW() 
            WHERE id = $1
          `, [row.id]);
          console.log(`  → Updated task ${row.id} from PENDING to IN_PROGRESS`);
        }
      }
      
      // Output JSON for further processing
      console.log('\nTASKS_JSON_START');
      console.log(JSON.stringify(tasks));
      console.log('TASKS_JSON_END');
    }
    
    // Also check tasks where project_user is waiting on others
    const waitingResult = await client.query(`
      SELECT id, title, assignee, requester, status, created_at, updated_at
      FROM shared.tasks 
      WHERE requester = 'project_user' AND status NOT IN ('COMPLETED', 'FAILED', 'CANCELLED') 
      ORDER BY created_at
    `);
    
    console.log('\n=== Tasks where project_user is waiting on others ===');
    if (waitingResult.rows.length === 0) {
      console.log('NO_WAITING_TASKS');
    } else {
      waitingResult.rows.forEach(row => {
        console.log(`ID: ${row.id} | Waiting on: ${row.assignee} | Status: ${row.status} | Title: ${row.title}`);
      });
    }
    
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

dailyCheck();
