CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0
);