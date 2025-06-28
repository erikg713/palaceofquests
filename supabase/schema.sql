-- Enable UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE (linked to Supabase auth.users via uuid)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL CHECK (char_length(username) BETWEEN 3 AND 32),
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
    xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- QUESTS TABLE
CREATE TABLE IF NOT EXISTS quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 128),
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
    xp_reward INTEGER NOT NULL CHECK (xp_reward > 0),
    pi_reward NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (pi_reward >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- PLAYER QUEST PROGRESS
CREATE TABLE IF NOT EXISTS player_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    quest_id UUID NOT NULL REFERENCES quests (id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'abandoned')) DEFAULT 'pending',
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (player_id, quest_id)
);

-- INVENTORY TABLE (NFT items, consumables, gear)
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    item_name TEXT NOT NULL CHECK (char_length(item_name) BETWEEN 2 AND 64),
    item_type TEXT NOT NULL CHECK (item_type IN ('gear', 'consumable', 'nft', 'material')),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    acquired_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- INDEX OPTIMIZATION FOR FAST LOOKUPS
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_quests_title ON quests(title);
CREATE INDEX IF NOT EXISTS idx_player_quests_player_id ON player_quests(player_id);
CREATE INDEX IF NOT EXISTS idx_player_quests_quest_id ON player_quests(quest_id);
CREATE INDEX IF NOT EXISTS idx_inventory_player_id ON inventory(player_id);
