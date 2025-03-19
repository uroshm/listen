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

CREATE TABLE IF NOT EXISTS "user_schema"."users" (
    ID SERIAL PRIMARY KEY,
    USERNAME TEXT,
    PASSWORD TEXT    
);
CREATE TABLE IF NOT EXISTS "user_schema"."patients" (
    ID SERIAL PRIMARY KEY,
    USER_ID INT,
    CONSTRAINT fk_user
      FOREIGN KEY (USER_ID)
      REFERENCES "user_schema"."users" (ID)
      ON DELETE CASCADE,
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

INSERT INTO "user_schema"."users"
    (USERNAME, PASSWORD)
VALUES
    ('uros','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfNOQp1VXSJyP9m');

INSERT INTO "user_schema"."patients" 
    (USER_ID, FIRST_NAME, LAST_NAME, IEP_DATE, EVAL_DATE, SCHOOL, THERAPY_TYPE, TEACHER, ROOM_NUMBER, GRADE_LEVEL, DOB)
VALUES
    (1, 'John', 'Doe', '2022-01-01', '2022-01-01', 'School', 'Speech', 'Teacher', '101', '1', '2012-01-01'),
    (NULL, 'Jane', 'Smith', '2022-02-01', '2022-02-01', 'School', 'Occupational', 'Teacher', '102', '2', '2011-02-01');