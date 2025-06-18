-- Enable UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE (linked to Supabase auth.users via uuid)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT timezone('utc', now())
);

-- QUESTS TABLE
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
    xp_reward INTEGER NOT NULL,
    pi_reward NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT timezone('utc', now())
);

-- PLAYER QUEST PROGRESS
CREATE TABLE player_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES profiles (id) ON DELETE CASCADE,
    quest_id UUID REFERENCES quests (id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'completed', 'abandoned')) DEFAULT 'pending',
    completed_at TIMESTAMP,
    UNIQUE (player_id, quest_id)
);

-- INVENTORY TABLE (NFT items, consumables, gear)
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES profiles (id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    item_type TEXT CHECK (item_type IN ('gear', 'consumable', 'nft', 'material')),
    quantity INTEGER DEFAULT 1,
    acquired_at TIMESTAMP DEFAULT timezone('utc', now())
);
