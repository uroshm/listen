CREATE USER "listen_user" WITH PASSWORD 'password';
-- CREATE DATABASE "listen_db" OWNER "listen_user";
CREATE SCHEMA "listen_schema";
GRANT ALL PRIVILEGES ON DATABASE "listen_db" TO "listen_user";
GRANT ALL PRIVILEGES ON SCHEMA "listen_schema" TO "listen_user";


CREATE TABLE listen_schema.listen (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image BYTEA
);

INSERT INTO "listen_schema"."listen" ("name", "description") VALUES ('listen 1', 'This is the first listen');
INSERT INTO "listen_schema"."listen" ("name", "description") VALUES ('listen 2', 'This is the second listen');
INSERT INTO "listen_schema"."listen" ("name", "description") VALUES ('listen 3', 'This is the third listen');

