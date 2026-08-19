-- Adds an optional short "referral code" field, separate from the full
-- link (e.g. a signup code like "OP6AUB8A" alongside the URL). Safe to
-- run on your existing database — no data loss.
-- Run in Supabase SQL Editor.

alter table public.referral_links add column if not exists code text;
