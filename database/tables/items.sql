-- Enable required extension for UUID generation (already enabled by default in Supabase, but safe to include)
create extension if not exists "uuid-ossp";

-- Table: items
create table if not exists public.items (
    id          uuid primary key default uuid_generate_v4(),
    name        varchar(100) not null unique,
    description text,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

comment on table public.items is 'Unique inventory items for the application.';
comment on column public.items.id is 'Primary key, automatically generated UUID.';
comment on column public.items.name is 'Unique, human-readable name for each item.';
comment on column public.items.description is 'Descriptive text about the item.';
comment on column public.items.created_at is 'Timestamp when the item was created.';
comment on column public.items.updated_at is 'Timestamp when the item was last updated.';

-- Index for case-insensitive item name lookups
create unique index if not exists idx_items_name_ci on public.items (lower(name));

-- Automatically update updated_at timestamp on row modification
create or replace function public.items_set_updated_at()
returns trigger as $$
begin
    new.updated_at := now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_updated_at on public.items;
create trigger trg_set_updated_at
before update on public.items
for each row
execute procedure public.items_set_updated_at();

-- For Supabase RLS: enable and configure as needed
-- alter table public.items enable row level security;
-- -- Example RLS policy
-- create policy "Allow authenticated users to select items"
--     on public.items for select
--     using (auth.role() = 'authenticated');
