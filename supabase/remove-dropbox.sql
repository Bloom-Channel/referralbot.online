-- Removes Dropbox if you already ran the previous migration that added
-- it (its reward is storage, not a dollar amount, so it was dropped).
-- Safe to run even if Dropbox was never added — just deletes 0 rows.
-- Run in Supabase SQL Editor.

delete from public.platforms where name = 'Dropbox';
