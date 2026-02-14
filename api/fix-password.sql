-- Run this SQL command in your PostgreSQL client (pgAdmin, DBeaver, etc.)
-- This will set the password for todo_user to match your .env file

ALTER USER todo_user WITH PASSWORD 'todo1234';

-- Verify the user exists
SELECT usename FROM pg_user WHERE usename = 'todo_user';
