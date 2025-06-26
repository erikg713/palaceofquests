CREATE TABLE IF NOT EXISTS items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup by name (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS items_name_idx ON items (LOWER(name));
