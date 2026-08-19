-- Adds Gemini as a crypto exchange platform.
--
-- Gemini's "Referral Club" pays a flat $50 in crypto when a referred
-- friend trades at least $100 within 30 days of signing up (checked
-- August 2026). Above certain trading volumes it switches to a
-- commission-based rate instead, but $50 is the standard flat reward.
--
-- Run in Supabase SQL Editor.

insert into public.platforms (name, category, sort_order, logo_url, signup_url, value_per_referral) values
  ('Gemini', 'crypto', 7, '/logos/gemini.jpg', 'https://www.gemini.com', 50);
