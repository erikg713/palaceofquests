CREATE TABLE hotbar (
  user_id TEXT,
  slot_index INTEGER,
  item_id TEXT,
  PRIMARY KEY (user_id, slot_index)
);