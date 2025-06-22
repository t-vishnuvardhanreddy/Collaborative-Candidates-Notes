const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'my_app',   
  password: 'tiger',    
  port: 5432,
});

module.exports = pool;
