-- Utah Trail Mix — community feed (posts, replies, likes, photo storage)
-- Run this in the Supabase SQL editor after schema.sql.

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────

create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles (id) on delete cascade,
  body        text not null default '' check (char_length(body) <= 5000),
  image_path  text,
  created_at  timestamptz not null default now()
);

create table if not exists public.post_comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts (id) on delete cascade,
  author_id   uuid not null references public.profiles (id) on delete cascade,
  body        text not null check (char_length(body) between 1 and 2000),
  created_at  timestamptz not null default now()
);

create table if not exists public.post_likes (
  post_id    uuid not null references public.posts (id) on delete cascade,
  member_id  uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, member_id)
);

create index if not exists posts_created_idx on public.posts (created_at desc);
create index if not exists post_comments_post_idx on public.post_comments (post_id, created_at);

-- A post must have text or an image (no empty posts).
alter table public.posts drop constraint if exists posts_not_empty;
alter table public.posts add constraint posts_not_empty
  check (char_length(body) > 0 or image_path is not null);

-- ─────────────────────────────────────────────────────────────
-- Row-level security — members-only feed; authors own their content
-- ─────────────────────────────────────────────────────────────

alter table public.posts         enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_likes    enable row level security;

drop policy if exists posts_select on public.posts;
create policy posts_select on public.posts
  for select to authenticated using (true);

drop policy if exists posts_insert_self on public.posts;
create policy posts_insert_self on public.posts
  for insert to authenticated with check (author_id = auth.uid());

drop policy if exists posts_delete_own_or_admin on public.posts;
create policy posts_delete_own_or_admin on public.posts
  for delete to authenticated using (author_id = auth.uid() or public.is_admin());

drop policy if exists post_comments_select on public.post_comments;
create policy post_comments_select on public.post_comments
  for select to authenticated using (true);

drop policy if exists post_comments_insert_self on public.post_comments;
create policy post_comments_insert_self on public.post_comments
  for insert to authenticated with check (author_id = auth.uid());

drop policy if exists post_comments_delete_own_or_admin on public.post_comments;
create policy post_comments_delete_own_or_admin on public.post_comments
  for delete to authenticated using (author_id = auth.uid() or public.is_admin());

drop policy if exists post_likes_select on public.post_likes;
create policy post_likes_select on public.post_likes
  for select to authenticated using (true);

drop policy if exists post_likes_write_self on public.post_likes;
create policy post_likes_write_self on public.post_likes
  for all to authenticated using (member_id = auth.uid()) with check (member_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- Storage: public bucket for post photos
-- ─────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Anyone can view images; authenticated members can upload to their own folder
-- (path prefix = their user id). Deletes limited to the owner.
drop policy if exists post_images_read on storage.objects;
create policy post_images_read on storage.objects
  for select using (bucket_id = 'post-images');

drop policy if exists post_images_insert on storage.objects;
create policy post_images_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists post_images_delete on storage.objects;
create policy post_images_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
