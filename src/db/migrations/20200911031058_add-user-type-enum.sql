-- migrate:up
SET search_path TO public;
CREATE TYPE role AS ENUM (
  'guest',
  'app_user',
  'administrator',
  'moderator',
  'manager'
);
ALTER TABLE ONLY public.user
ADD roles role ARRAY NOT NULL;
-- migrate:down