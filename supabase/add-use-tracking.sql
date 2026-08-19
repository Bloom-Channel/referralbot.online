-- Adds usage tracking to referral links: a use_count column, bumped
-- each time someone copies a link, plus an atomic increment function
-- so concurrent copies don't race each other.
-- Safe to run on your existing database — no data loss.
-- Run in Supabase SQL Editor.

alter table public.referral_links add column if not exists use_count int not null default 0;

create or replace function public.increment_link_use(link_id uuid)
returns int
language sql
as $$
  update public.referral_links
  set use_count = use_count + 1
  where id = link_id
  returning use_count;
$$;
