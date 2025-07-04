// backend/db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'palaceofquests',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 5432,
  ssl: false, // No SSL for development
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('[DB] Connected (development)');
});

pool.on('error', err => {
  console.error('[DB] Pool error:', err);
});

async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('[DB] Query error:', err);
    throw err;
  }
}

// Graceful shutdown (handy even during dev server restarts)
function shutdown() {
  pool.end(() => {
    console.log('[DB] Pool closed');
  });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = { query, pool };
