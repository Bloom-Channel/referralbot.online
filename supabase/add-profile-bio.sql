-- Adds an optional short bio/motto line to profiles, shown under the
-- display picture on a user's public profile page.
-- Run in Supabase SQL Editor.

alter table public.profiles add column if not exists bio text;
alter table public.profiles add constraint bio_length check (char_length(bio) <= 140);
