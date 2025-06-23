CREATE TABLE quests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id text REFERENCES profiles(id),
  realm_id text,
  quest_name text,
  xp_earned integer DEFAULT 0,
  completed_at timestamp DEFAULT now()
);