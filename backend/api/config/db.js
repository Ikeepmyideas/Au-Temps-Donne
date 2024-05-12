const fs = require('fs');
const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;;
const pgClient = new Client({
  connectionString: connectionString,
});

pgClient.connect();

// Read SQL file
const sqlFilePath = path.join(__dirname, 'config', 'pa.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

// Execute SQL commands
pgClient.query(sql, (err, res) => {
  if (err) {
    console.error('Error executing SQL file:', err);
  } else {
    console.log('SQL file executed successfully.');
  }
  
  pgClient.end();
});
