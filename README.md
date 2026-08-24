# Referralbot.online

A webapp for users to share and browse referral links for crypto exchanges, shopping apps, and other services. **No login** — pick a nickname, share links, comment. Everything is public.

## ⚠️ Security note
There is no authentication. Identity is a random ID stored in the visitor's browser (`localStorage`), used only so the UI can show "your" links. It is **not verified server-side** — anyone can edit or delete anyone else's referral link or comment via the API directly, not just through the UI. This is an intentional tradeoff for a no-login app; don't use it for anything where impersonation or vandalism would be a real problem.

## Stack (all free tier)
- **Next.js 14** (App Router) — frontend
- **Supabase** — Postgres DB + Storage only (no Auth used)
- **Vercel** — hosting (recommended, not yet deployed)

## Local setup
1. `npm install`
2. Create a free project at supabase.com
3. In Supabase SQL Editor:
   - If this is a fresh project: run `supabase/schema.sql`
   - If you previously set up the Google-auth version: run `supabase/reset.sql` first, then `supabase/schema.sql`
4. In Supabase → Storage, create a public bucket named `avatars`
5. Copy `.env.example` → `.env.local` and fill in your Supabase URL + anon key (found in Supabase → Project Settings → API Keys)
6. `npm run dev` → http://localhost:3000

## Data model
- `profiles` — one per visitor, unique `nickname`, avatar, random `id` (not linked to any auth system)
- `platforms` — seeded catalog (Binance, Coinbase, Amazon, etc.), grouped by `category`
- `referral_links` — one per (profile, platform); fully public read/write
- `comments` — attached to a referral link; fully public read/write

All Row Level Security policies (see `supabase/schema.sql`) are open — `using (true)` — since there's no session to check identity against.

## User journey
1. Land on `/` → prompted to pick a nickname (checked for uniqueness), stored in `localStorage`
2. Dashboard → cards grouped by category (crypto exchanges, shopping, other)
3. Click a card → `/platform/[id]` → set/update your own referral link, view everyone else's, comment

## Status
Scaffold complete, not yet deployed or tested end-to-end. Next steps:
- [ ] Run `npm install` and verify local dev server
- [ ] Create Supabase project + apply schema
- [ ] Deploy to Vercel
- [ ] Add platform logos
- [ ] Test nickname uniqueness manually
- [ ] Decide if any write-protection (e.g. a per-browser secret token) is worth adding later

## Cost controls
No API keys are hardcoded anywhere in this repo — only read from environment variables (`.env.local`, gitignored). Supabase and Vercel free tiers are sufficient for development; no paid API is currently wired in.
