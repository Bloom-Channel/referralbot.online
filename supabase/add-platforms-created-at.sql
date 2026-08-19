-- Tracks when each platform/program was added, so the "Latest Activity"
-- feed can show the most recently added programs.
-- Run in Supabase SQL Editor.

alter table public.platforms add column if not exists created_at timestamptz default now();
