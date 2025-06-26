-- Hotbar Table (Supabase/PostgreSQL)
-- Stores quick-access item slots per user

create table if not exists public.hotbar (
    user_id uuid not null references auth.users(id) on delete cascade,
    slot_index smallint not null check (slot_index >= 0 and slot_index < 20),
    item_id uuid not null references public.items(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (user_id, slot_index)
);

-- Automatically update 'updated_at' on row modification
create or replace function public.touch_hotbar_updated_at()
returns trigger as $$
begin
    new.updated_at := now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_touch_hotbar_updated_at on public.hotbar;

create trigger trg_touch_hotbar_updated_at
before update on public.hotbar
for each row
execute function public.touch_hotbar_updated_at();

-- Optional: Index for fast item_id lookups
create index if not exists idx_hotbar_item_id on public.hotbar(item_id);

-- Optional: Add a comment for the table (for documentation and Supabase Studio)
comment on table public.hotbar is 'Stores hotbar slot assignments for each user. Each slot_index holds an item_id.';

-- Optional: Add a comment for each column
comment on column public.hotbar.user_id is 'User owning this hotbar slot.';
comment on column public.hotbar.slot_index is 'Slot position in the user''s hotbar (0-based, max 19).';
comment on column public.hotbar.item_id is 'Item assigned to this slot.';
comment on column public.hotbar.created_at is 'When this record was created.';
comment on column public.hotbar.updated_at is 'When this record was last updated.';

-- Optional: Grant permissions (if needed)
-- grant select, insert, update, delete on public.hotbar to authenticated;
