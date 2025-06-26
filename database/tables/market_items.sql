CREATE TABLE market_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name text,
  price numeric,
  rarity text,
  realm_id text
);

INSERT INTO market_items (item_name, price, rarity, realm_id)
VALUES
('Quantum Axe', 5, 'rare', 'market'),
('Photon Cloak', 7, 'epic', 'market'),
('Synth Blade', 3, 'uncommon', 'market');
