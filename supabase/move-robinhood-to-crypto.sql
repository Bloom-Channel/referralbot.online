-- Moves Robinhood from "More" into "Crypto Exchanges" — it supports
-- crypto trading, so it fits alongside the other exchanges even though
-- it's really a multi-asset brokerage, not crypto-only.
-- Run in Supabase SQL Editor.

update public.platforms set category = 'crypto', sort_order = 6 where name = 'Robinhood';
