---
# Palace of Quests Database

This directory contains all SQL resources for the Palace of Quests platform.

---

## Structure

- **schema.sql**: Main schema—run first to create all tables and indexes.
- **migrations/**: Ordered migration scripts for production upgrades.
- **seed.sql**: Sample data for local/dev environments.
- **functions.sql**: Custom SQL functions, triggers, and views.

---

## Usage

1. **Initialize Database**
    ```sh
    psql -f schema.sql
    ```
    - (Optional) Run migration scripts in order:
    ```sh
    psql -f migrations/001_init.sql
    ```
2. **Seed for Development**
    ```sh
    psql -f seed.sql
    ```
3. **Add Custom Logic**
    ```sh
    psql -f functions.sql
    ```

---

## Conventions

- All timestamps are UTC (`WITH TIME ZONE`).
- UUIDs are used for all primary keys.
- Foreign keys are `NOT NULL` unless truly optional.
- Indexes are added for all frequent lookups.

---

## Migrations

New migrations go in `migrations/` as `NNN_description.sql` (incremental).

---

## Example Commands

```sh
psql -f schema.sql
psql -f migrations/001_init.sql
psql -f seed.sql
psql -f functions.sql
```

---

## Auth Integration

- The `profiles` table links to Supabase `auth.users` by UUID.

---

## Questions & Proposals

For schema changes or questions, please open an issue or PR.

---
