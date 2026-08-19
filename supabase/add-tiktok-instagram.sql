-- Adds TikTok Shop and Instagram as platforms.
--
-- TikTok Shop: has a real (if creator-focused, region/campaign-limited)
-- Creator Referral Program — e.g. a UK campaign paying a £100 gift
-- card per qualifying referral. Not an evergreen fixed-$ program, so
-- value_per_referral is left at 0; set it yourself if you know your
-- current campaign's real payout.
--
-- Instagram: ran a "Referrals" program paying US creators $100 per
-- signup + $100 per 1,000 off-platform visits — but it was a
-- time-limited 6-week pilot (May-June), not a standing program.
-- Left at 0 for the same reason.
--
-- Facebook was NOT added — no evidence of an actual monetized
-- refer-a-friend program was found, just a general friend-suggestions
-- help article.
--
-- Run in Supabase SQL Editor.

insert into public.platforms (name, category, sort_order, logo_url, signup_url) values
  ('TikTok Shop', 'shopping', 13, '/logos/tiktokshop.jpg', 'https://www.tiktok.com/shop'),
  ('Instagram', 'other', 23, '/logos/instagram.jpg', 'https://www.instagram.com');
