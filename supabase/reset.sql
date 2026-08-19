-- Run this ONLY if you previously applied the old (Google-auth) schema
-- and need to switch to the new no-login version. This drops all
-- app data. Then run schema.sql fresh.

drop table if exists public.comments cascade;
drop table if exists public.referral_links cascade;
drop table if exists public.platforms cascade;
drop table if exists public.profiles cascade;
