-- Adds a new "Privacy Browsers & Web3 Infrastructure" category with
-- Brave Browser and Presearch.
--
-- Brave Browser: referral program pays BAT (Basic Attention Token) once
--   a referred user actively uses Brave for 30 days. Reward varies
--   $1-$7.50 by region, but Brave's own Creator/referral program states
--   "approximately 5 USD worth of promotional BAT" per referral — using
--   that as the sourced typical figure. Source: brave.com/blog/referral-program.
--   Checked August 2026.
-- Presearch: pays 50 PRE tokens per successful referral (after the
--   referred user is active 30+ days and earns 2.5+ PRE). PRE's USD
--   value is extremely volatile (roughly $0.0003-$0.002 across
--   exchanges as of August 2026), so converting 50 PRE to a stable
--   dollar figure would just be an invented calculation, not a sourced
--   fact — left at 0, same treatment as OKX's %-based commission.
--   Source: docs.presearch.io/presearch-project/presearch-project-faq/referral-id.
--
-- Run in Supabase SQL Editor.

insert into public.platforms (name, category, sort_order, logo_url, signup_url, value_per_referral) values
  ('Brave Browser', 'web3', 40, '/logos/brave.jpg', 'https://brave.com', 5),
  ('Presearch', 'web3', 41, '/logos/presearch.jpg', 'https://presearch.com', 0);
