-- Adds Hyperliquid as a crypto exchange platform.
-- Referral program pays 10% of referred users' trading fees (commission-
-- based, no flat per-referral bonus), so value_per_referral is left at 0
-- rather than inventing a number — same treatment as OKX.
-- Source: hyperliquid.gitbook.io/hyperliquid-docs/referrals. Checked August 2026.
-- Run in Supabase SQL Editor.

insert into public.platforms (name, category, sort_order, logo_url, signup_url, referral_info_url, value_per_referral) values
  ('Hyperliquid', 'crypto', 10, '/logos/hyperliquid.png', 'https://hyperliquid.xyz', 'https://hyperliquid.gitbook.io/hyperliquid-docs/referrals', 0);
