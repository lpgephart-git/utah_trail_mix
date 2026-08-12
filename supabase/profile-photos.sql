-- Utah Trail Mix — profile photos
-- Run in the Supabase SQL editor after schema.sql.

alter table public.profiles add column if not exists avatar_path text;

-- Public bucket for profile photos.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Anyone can view avatars; members upload/replace/delete only in their own folder
-- (path prefix = their user id).
drop policy if exists avatars_read on storage.objects;
create policy avatars_read on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists avatars_insert on storage.objects;
create policy avatars_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists avatars_update on storage.objects;
create policy avatars_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists avatars_delete on storage.objects;
create policy avatars_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
