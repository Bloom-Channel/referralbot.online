-- Lets each user pin up to 2 "main" referral links that show at the
-- top of their public profile, separate from their full posting
-- history (which already lives in referral_links).
-- Safe to run on your existing database — no data loss.
-- Run in Supabase SQL Editor.

create table if not exists public.featured_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  position int not null check (position in (1, 2)),
  label text,
  link text not null,
  updated_at timestamptz default now(),
  unique (user_id, position)
);

alter table public.featured_links enable row level security;

create policy "featured_links_public_all" on public.featured_links for all using (true) with check (true);
