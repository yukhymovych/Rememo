# Database Setup Instructions

If you're getting "нет доступа к схеме public" (no access to public schema) error, run these commands as the postgres superuser:

```sql
-- Connect to the todo_db database
\c todo_db

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO todo_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO todo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO todo_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO todo_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO todo_user;

-- Make sure the user can create tables
ALTER DATABASE todo_db OWNER TO todo_user;
```

Or if you prefer a simpler approach, run this from command line:

```bash
psql -U postgres -d todo_db -c "GRANT ALL ON SCHEMA public TO todo_user;"
psql -U postgres -d todo_db -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO todo_user;"
psql -U postgres -d todo_db -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO todo_user;"
psql -U postgres -d todo_db -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO todo_user;"
psql -U postgres -d todo_db -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO todo_user;"
psql -U postgres -d todo_db -c "ALTER DATABASE todo_db OWNER TO todo_user;"
```

After running these commands, try the migration again:

```bash
npm run migrate:up
```
