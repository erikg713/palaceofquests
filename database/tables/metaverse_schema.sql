-- Make sure schema exists
CREATE SCHEMA IF NOT EXISTS metaverse_schema;

-- Drop tables if they exist (in dependency order)
DROP TABLE IF EXISTS metaverse_schema.currency_history CASCADE;
DROP TABLE IF EXISTS metaverse_schema.upgrades CASCADE;
DROP TABLE IF EXISTS metaverse_schema.avatars CASCADE;
DROP TABLE IF EXISTS metaverse_schema.users CASCADE;
DROP TABLE IF EXISTS metaverse_schema.weapons CASCADE;
DROP TABLE IF EXISTS metaverse_schema.clothing_items CASCADE;
DROP TABLE IF EXISTS metaverse_schema.levels CASCADE;
DROP TABLE IF EXISTS metaverse_schema.assets CASCADE;
DROP TABLE IF EXISTS metaverse_schema.pi_payments CASCADE;
DROP TABLE IF EXISTS metaverse_schema.transactions CASCADE;

-- Create users table
CREATE TABLE metaverse_schema.users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    wallet_address VARCHAR(100),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create weapons table
CREATE TABLE metaverse_schema.weapons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    rarity VARCHAR(20),
    attack_power INTEGER NOT NULL
);

-- Create clothing_items table
CREATE TABLE metaverse_schema.clothing_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    rarity VARCHAR(20),
    defense INTEGER NOT NULL
);

-- Create levels table
CREATE TABLE metaverse_schema.levels (
    id SERIAL PRIMARY KEY,
    level_number INTEGER NOT NULL,
    experience_required INTEGER NOT NULL
);

-- Create avatars table
CREATE TABLE metaverse_schema.avatars (
    avatar_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES metaverse_schema.users(user_id) ON DELETE CASCADE,
    avatar_name VARCHAR(50),
    equipped_weapon_id INTEGER REFERENCES metaverse_schema.weapons(id),
    equipped_clothing_id INTEGER REFERENCES metaverse_schema.clothing_items(id),
    level_id INTEGER REFERENCES metaverse_schema.levels(id),
    diamonds INTEGER DEFAULT 0,
    gold INTEGER DEFAULT 0
);

-- Create upgrades table
CREATE TABLE metaverse_schema.upgrades (
    upgrade_id SERIAL PRIMARY KEY,
    avatar_id INTEGER NOT NULL REFERENCES metaverse_schema.avatars(avatar_id) ON DELETE CASCADE,
    upgrade_type VARCHAR(50),
    level INTEGER,
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create currency_history table
CREATE TABLE metaverse_schema.currency_history (
    history_id SERIAL PRIMARY KEY,
    avatar_id INTEGER NOT NULL REFERENCES metaverse_schema.avatars(avatar_id) ON DELETE CASCADE,
    currency_type VARCHAR(10),
    amount INTEGER,
    change_reason VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional existing tables (assets, pi_payments, transactions)
-- You may want to recreate or keep your existing definitions here
-- For example:
CREATE TABLE IF NOT EXISTS metaverse_schema.assets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

CREATE TABLE IF NOT EXISTS metaverse_schema.pi_payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES metaverse_schema.users(user_id),
    payment_reference VARCHAR(100),
    amount INTEGER,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS metaverse_schema.transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES metaverse_schema.users(user_id),
    transaction_type VARCHAR(50),
    amount INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimization
CREATE INDEX idx_avatars_user ON metaverse_schema.avatars(user_id);
CREATE INDEX idx_upgrades_avatar ON metaverse_schema.upgrades(avatar_id);

-- Seed some initial data

-- Levels (example)
INSERT INTO metaverse_schema.levels (level_number, experience_required) VALUES
(1, 0),
(2, 100),
(3, 300);

-- Clothing Items
INSERT INTO metaverse_schema.clothing_items (name, rarity, defense) VALUES
('Leather Tunic', 'Common', 5),
('Mystic Robe', 'Rare', 15),
('Dragon Scale Armor', 'Epic', 30);

-- Weapons
INSERT INTO metaverse_schema.weapons (name, rarity, attack_power) VALUES
('Wooden Sword', 'Common', 5),
('Fireblade', 'Rare', 20),
('Stormbreaker', 'Epic', 50);

-- Users
INSERT INTO metaverse_schema.users (username, email, wallet_address) VALUES
('AzureKnight', 'azure@example.com', 'wallet_azura'),
('CrimsonWitch', 'crimson@example.com', 'wallet_crimson'),
('GoldenRogue', 'golden@example.com', 'wallet_golden');

-- Avatars (link to users, weapons, clothing, levels)
INSERT INTO metaverse_schema.avatars (
    user_id, avatar_name, equipped_weapon_id, equipped_clothing_id, level_id, diamonds, gold
) VALUES
(1, 'Azura', 1, 1, 1, 50, 200),
(2, 'Crimsy', 2, 2, 2, 100, 500),
(3, 'Roguee', 3, 3, 3, 20, 300);

-- Upgrades
INSERT INTO metaverse_schema.upgrades (avatar_id, upgrade_type, level) VALUES
(1, 'Sharpness', 1),
(1, 'Durability', 1),
(2, 'Magic Boost', 2),
(3, 'Stealth', 2),
(3, 'Speed', 1);

-- Currency History
INSERT INTO metaverse_schema.currency_history (
    avatar_id, currency_type, amount, change_reason
) VALUES
(1, 'gold', 200, 'Starting gift'),
(1, 'diamonds', 50, 'Starter pack'),
(2, 'diamonds', 100, 'Starter pack'),
(3, 'gold', 300, 'Starter pack');