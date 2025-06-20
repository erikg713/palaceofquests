-- Seed data for local/development use

-- Sample profiles (assuming corresponding users exist in auth.users)
INSERT INTO profiles (id, username, level, xp)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'alice', 5, 420),
    ('00000000-0000-0000-0000-000000000002', 'bob', 2, 100),
    ('00000000-0000-0000-0000-000000000003', 'charlie', 1, 0)
ON CONFLICT (id) DO NOTHING;

-- Sample quests
INSERT INTO quests (id, title, description, difficulty, xp_reward, pi_reward)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'The First Quest', 'Begin your journey!', 'easy', 100, 1),
    ('11111111-1111-1111-1111-111111111112', 'Slay the Dragon', 'Defeat the dragon in the cave.', 'hard', 500, 5)
ON CONFLICT (id) DO NOTHING;

-- Sample player_quests
INSERT INTO player_quests (id, player_id, quest_id, status)
VALUES
    ('22222222-2222-2222-2222-222222222221', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'completed'),
    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111112', 'pending')
ON CONFLICT (id) DO NOTHING;

-- Sample inventory
INSERT INTO inventory (id, player_id, item_name, item_type, quantity)
VALUES
    ('33333333-3333-3333-3333-333333333331', '00000000-0000-0000-0000-000000000001', 'Sword', 'gear', 1),
    ('33333333-3333-3333-3333-333333333332', '00000000-0000-0000-0000-000000000001', 'Potion', 'consumable', 5)
ON CONFLICT (id) DO NOTHING;
