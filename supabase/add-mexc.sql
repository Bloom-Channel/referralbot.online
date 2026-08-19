-- Adds MEXC as a crypto exchange platform.
-- Value ($25 per referral) set per your instruction.
-- Run in Supabase SQL Editor.

insert into public.platforms (name, category, sort_order, logo_url, signup_url, value_per_referral) values
  ('MEXC', 'crypto', 9, '/logos/mexc.jpg', 'https://www.mexc.com', 25);
