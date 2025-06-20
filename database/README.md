# Palace of Quests Database

This directory contains all SQL resources for the Palace of Quests platform.

## Structure

- **schema.sql**: Main database schema. Run this first.
- **migrations/**: Incremental migration scripts. Use for production deployments.
- **seed.sql**: Example data for local/dev environments.
- **functions.sql**: Custom SQL functions, triggers, and views.

## Usage

1. **Setup Database**
   - Run `schema.sql` to create all tables and indexes.
   - (Optional) Run each script in `migrations/` in order.

2. **Seeding Data**
   - Run `seed.sql` for sample data (dev/local only).

3. **Custom Logic**
   - Run `functions.sql` to enable triggers and advanced features.

## Conventions

- All timestamps use UTC (`WITH TIME ZONE`).
- Foreign keys are `NOT NULL` unless truly optional.
- Indexes are added for frequent lookups.
- Use UUIDs for all primary keys.

## Migrations

Place new migration scripts in the `migrations/` folder as `NNN_description.sql`, where `NNN` is incremental.

## Example Commands

```sh
psql -f schema.sql
psql -f migrations/001_init.sql
psql -f seed.sql
psql -f functions.sql
```

## Auth Integration

The `profiles` table links to Supabase's `auth.users` via the `id` UUID.

---

**For questions or to propose schema changes, open an issue or PR.**
