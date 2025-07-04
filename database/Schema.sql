-- users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- inventory
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  item_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  rarity TEXT,
  icon TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- payments
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  payment_id TEXT UNIQUE NOT NULL,
  txid TEXT,
  amount NUMERIC NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  memo TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
