-- Adds "FA" (postee.substack.com), the site owner's own newsletter, as a
-- platform. Substack's referral rewards are fully creator-configured (no
-- universal figure to source), so the $10 value here is the flat amount
-- the owner has set for their own publication's referral tiers.
-- Run in Supabase SQL Editor.

insert into public.platforms (name, category, sort_order, logo_url, signup_url, value_per_referral) values
  ('FA', 'other', 27, '/logos/postee.jpg', 'https://postee.substack.com', 10);
