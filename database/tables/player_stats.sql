create table player_stats (
  user_id text primary key,
  level int default 1,
  hp int default 100,
  mana int default 100,
  xp int default 0,
  max_hp int default 100,
  max_mana int default 100
);