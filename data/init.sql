DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'user') THEN
        CREATE USER "user" WITH PASSWORD 'password';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'listen_db') THEN
        EXECUTE 'CREATE DATABASE listen_db';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'user_schema') THEN
        CREATE SCHEMA "user_schema";
    END IF;
END $$;

GRANT ALL PRIVILEGES ON DATABASE "listen_db" TO "user";
GRANT ALL PRIVILEGES ON SCHEMA "user_schema" TO "user";

CREATE TABLE IF NOT EXISTS "user_schema"."patients" (
    ID SERIAL PRIMARY KEY,
    FIRST_NAME TEXT,
    LAST_NAME TEXT,
    IEP_DATE TEXT,
    EVAL_DATE TEXT,
    SCHOOL TEXT,
    THERAPY_TYPE TEXT,
    TEACHER TEXT,
    ROOM_NUMBER TEXT,
    GRADE_LEVEL TEXT,
    DOB TEXT
);

GRANT ALL PRIVILEGES ON TABLE "user_schema"."patients" TO "user";

INSERT INTO "user_schema"."patients" 
    (FIRST_NAME, LAST_NAME, IEP_DATE, EVAL_DATE, SCHOOL, THERAPY_TYPE, TEACHER, ROOM_NUMBER, GRADE_LEVEL, DOB)
VALUES
    ('John', 'Doe', '2022-01-01', '2022-01-01', 'School', 'Speech', 'Teacher', '101', '1', '2012-01-01');