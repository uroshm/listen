-- CREATE USER "widget_user" WITH PASSWORD 'password';
-- CREATE DATABASE "widget_db" OWNER "widget_user";
CREATE SCHEMA "widget_schema";
GRANT ALL PRIVILEGES ON DATABASE "widget_db" TO "widget_user";
GRANT ALL PRIVILEGES ON SCHEMA "widget_schema" TO "widget_user";


CREATE TABLE widget_schema.widget (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image BYTEA
);

INSERT INTO "widget_schema"."widget" ("name", "description") VALUES ('Widget 1', 'This is the first widget');
INSERT INTO "widget_schema"."widget" ("name", "description") VALUES ('Widget 2', 'This is the second widget');
INSERT INTO "widget_schema"."widget" ("name", "description") VALUES ('Widget 3', 'This is the third widget');

