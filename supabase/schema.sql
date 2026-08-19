-- ============================================================
-- Referral Links App — Supabase schema (NO LOGIN / anonymous version)
-- Run this in Supabase SQL Editor after creating your project.
-- If you previously ran the Google-auth version, run
-- supabase/reset.sql first, then this file.
-- ============================================================

-- 1. PROFILES — identified by a random ID generated in the browser
-- (stored in localStorage), NOT tied to Supabase Auth.
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  nickname text unique not null,
  avatar_url text,
  bio text,
  -- Set only for profiles created via Google sign-in; null for guests.
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  constraint nickname_length check (char_length(nickname) between 3 and 24),
  constraint bio_length check (char_length(bio) <= 140)
);

-- 2. PLATFORMS (seeded catalog: Binance, Coinbase, Amazon, etc.)
create table public.platforms (
  id serial primary key,
  name text not null,
  category text not null, -- 'crypto', 'shopping', 'other'
  logo_url text,
  sort_order int default 0,
  value_per_referral numeric(10,2) not null default 0,
  signup_url text,
  referral_info_url text,
  created_at timestamptz default now()
);

-- 3. REFERRAL LINKS (one per user per platform)
create table public.referral_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  platform_id int references public.platforms(id) on delete cascade not null,
  link text not null,
  code text,
  use_count int not null default 0,
  updated_at timestamptz default now(),
  unique (user_id, platform_id)
);

-- 4. COMMENTS (attached to a referral link / platform card)
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  referral_link_id uuid references public.referral_links(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamptz default now(),
  constraint comment_length check (char_length(body) between 1 and 1000)
);

-- 5. FEATURED LINKS — up to 2 "main" links pinned to a user's public
-- profile, separate from their full posting history in referral_links.
create table public.featured_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  position int not null check (position in (1, 2)),
  label text,
  link text not null,
  updated_at timestamptz default now(),
  unique (user_id, position)
);

-- 6. SCHEME SUGGESTIONS — "New Scheme" form submissions for platforms
-- the app is missing.
create table public.scheme_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  link text,
  notes text,
  created_at timestamptz default now(),
  constraint scheme_name_length check (char_length(name) between 2 and 60)
);

-- 7. SITE VISITS — one row per browser (via a localStorage id), used to
-- show a "Visitors" chart on the dashboard.
create table public.site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null unique,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- IMPORTANT: There is no login, so these policies are fully public.
-- Anyone can read AND write any row — including editing/deleting
-- links or comments that "belong" to someone else. This app relies
-- on the honor system, not real access control.
-- ============================================================
alter table public.profiles enable row level security;
alter table public.platforms enable row level security;
alter table public.referral_links enable row level security;
alter table public.comments enable row level security;
alter table public.featured_links enable row level security;
alter table public.scheme_suggestions enable row level security;
alter table public.site_visits enable row level security;

create policy "profiles_public_all" on public.profiles for all using (true) with check (true);
create policy "platforms_public_read" on public.platforms for select using (true);
create policy "site_visits_public_all" on public.site_visits for all using (true) with check (true);
create policy "links_public_all" on public.referral_links for all using (true) with check (true);
create policy "comments_public_all" on public.comments for all using (true) with check (true);
create policy "featured_links_public_all" on public.featured_links for all using (true) with check (true);
create policy "scheme_suggestions_public_all" on public.scheme_suggestions for all using (true) with check (true);

-- ============================================================
-- Seed platforms (starter set — extend anytime)
-- ============================================================
insert into public.platforms (name, category, sort_order, logo_url) values
  ('Binance', 'crypto', 1, '/logos/binance.jpg'),
  ('Coinbase', 'crypto', 2, '/logos/coinbase.jpg'),
  ('Kraken', 'crypto', 3, '/logos/kraken.jpg'),
  ('Bybit', 'crypto', 4, '/logos/bybit.jpg'),
  ('OKX', 'crypto', 5, '/logos/okx.jpg'),
  ('Robinhood', 'crypto', 6, '/logos/robinhood.jpg'),
  ('Gemini', 'crypto', 7, '/logos/gemini.jpg'),
  ('Crypto.com', 'crypto', 8, '/logos/cryptocom.jpg'),
  ('MEXC', 'crypto', 9, '/logos/mexc.jpg'),
  ('Hyperliquid', 'crypto', 10, '/logos/hyperliquid.png'),
  ('Amazon', 'shopping', 10, '/logos/amazon.jpg'),
  ('AliExpress', 'shopping', 11, '/logos/aliexpress.jpg'),
  ('Shein', 'shopping', 12, '/logos/shein.jpg'),
  ('TikTok Shop', 'shopping', 13, '/logos/tiktokshop.jpg'),
  ('Uber', 'other', 20, '/logos/uber.jpg'),
  ('Airbnb', 'other', 21, '/logos/airbnb.jpg'),
  ('Revolut', 'other', 22, '/logos/revolut.jpg'),
  ('Instagram', 'other', 23, '/logos/instagram.jpg'),
  ('PayPal', 'other', 24, '/logos/paypal.jpg'),
  ('Tesla', 'other', 26, '/logos/tesla.jpg'),
  ('Hostinger', 'hosting', 30, '/logos/hostinger.png'),
  ('Google Workspace', 'hosting', 31, '/logos/googleworkspace.png'),
  ('Brave Browser', 'web3', 40, '/logos/brave.jpg'),
  ('Presearch', 'web3', 41, '/logos/presearch.jpg');

-- ============================================================
-- Tracks how many times a referral link's "Copy" button was used.
-- Called from the client instead of a plain UPDATE so concurrent
-- copies always add up correctly instead of racing each other.
-- ============================================================
create or replace function public.increment_link_use(link_id uuid)
returns int
language sql
as $$
  update public.referral_links
  set use_count = use_count + 1
  where id = link_id
  returning use_count;
$$;

-- ============================================================
-- Avatar uploads (public bucket, matches the honor-system RLS above)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_public_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_public_insert" on storage.objects for insert with check (bucket_id = 'avatars');
