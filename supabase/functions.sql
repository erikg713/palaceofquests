-- Custom SQL functions, triggers, or views for Palace of Quests

-- Example: Automatically level up profile when xp exceeds threshold
CREATE OR REPLACE FUNCTION public.auto_level_up()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.xp >= 100 * NEW.level THEN
        NEW.level := NEW.level + 1;
        NEW.xp := NEW.xp - (100 * (NEW.level - 1));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_level_up ON profiles;

CREATE TRIGGER trg_auto_level_up
BEFORE UPDATE OF xp ON profiles
FOR EACH ROW
WHEN (NEW.xp > OLD.xp)
EXECUTE FUNCTION public.auto_level_up();

-- Example view: Get all completed quests per user
CREATE OR REPLACE VIEW public.completed_quests AS
SELECT
    pq.player_id,
    p.username,
    pq.quest_id,
    q.title AS quest_title,
    pq.completed_at
FROM player_quests pq
JOIN profiles p ON p.id = pq.player_id
JOIN quests q ON q.id = pq.quest_id
WHERE pq.status = 'completed';
