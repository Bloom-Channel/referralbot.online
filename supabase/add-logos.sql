-- Points platform logos at image files bundled with the app (public/logos/*.jpg)
-- instead of third-party CDNs, so they never break or show as broken links.
-- Safe to run on your existing database — only updates logo_url, no data loss.
-- Run in Supabase SQL Editor.

update public.platforms set logo_url = '/logos/binance.jpg' where name = 'Binance';
update public.platforms set logo_url = '/logos/coinbase.jpg' where name = 'Coinbase';
update public.platforms set logo_url = '/logos/kraken.jpg' where name = 'Kraken';
update public.platforms set logo_url = '/logos/bybit.jpg' where name = 'Bybit';
update public.platforms set logo_url = '/logos/okx.jpg' where name = 'OKX';
update public.platforms set logo_url = '/logos/amazon.jpg' where name = 'Amazon';
update public.platforms set logo_url = '/logos/aliexpress.jpg' where name = 'AliExpress';
update public.platforms set logo_url = '/logos/shein.jpg' where name = 'Shein';
update public.platforms set logo_url = '/logos/uber.jpg' where name = 'Uber';
update public.platforms set logo_url = '/logos/airbnb.jpg' where name = 'Airbnb';
update public.platforms set logo_url = '/logos/revolut.jpg' where name = 'Revolut';

-- If you add more platforms later: drop an SVG/PNG into public/logos/
-- and set logo_url to '/logos/your-file.jpg'.
