CREATE TABLE unlocks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id text REFERENCES profiles(id),
  realm_id text,
  unlocked_at timestamp DEFAULT now()
);