-- Palace of Quests Database Schema
-- PostgreSQL Database Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pi_user_id VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE,
    
    -- Game progression
    level INTEGER DEFAULT 1 NOT NULL,
    experience INTEGER DEFAULT 0 NOT NULL,
    pi_balance DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    
    -- Player stats
    health INTEGER DEFAULT 100 NOT NULL,
    max_health INTEGER DEFAULT 100 NOT NULL,
    mana INTEGER DEFAULT 50 NOT NULL,
    max_mana INTEGER DEFAULT 50 NOT NULL,
    attack INTEGER DEFAULT 10 NOT NULL,
    defense INTEGER DEFAULT 5 NOT NULL,
    
    -- Premium features
    is_premium BOOLEAN DEFAULT FALSE NOT NULL,
    premium_expires_at TIMESTAMP,
    
    -- Avatar and customization
    avatar_url VARCHAR(255),
    avatar_upgrades JSONB DEFAULT '{}' NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for users
CREATE INDEX idx_users_pi_user_id ON users(pi_user_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_last_active ON users(last_active);

-- Quests table
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    
    -- Quest properties
    difficulty VARCHAR(20) DEFAULT 'Easy' NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Epic', 'Legendary')),
    quest_type VARCHAR(20) DEFAULT 'tutorial' NOT NULL CHECK (quest_type IN ('tutorial', 'combat', 'collection', 'exploration', 'social')),
    
    -- Requirements and rewards
    level_requirement INTEGER DEFAULT 1 NOT NULL,
    pi_reward DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    experience_reward INTEGER DEFAULT 100 NOT NULL,
    
    -- Quest objectives
    objectives JSONB DEFAULT '[]' NOT NULL,
    max_progress INTEGER DEFAULT 1 NOT NULL,
    
    -- Quest availability
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_repeatable BOOLEAN DEFAULT FALSE NOT NULL,
    cooldown_hours INTEGER DEFAULT 0 NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for quests
CREATE INDEX idx_quests_difficulty ON quests(difficulty);
CREATE INDEX idx_quests_quest_type ON quests(quest_type);
CREATE INDEX idx_quests_level_requirement ON quests(level_requirement);
CREATE INDEX idx_quests_is_active ON quests(is_active);

-- Quest progress table
CREATE TABLE quest_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    
    -- Progress tracking
    current_progress INTEGER DEFAULT 0 NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    completion_data JSONB DEFAULT '{}' NOT NULL,
    
    -- Timestamps
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Unique constraint
    UNIQUE(user_id, quest_id)
);

-- Create indexes for quest_progress
CREATE INDEX idx_quest_progress_user_id ON quest_progress(user_id);
CREATE INDEX idx_quest_progress_quest_id ON quest_progress(quest_id);
CREATE INDEX idx_quest_progress_is_completed ON quest_progress(is_completed);

-- User quests table
CREATE TABLE user_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    
    -- Quest status
    status VARCHAR(20) DEFAULT 'accepted' NOT NULL CHECK (status IN ('accepted', 'in_progress', 'completed', 'failed', 'abandoned')),
    
    -- Timing
    accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Rewards tracking
    rewards_claimed BOOLEAN DEFAULT FALSE NOT NULL,
    pi_reward_amount DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    experience_reward_amount INTEGER DEFAULT 0 NOT NULL,
    
    -- Unique constraint for active quests
    UNIQUE(user_id, quest_id)
);

-- Create indexes for user_quests
CREATE INDEX idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX idx_user_quests_quest_id ON user_quests(quest_id);
CREATE INDEX idx_user_quests_status ON user_quests(status);
CREATE INDEX idx_user_quests_expires_at ON user_quests(expires_at);

-- Items table
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    
    -- Item properties
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('weapon', 'armor', 'consumable', 'material', 'cosmetic')),
    rarity VARCHAR(20) DEFAULT 'Common' NOT NULL CHECK (rarity IN ('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary')),
    
    -- Stats and effects
    stats JSONB DEFAULT '{}' NOT NULL,
    effects JSONB DEFAULT '[]' NOT NULL,
    
    -- Pricing and availability
    pi_price DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    is_tradeable BOOLEAN DEFAULT TRUE NOT NULL,
    is_stackable BOOLEAN DEFAULT FALSE NOT NULL,
    max_stack_size INTEGER DEFAULT 1 NOT NULL,
    
    -- Requirements
    level_requirement INTEGER DEFAULT 1 NOT NULL,
    class_requirement VARCHAR(50),
    
    -- Visual
    image_url VARCHAR(255),
    icon_url VARCHAR(255),
    
    -- Availability
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    is_premium_only BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for items
CREATE INDEX idx_items_item_type ON items(item_type);
CREATE INDEX idx_items_rarity ON items(rarity);
CREATE INDEX idx_items_pi_price ON items(pi_price);
CREATE INDEX idx_items_level_requirement ON items(level_requirement);
CREATE INDEX idx_items_is_available ON items(is_available);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Transaction details
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('quest_reward', 'item_purchase', 'premium_subscription', 'marketplace_sale', 'marketplace_purchase', 'pi_deposit')),
    
    -- Pi Network integration
    pi_payment_id VARCHAR(100) UNIQUE,
    pi_transaction_hash VARCHAR(255),
    
    -- Amount and currency
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'PI' NOT NULL,
    
    -- Transaction status
    status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    
    -- Related entities
    related_quest_id UUID,
    related_item_id UUID,
    
    -- Metadata
    metadata JSONB DEFAULT '{}' NOT NULL,
    description VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_transaction_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_pi_payment_id ON transactions(pi_payment_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quests_updated_at BEFORE UPDATE ON quests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quest_progress_updated_at BEFORE UPDATE ON quest_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO quests (title, description, difficulty, quest_type, level_requirement, pi_reward, experience_reward, objectives, max_progress) VALUES
('Welcome to Palace of Quests', 'Complete your first quest in the metaverse', 'Easy', 'tutorial', 1, 1.0, 100, '["Create your avatar", "Explore the starting area"]', 2),
('Crystal Collector', 'Gather 10 mystical crystals from the Crystal Caverns', 'Medium', 'collection', 5, 5.0, 500, '["Find Crystal Caverns", "Collect 10 crystals"]', 10),
('Dragon Slayer', 'Defeat the Ancient Dragon in the Shadow Realm', 'Epic', 'combat', 15, 25.0, 2000, '["Locate Shadow Realm", "Defeat Ancient Dragon"]', 1),
('Social Butterfly', 'Make friends with 5 other players', 'Easy', 'social', 3, 2.0, 200, '["Send friend requests", "Accept friend requests"]', 5),
('Treasure Hunter', 'Discover 3 hidden treasure chests', 'Hard', 'exploration', 10, 15.0, 1200, '["Find hidden locations", "Open treasure chests"]', 3);

INSERT INTO items (name, description, item_type, rarity, stats, pi_price, level_requirement) VALUES
('Starter Sword', 'A basic sword for new adventurers', 'weapon', 'Common', '{"attack": 10}', 5.0, 1),
('Mystic Blade', 'A legendary sword imbued with magical energy', 'weapon', 'Epic', '{"attack": 50, "magic": 25}', 100.0, 15),
('Crystal Shield', 'A protective shield made from rare crystals', 'armor', 'Rare', '{"defense": 30, "magic_resist": 15}', 50.0, 8),
('Health Potion', 'Restores 50 health points instantly', 'consumable', 'Common', '{"healing": 50}', 2.0, 1),
('Mana Elixir', 'Restores 30 mana points instantly', 'consumable', 'Common', '{"mana_restore": 30}', 3.0, 1),
('Dragon Scale Armor', 'Legendary armor crafted from dragon scales', 'armor', 'Legendary', '{"defense": 80, "fire_resist": 50}', 500.0, 20),
('Pi Crystal', 'A rare material infused with Pi Network energy', 'material', 'Rare', '{}', 25.0, 5),
('Golden Crown', 'A cosmetic crown that shows your status', 'cosmetic', 'Epic', '{}', 75.0, 10);
