-- Ensure schema exists
CREATE SCHEMA IF NOT EXISTS metaverse_schema;

-- Drop tables in dependency order
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

-- Users Table
CREATE TABLE metaverse_schema.users (
    user_id         SERIAL PRIMARY KEY,
    username        VARCHAR(50) NOT NULL UNIQUE,
    email           VARCHAR(100) NOT NULL UNIQUE,
    wallet_address  VARCHAR(100),
    joined_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Weapons Table
CREATE TABLE metaverse_schema.weapons (
    weapon_id   SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    rarity      VARCHAR(20) NOT NULL CHECK (rarity IN ('Common', 'Rare', 'Epic')),
    attack_power INTEGER NOT NULL CHECK (attack_power > 0)
);

-- Clothing Items Table
CREATE TABLE metaverse_schema.clothing_items (
    clothing_id SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    rarity      VARCHAR(20) NOT NULL CHECK (rarity IN ('Common', 'Rare', 'Epic')),
    defense     INTEGER NOT NULL CHECK (defense >= 0)
);

-- Levels Table
CREATE TABLE metaverse_schema.levels (
    level_id            SERIAL PRIMARY KEY,
    level_number        INTEGER NOT NULL UNIQUE CHECK (level_number > 0),
    experience_required INTEGER NOT NULL CHECK (experience_required >= 0)
);

-- Avatars Table
CREATE TABLE metaverse_schema.avatars (
    avatar_id               SERIAL PRIMARY KEY,
    user_id                 INTEGER NOT NULL REFERENCES metaverse_schema.users(user_id) ON DELETE CASCADE,
    avatar_name             VARCHAR(50) NOT NULL,
    equipped_weapon_id      INTEGER REFERENCES metaverse_schema.weapons(weapon_id),
    equipped_clothing_id    INTEGER REFERENCES metaverse_schema.clothing_items(clothing_id),
    level_id                INTEGER REFERENCES metaverse_schema.levels(level_id),
    diamonds                INTEGER NOT NULL DEFAULT 0 CHECK (diamonds >= 0),
    gold                    INTEGER NOT NULL DEFAULT 0 CHECK (gold >= 0)
);

-- Upgrades Table
CREATE TABLE metaverse_schema.upgrades (
    upgrade_id      SERIAL PRIMARY KEY,
    avatar_id       INTEGER NOT NULL REFERENCES metaverse_schema.avatars(avatar_id) ON DELETE CASCADE,
    upgrade_type    VARCHAR(50) NOT NULL,
    level           INTEGER NOT NULL CHECK (level > 0),
    achieved_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Currency History Table
CREATE TABLE metaverse_schema.currency_history (
    history_id      SERIAL PRIMARY KEY,
    avatar_id       INTEGER NOT NULL REFERENCES metaverse_schema.avatars(avatar_id) ON DELETE CASCADE,
    currency_type   VARCHAR(10) NOT NULL CHECK (currency_type IN ('gold', 'diamonds')),
    amount          INTEGER NOT NULL,
    change_reason   VARCHAR(100) NOT NULL,
    changed_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Assets Table
CREATE TABLE IF NOT EXISTS metaverse_schema.assets (
    asset_id    SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT
);

-- Pi Payments Table
CREATE TABLE IF NOT EXISTS metaverse_schema.pi_payments (
    pi_payment_id    SERIAL PRIMARY KEY,
    user_id          INTEGER REFERENCES metaverse_schema.users(user_id) ON DELETE SET NULL,
    payment_reference VARCHAR(100) NOT NULL,
    amount           INTEGER NOT NULL CHECK (amount >= 0),
    status           VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS metaverse_schema.transactions (
    transaction_id   SERIAL PRIMARY KEY,
    user_id          INTEGER REFERENCES metaverse_schema.users(user_id) ON DELETE SET NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount           INTEGER NOT NULL CHECK (amount >= 0),
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimization
CREATE INDEX IF NOT EXISTS idx_avatars_user_id ON metaverse_schema.avatars(user_id);
CREATE INDEX IF NOT EXISTS idx_upgrades_avatar_id ON metaverse_schema.upgrades(avatar_id);
CREATE INDEX IF NOT EXISTS idx_currency_history_avatar_id ON metaverse_schema.currency_history(avatar_id);

-- Optional: Comments for better maintainability
COMMENT ON TABLE metaverse_schema.users IS 'Stores registered users.';
COMMENT ON COLUMN metaverse_schema.users.wallet_address IS 'Blockchain wallet address, if provided.';

-- Seed Data: Use explicit columns and be ready for changes
INSERT INTO metaverse_schema.levels (level_number, experience_required) VALUES
    (1, 0),
    (2, 100),
    (3, 300);

INSERT INTO metaverse_schema.clothing_items (name, rarity, defense) VALUES
    ('Leather Tunic', 'Common', 5),
    ('Mystic Robe', 'Rare', 15),
    ('Dragon Scale Armor', 'Epic', 30);

INSERT INTO metaverse_schema.weapons (name, rarity, attack_power) VALUES
    ('Wooden Sword', 'Common', 5),
    ('Fireblade', 'Rare', 20),
    ('Stormbreaker', 'Epic', 50);

INSERT INTO metaverse_schema.users (username, email, wallet_address) VALUES
    ('AzureKnight', 'azure@example.com', 'wallet_azura'),
    ('CrimsonWitch', 'crimson@example.com', 'wallet_crimson'),
    ('GoldenRogue', 'golden@example.com', 'wallet_golden');

INSERT INTO metaverse_schema.avatars (user_id, avatar_name, equipped_weapon_id, equipped_clothing_id, level_id, diamonds, gold) VALUES
    (1, 'Azura', 1, 1, 1, 50, 200),
    (2, 'Crimsy', 2, 2, 2, 100, 500),
    (3, 'Roguee', 3, 3, 3, 20, 300);

INSERT INTO metaverse_schema.upgrades (avatar_id, upgrade_type, level) VALUES
    (1, 'Sharpness', 1),
    (1, 'Durability', 1),
    (2, 'Magic Boost', 2),
    (3, 'Stealth', 2),
    (3, 'Speed', 1);

INSERT INTO metaverse_schema.currency_history (avatar_id, currency_type, amount, change_reason) VALUES
    (1, 'gold', 200, 'Starting gift'),
    (1, 'diamonds', 50, 'Starter pack'),
    (2, 'diamonds', 100, 'Starter pack'),
    (3, 'gold', 300, 'Starter pack');
