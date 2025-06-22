create table player_positions (
  user_id text primary key,
  x float8,
  y float8,
  z float8,
  updated_at timestamp default now()
);