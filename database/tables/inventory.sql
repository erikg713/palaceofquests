CREATE TABLE IF NOT EXISTS inventory (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    item_id     UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    realm_id    UUID NOT NULL REFERENCES realms(id) ON DELETE CASCADE,
    obtained_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient lookups
CREATE INDEX IF NOT EXISTS inventory_user_id_idx ON inventory (user_id);
CREATE INDEX IF NOT EXISTS inventory_item_id_idx ON inventory (item_id);
CREATE INDEX IF NOT EXISTS inventory_realm_id_idx ON inventory (realm_id);

-- Sample inventory records
INSERT INTO inventory (user_id, item_id, realm_id, obtained_at)
VALUES
    ('user-001', 'd1e1a9b2-5b6a-4f6e-9c9c-1f8a2dc1eabc', 'a1f4c8e2-7e3e-4b9d-a9e2-6b7c4f2d1ea3', '2025-06-01T10:45:00Z'),
    ('user-002', 'e2e2b3c4-7d8e-4f7e-9e9d-2a9b3ce2fabd', 'b2a9d3f5-6e2d-4c1f-b2e4-9d8c7a2b3f6e', '2025-06-15T14:30:00Z');
