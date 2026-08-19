-- Adds two things, safe to run on your existing database:
--
-- 1. Avatar uploads: a public "avatars" storage bucket, with policies
--    matching this app's honor-system model (anyone can read/upload,
--    same as the profiles/referral_links/comments tables already do).
--
-- 2. Optional Google sign-in: a nullable auth_user_id column on
--    profiles, linking a profile to a Supabase Auth user when someone
--    signs in with Google instead of continuing as a guest. Guest
--    profiles simply leave this column null. No RLS changes needed —
--    the existing "profiles_public_all" policy already covers both.
--
-- Run in Supabase SQL Editor.
-- Google sign-in also requires enabling the Google provider under
-- Authentication > Providers in your Supabase dashboard, with a
-- Google Cloud OAuth client ID/secret — that part can't be done from
-- SQL and has to be set up there directly.

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_public_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_public_insert" on storage.objects for insert with check (bucket_id = 'avatars');

alter table public.profiles add column if not exists auth_user_id uuid unique references auth.users(id) on delete cascade;
