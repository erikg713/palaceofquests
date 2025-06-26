-- Create table with additional constraints and comments
CREATE TABLE market_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name text NOT NULL UNIQUE,
    price numeric NOT NULL CHECK (price > 0),
    rarity text NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    realm_id text NOT NULL,
    CONSTRAINT fk_realm FOREIGN KEY (realm_id) REFERENCES realms(id) ON DELETE CASCADE
);

-- Add comments
COMMENT ON TABLE market_items IS 'Stores items available in the market';
COMMENT ON COLUMN market_items.item_name IS 'Name of the item';
COMMENT ON COLUMN market_items.price IS 'Price of the item';
COMMENT ON COLUMN market_items.rarity IS 'Rarity level of the item';
COMMENT ON COLUMN market_items.realm_id IS 'ID of the associated realm';

-- Insert initial data
INSERT INTO market_items (item_name, price, rarity, realm_id)
VALUES
    ('Quantum Axe', 5, 'rare', 'market'),
    ('Photon Cloak', 7, 'epic', 'market'),
    ('Synth Blade', 3, 'uncommon', 'market');
