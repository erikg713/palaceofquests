CREATE TABLE quests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  realm_id uuid NOT NULL REFERENCES realms(id),
  quest_name text NOT NULL,
  xp_earned integer DEFAULT 0 CHECK (xp_earned >= 0),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, quest_name)
);

-- Indexes for faster queries
CREATE INDEX idx_user_id ON quests (user_id);
CREATE INDEX idx_realm_id ON quests (realm_id);
CREATE INDEX idx_completed_at ON quests (completed_at);

-- Comments for documentation
COMMENT ON TABLE quests IS 'Table to store quest details for users';
COMMENT ON COLUMN quests.user_id IS 'ID of the user who completed the quest';
COMMENT ON COLUMN quests.realm_id IS 'ID of the realm where the quest is located';
COMMENT ON COLUMN quests.quest_name IS 'Name of the quest';
COMMENT ON COLUMN quests.xp_earned IS 'Experience points earned upon quest completion';
COMMENT ON COLUMN quests.completed_at IS 'Timestamp when the quest was completed';
