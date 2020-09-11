-- migrate:up
SET search_path TO public;
CREATE TYPE role AS ENUM (
  'guest',
  'app-user',
  'administrator',
  'moderator',
  'manager'
);
ALTER TABLE ONLY public.user
ADD roles role DEFAULT 'app-user';
-- migrate:down