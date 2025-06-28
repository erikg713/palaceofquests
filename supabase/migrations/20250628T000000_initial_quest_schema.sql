-- Create users table
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  pi_uid uuid not null,
  username text unique not null,
  level int default 1,
  experience int default 0,
  created_at timestamp with time zone default now()
);

-- Create inventory table
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.players(id) on delete cascade,
  item_name text not null,
  item_type text,
  rarity text,
  quantity int default 1,
  acquired_at timestamp with time zone default now()
);

-- Create quests table
create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  reward_pi int,
  reward_items jsonb,
  required_level int default 1,
  created_at timestamp with time zone default now()
);

-- Create player_quests junction table
create table if not exists public.player_quests (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.players(id) on delete cascade,
  quest_id uuid references public.quests(id),
  status text default 'in_progress', -- or 'completed'
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);
