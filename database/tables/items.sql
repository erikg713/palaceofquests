CREATE TABLE IF NOT EXISTS items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup by name (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS items_name_idx ON items (LOWER(name));

-- Sample items
INSERT INTO items (id, name, description)
VALUES
    ('d1e1a9b2-5b6a-4f6e-9c9c-1f8a2dc1eabc', 'Sword of Dawn', 'A legendary sword that shines at sunrise.'),
    ('e2e2b3c4-7d8e-4f7e-9e9d-2a9b3ce2fabd', 'Emerald Amulet', 'An amulet said to bring luck to its bearer.');
