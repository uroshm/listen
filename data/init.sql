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

CREATE TABLE IF NOT EXISTS "user_schema"."tests" (
    ID SERIAL PRIMARY KEY,
    PATIENT_ID INT,
    CONSTRAINT fk_patient
      FOREIGN KEY (PATIENT_ID)
      REFERENCES "user_schema"."patients" (ID)
      ON DELETE CASCADE,
    TEST_NAME TEXT,
    TEST_TYPE TEXT,
    TEST_DETAILS TEXT,
    TEST_DATE TEXT,
    TEST_DATA TEXT,
    TEST_AUDIO BYTEA,
    TEST_ANALYSIS TEXT
);

GRANT ALL PRIVILEGES ON TABLE "user_schema"."patients" TO "user";
GRANT ALL PRIVILEGES ON TABLE "user_schema"."tests" TO "user";
