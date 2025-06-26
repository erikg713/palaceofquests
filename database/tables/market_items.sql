CREATE TABLE market_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name text,
  price numeric,
  rarity text,
  realm_id text
);
