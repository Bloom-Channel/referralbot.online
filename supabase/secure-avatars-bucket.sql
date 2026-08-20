-- Security hardening: the avatars bucket previously had no file-size
-- limit and no MIME-type restriction. Since uploads are honor-system
-- public (anyone with the anon key can insert), this meant anyone could
-- upload arbitrarily large or arbitrary-type files at unbounded storage
-- cost. This caps uploads to 15MB (covers the largest expected sticker/
-- video avatar) and restricts to the file types the app actually renders.
-- Run in Supabase SQL Editor.

update storage.buckets
set
  file_size_limit = 15728640, -- 15MB
  allowed_mime_types = array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/quicktime',
    'application/json', 'application/gzip', 'application/x-gzip'
  ]
where id = 'avatars';
