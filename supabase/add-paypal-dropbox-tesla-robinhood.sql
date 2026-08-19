-- Adds PayPal, Tesla, and Robinhood as platforms.
-- (Airbnb already exists — not touched here. Dropbox was intentionally
-- left out — see remove-dropbox.sql if you already added it.)
--
-- Values sourced from each program's current terms (checked August 2026):
--
-- PayPal: flat $10 bonus per successful referral (US program).
-- Tesla: referrer gets $250 in Tesla Credits per successful referral.
-- Robinhood: reward is a random stock worth $5-$200, but ~99% of the
--   time it's actually $5 — using that realistic typical value rather
--   than the rare $200 max. Filed under 'crypto' alongside the other
--   exchanges since it supports crypto trading (it's really a
--   multi-asset brokerage, not crypto-only, but this is the closest fit).
--
-- Run in Supabase SQL Editor.

insert into public.platforms (name, category, sort_order, logo_url, signup_url, value_per_referral) values
  ('PayPal', 'other', 24, '/logos/paypal.jpg', 'https://www.paypal.com', 10),
  ('Tesla', 'other', 26, '/logos/tesla.jpg', 'https://www.tesla.com', 250),
  ('Robinhood', 'crypto', 6, '/logos/robinhood.jpg', 'https://robinhood.com', 5);
