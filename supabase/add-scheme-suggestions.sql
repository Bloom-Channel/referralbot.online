-- Lets users suggest a platform/exchange the app is missing, via the
-- "New Scheme" button in the header. Same honor-system model as the
-- rest of the app — anyone can read/write, no real access control.
-- Run in Supabase SQL Editor.

create table if not exists public.scheme_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  link text,
  notes text,
  created_at timestamptz default now(),
  constraint scheme_name_length check (char_length(name) between 2 and 60)
);

alter table public.scheme_suggestions enable row level security;

create policy "scheme_suggestions_public_all" on public.scheme_suggestions for all using (true) with check (true);
