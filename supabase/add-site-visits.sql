-- Tracks unique visitors (one row per browser, via a localStorage id) so
-- the dashboard can show a "Visitors" chart. Same honor-system model as
-- the rest of the app.
-- Run in Supabase SQL Editor.

create table public.site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null unique,
  created_at timestamptz default now()
);

alter table public.site_visits enable row level security;

create policy "site_visits_public_all" on public.site_visits for all using (true) with check (true);
