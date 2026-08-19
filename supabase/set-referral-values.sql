-- Default $ value per successful referral, sourced from each platform's
-- own current referral-program terms (checked August 2026). These are
-- flat "existing user's reward per referral" figures where the program
-- actually pays one — not the "up to $X" new-user marketing headlines,
-- which are maximums, not typical amounts.
--
-- A few platforms don't have a fixed flat reward (their programs are
-- trading-fee-commission-based, percentage-discount-based, or the
-- referral program is currently paused) — those are left at 0 rather
-- than guessing a number. Update them yourself if/when you know a real
-- figure for your account's offer.
--
-- Run in Supabase SQL Editor.

-- Binance: kept at the value you set — your own real referral figure
-- takes priority over generic program terms.
update public.platforms set value_per_referral = 15 where name = 'Binance';

-- Coinbase: flat $10 bonus for each successful referral (existing user side).
update public.platforms set value_per_referral = 10 where name = 'Coinbase';

-- Kraken: flat $75 per successful referral.
update public.platforms set value_per_referral = 75 where name = 'Kraken';

-- Bybit: baseline flat task bonus is 10 USDT (program otherwise pays
-- variable trading-fee commission, not a fixed per-referral amount).
update public.platforms set value_per_referral = 10 where name = 'Bybit';

-- OKX: referral program pays a % of the referred user's trading fees,
-- not a fixed amount — left at 0. Set a real figure if you know your
-- actual commission rate and typical referral volume.
update public.platforms set value_per_referral = 0 where name = 'OKX';

-- Amazon: no standard flat customer "refer a friend" reward program
-- exists (only Prime Card / employee / seller referral programs, which
-- don't apply here) — left at 0.
update public.platforms set value_per_referral = 0 where name = 'Amazon';

-- AliExpress: up to $5 in coupons per successful referral.
update public.platforms set value_per_referral = 5 where name = 'AliExpress';

-- Shein: reward is a 15%-off coupon, not a fixed dollar amount — left
-- at 0. Set a figure yourself if you want to approximate it against a
-- typical order size (e.g. 15% of a $30 order ≈ $4.50).
update public.platforms set value_per_referral = 0 where name = 'Shein';

-- Uber: flat $5 off next ride when a referred rider completes their
-- first trip.
update public.platforms set value_per_referral = 5 where name = 'Uber';

-- Airbnb: guest referral program is currently paused; the $720 figure
-- that exists is for referring new hosts, not guests — left at 0.
update public.platforms set value_per_referral = 0 where name = 'Airbnb';

-- Revolut: varies by region/promo (roughly $10-$25 in the US) — using
-- the conservative low end.
update public.platforms set value_per_referral = 10 where name = 'Revolut';
