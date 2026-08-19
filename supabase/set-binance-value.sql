-- Sets Binance's real per-referral $ value (used by the dashboard's
-- dollar-value doughnut chart). Add more of these as you confirm real
-- numbers for other platforms.
-- Run in Supabase SQL Editor.

update public.platforms set value_per_referral = 15 where name = 'Binance';
