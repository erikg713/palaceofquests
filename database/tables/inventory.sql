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
