// backend/db.js

const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'development';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'palaceofquests',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 5432,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 12, // Adjust pool size as needed
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  if (!isProduction) {
    console.log('[DB] Connected');
  }
});
pool.on('error', err => {
  console.error('[DB] Pool error:', err);
  process.exit(1);
});

const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error(`[DB] Query error:`, err);
    throw err;
  }
};

// Graceful shutdown
const shutdown = () => {
  pool.end(() => {
    console.log('[DB] Pool has ended');
  });
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = { query, pool };
