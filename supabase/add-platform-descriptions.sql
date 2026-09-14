-- Adds unique, original descriptive text for each platform page.
-- Run this in the Supabase SQL Editor, then redeploy the app.

alter table public.platforms add column if not exists description text;

update public.platforms set description = 'Binance is the world''s largest crypto exchange by trading volume, offering spot, futures, and staking on hundreds of coins. New users who sign up with a referral link typically get a trading fee discount, and the person sharing the link earns a share of trading fees from anyone who joins through it.' where name = 'Binance';

update public.platforms set description = 'Coinbase is a US-listed crypto exchange built for beginners, with a simple buy/sell interface and its own Coinbase Wallet app. Referral rewards are usually paid out once the invited friend buys or trades a set amount of crypto within their first few weeks.' where name = 'Coinbase';

update public.platforms set description = 'Kraken is a long-running crypto exchange known for its security track record and deep liquidity on major coins. Its referral program pays out in crypto once a referred trader meets a minimum funded-and-traded threshold, which is why Kraken referrals tend to carry a higher payout than most exchanges.' where name = 'Kraken';

update public.platforms set description = 'Bybit is a derivatives-focused crypto exchange popular for futures and copy trading. Its referral program rewards both sides with trading fee rebates or bonus vouchers once the invited trader completes a qualifying deposit and trade.' where name = 'Bybit';

update public.platforms set description = 'OKX is a global crypto exchange offering spot trading, derivatives, and a Web3 wallet. Its referral scheme is commission-based, giving the referrer an ongoing percentage of the fees their invited traders generate rather than a one-time payout.' where name = 'OKX';

update public.platforms set description = 'Amazon is the largest online marketplace worldwide, selling everything from electronics to groceries with fast Prime shipping. Rather than a cash referral bonus, links shared here are typically Amazon affiliate or Prime trial links that give the person clicking a discount or free trial.' where name = 'Amazon';

update public.platforms set description = 'AliExpress is a global marketplace for budget electronics, fashion, and home goods shipped directly from manufacturers, mostly based in China. Its referral links usually unlock a coupon or discount code for the new shopper''s first order.' where name = 'AliExpress';

update public.platforms set description = 'Shein is a fast-fashion retailer known for very low prices on trend-driven clothing and accessories. Referral links here typically apply a percentage-off coupon to the new customer''s first purchase.' where name = 'Shein';

update public.platforms set description = 'Uber is a ride-hailing and food delivery app available in cities worldwide. New riders who sign up through a referral link commonly receive a discount on their first few rides, and the referrer earns ride credit once the new user completes a trip.' where name = 'Uber';

update public.platforms set description = 'Airbnb lets hosts list spare rooms or entire homes for short-term stays, and travelers book them directly through the app. Referral links here usually give a new guest travel credit toward their first booking.' where name = 'Airbnb';

update public.platforms set description = 'Revolut is a UK-founded fintech app offering multi-currency accounts, budgeting tools, and a debit card with no foreign transaction fees. Referral bonuses are paid in cash once the new user tops up their account and makes a card purchase.' where name = 'Revolut';

update public.platforms set description = 'TikTok Shop is TikTok''s built-in e-commerce marketplace, letting creators and sellers list products directly inside the app. Referral links here are typically seller or affiliate links that earn commission when a purchase is made through them.' where name = 'TikTok Shop';

update public.platforms set description = 'Instagram is Meta''s photo and video sharing app, widely used for creator content and small-business storefronts. Links shared here are usually profile or creator referral links rather than a cash-bonus program, since Instagram itself has no official referral payout.' where name = 'Instagram';

update public.platforms set description = 'PayPal is a widely used online payment service for sending money and checking out on millions of websites. Its referral program pays a cash bonus once the invited user links a funding source and sends or receives a qualifying payment.' where name = 'PayPal';

update public.platforms set description = 'Tesla sells electric vehicles, solar panels, and home battery systems directly to consumers. Its referral program is one of the highest-value on this site, giving both the referrer and the new buyer credit toward products like charging or accessories after a qualifying purchase.' where name = 'Tesla';

update public.platforms set description = 'Robinhood is a commission-free US stock and crypto trading app aimed at first-time investors. Its referral program typically grants a free stock or a small cash bonus to both parties once the new user links a bank account and funds it.' where name = 'Robinhood';

update public.platforms set description = 'Gemini is a US-regulated crypto exchange founded by the Winklevoss twins, known for its compliance-first approach. Referral bonuses here are usually paid in crypto once the invited user completes a qualifying trade, which is why Gemini''s payout tends to run higher than average.' where name = 'Gemini';

update public.platforms set description = 'Hostinger is a web hosting provider offering shared hosting, VPS, and domain registration at budget-friendly prices. Its affiliate program pays a fixed commission for every new customer who purchases a hosting plan through a referral link.' where name = 'Hostinger';

update public.platforms set description = 'Google Workspace bundles Gmail, Docs, Drive, and Meet into a paid productivity suite for businesses and teams. Referral links here typically come from Google''s official partner program, which pays a bonus once a referred business signs up for a paid plan.' where name = 'Google Workspace';

update public.platforms set description = 'Brave is a privacy-focused web browser that blocks ads and trackers by default and rewards users with its own BAT token for opting into privacy-respecting ads. Referral links reward both the new user and the referrer with BAT once the new browser install meets a minimum usage threshold.' where name = 'Brave Browser';

update public.platforms set description = 'Presearch is a decentralized search engine that rewards users with its own PRE token for searching instead of, or alongside, engines like Google. Referral links grant a small token bonus once the invited user completes a set number of searches.' where name = 'Presearch';

update public.platforms set description = 'Crypto.com is a crypto exchange and card issuer known for its Visa debit cards that pay crypto cashback on purchases. Referral bonuses are typically paid in CRO or stablecoin once the new user funds their account and stakes for a card.' where name = 'Crypto.com';

update public.platforms set description = 'MEXC is a crypto exchange offering an unusually wide range of altcoins and low trading fees. Its referral program pays out a share of trading fees generated by the invited trader, and the payout listed here reflects MEXC''s typically generous commission split.' where name = 'MEXC';
