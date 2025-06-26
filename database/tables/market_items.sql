-- Table: market_items
-- Description: Stores market items available for purchase, their price, rarity, and realm association.

CREATE TABLE IF NOT EXISTS market_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique item identifier
    item_name TEXT NOT NULL UNIQUE,                -- Item name, must be unique
    price NUMERIC(10,2) NOT NULL CHECK (price > 0),-- Item price, positive value
    rarity TEXT NOT NULL CHECK (
        rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')
    ),                                             -- Rarity type
    realm_id TEXT NOT NULL,                        -- Realm association (consider UUID if possible)
    created_at TIMESTAMPTZ DEFAULT now()           -- Timestamp of creation
    -- ,FOREIGN KEY (realm_id) REFERENCES realms(id) ON DELETE CASCADE -- Uncomment if realms table exists
);

COMMENT ON TABLE market_items IS 'Items available in the market for players to purchase.';
COMMENT ON COLUMN market_items.item_name IS 'The unique name of the market item.';
COMMENT ON COLUMN market_items.price IS 'The purchase price of the item.';
COMMENT ON COLUMN market_items.rarity IS 'The rarity category of the item.';
COMMENT ON COLUMN market_items.realm_id IS 'Realm this item belongs to.';

-- Seed data
INSERT INTO market_items (item_name, price, rarity, realm_id)
VALUES
    ('Quantum Axe', 5.00, 'rare', 'market'),
    ('Photon Cloak', 7.00, 'epic', 'market'),
    ('Synth Blade', 3.00, 'uncommon', 'market')
ON CONFLICT (item_name) DO NOTHING; -- Prevent duplicate seeds
