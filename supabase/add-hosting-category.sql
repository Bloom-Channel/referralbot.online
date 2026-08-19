-- Adds a new "Web Hosting & Business Software" category with Hostinger
-- and Google Workspace.
--
-- Both programs pay a range depending on plan tier, so we use each
-- program's own stated baseline/typical figure rather than the max
-- (same approach as Robinhood's realistic-typical value):
--
-- Hostinger: commissions are 40%+ per sale, described on Hostinger's
--   own site as "$50-150 per referral" for standard plans (up to $450
--   only on the priciest plans) — using $50, the low end of their own
--   stated typical range. Source: hostinger.com. Checked August 2026.
-- Google Workspace Referral Program: pays per user added under a
--   referred business domain; the Business Starter plan (entry tier)
--   pays $8/user in the US. Source: workspace.google.com/referral-program.
--   Checked August 2026.
--
-- Run in Supabase SQL Editor.

insert into public.platforms (name, category, sort_order, logo_url, signup_url, value_per_referral) values
  ('Hostinger', 'hosting', 30, '/logos/hostinger.png', 'https://www.hostinger.com', 50),
  ('Google Workspace', 'hosting', 31, '/logos/googleworkspace.png', 'https://workspace.google.com', 8);
