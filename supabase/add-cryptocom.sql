-- Adds Crypto.com as a crypto exchange platform.
-- Value ($10 per referral) set per your instruction.
-- Run in Supabase SQL Editor.

insert into public.platforms (name, category, sort_order, logo_url, signup_url, value_per_referral) values
  ('Crypto.com', 'crypto', 8, '/logos/cryptocom.jpg', 'https://crypto.com', 10);
