-- Create table for storing realms
CREATE TABLE IF NOT EXISTS realms (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique identifier
    name        VARCHAR(100) NOT NULL UNIQUE,               -- Name of the realm (case-sensitive)
    description TEXT CHECK (LENGTH(description) <= 500),    -- Description limited to 500 characters
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL          -- Timestamp of creation
);

-- Index for quick lookup by name (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS realms_name_idx ON realms (LOWER(name));

-- Sample data: Insert realms
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM realms WHERE name = 'Valoria') THEN
        INSERT INTO realms (id, name, description)
        VALUES
            ('a1f4c8e2-7e3e-4b9d-a9e2-6b7c4f2d1ea3', 'Valoria', 'The sunlit realm of heroes.'),
            ('b2a9d3f5-6e2d-4c1f-b2e4-9d8c7a2b3f6e', 'Umbracore', 'A shadowy domain ruled by ancient magic.');
    END IF;
END $$;
