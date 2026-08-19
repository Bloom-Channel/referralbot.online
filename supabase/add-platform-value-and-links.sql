-- Adds:
-- 1. value_per_referral — the $ payout/bonus for one referral on that
--    platform, used to show a dollar total next to referral counts.
--    Defaults to 0 (hidden in the UI until you set a real number —
--    these amounts vary by platform/region/promo and change often,
--    so they're intentionally left for you to fill in, not guessed).
-- 2. signup_url — powers the "Register" button on the platform page.
--    Filled in below with each platform's official homepage.
-- 3. referral_info_url — powers the "<Platform> referral info page"
--    button. Left blank here since the exact program page differs a
--    lot per platform and changes over time — fill in the ones you
--    want; the button just won't render for platforms left null.
--
-- Safe to run on your existing database — no data loss.
-- Run in Supabase SQL Editor.

alter table public.platforms add column if not exists value_per_referral numeric(10,2) not null default 0;
alter table public.platforms add column if not exists signup_url text;
alter table public.platforms add column if not exists referral_info_url text;

update public.platforms set signup_url = 'https://www.binance.com' where name = 'Binance';
update public.platforms set signup_url = 'https://www.coinbase.com' where name = 'Coinbase';
update public.platforms set signup_url = 'https://www.kraken.com' where name = 'Kraken';
update public.platforms set signup_url = 'https://www.bybit.com' where name = 'Bybit';
update public.platforms set signup_url = 'https://www.okx.com' where name = 'OKX';
update public.platforms set signup_url = 'https://www.amazon.com' where name = 'Amazon';
update public.platforms set signup_url = 'https://www.aliexpress.com' where name = 'AliExpress';
update public.platforms set signup_url = 'https://www.shein.com' where name = 'Shein';
update public.platforms set signup_url = 'https://www.uber.com' where name = 'Uber';
update public.platforms set signup_url = 'https://www.airbnb.com' where name = 'Airbnb';
update public.platforms set signup_url = 'https://www.revolut.com' where name = 'Revolut';

-- Example — uncomment/edit once you've confirmed the real URL and $ value:
-- update public.platforms set
--   referral_info_url = 'https://www.binance.com/en/support/faq/binance-referral-program',
--   value_per_referral = 10
-- where name = 'Binance';
