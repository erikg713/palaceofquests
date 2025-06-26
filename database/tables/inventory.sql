CREATE TABLE inventory (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id text REFERENCES profiles(id),
  item_name text,
  realm_id text,
  obtained_at timestamp DEFAULT now()
);
