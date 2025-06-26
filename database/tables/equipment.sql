CREATE TABLE IF NOT EXISTS public.equipment_slot (
    name TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.equipment_slot (name, description) VALUES
    ('head',      'Head gear slot'),
    ('chest',     'Chest armor slot'),
    ('legs',      'Legwear slot'),
    ('weapon',    'Main weapon slot'),
    ('offhand',   'Offhand/shield slot'),
    ('accessory', 'Accessory slot')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.equipment (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slot TEXT NOT NULL REFERENCES public.equipment_slot(name) ON DELETE RESTRICT,
    item_id uuid REFERENCES public.items(id) ON DELETE SET NULL,
    equipped_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, slot)
);

CREATE INDEX IF NOT EXISTS equipment_item_id_idx ON public.equipment(item_id);

ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY equipment_select_self ON public.equipment
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY equipment_modify_self ON public.equipment
    FOR INSERT, UPDATE, DELETE USING (auth.uid() = user_id);
