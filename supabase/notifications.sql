-- Utah Trail Mix — in-app notifications for the community feed.
-- Run in the Supabase SQL editor after community.sql.

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade, -- recipient
  actor_id   uuid references public.profiles (id) on delete cascade,          -- who acted
  type       text not null check (type in ('reply', 'like')),
  post_id    uuid references public.posts (id) on delete cascade,
  comment_id uuid references public.post_comments (id) on delete cascade,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, read, created_at desc);

alter table public.notifications enable row level security;

-- Recipients read / update / delete only their own. No direct INSERT policy —
-- rows are created by the SECURITY DEFINER triggers below.
drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications
  for select to authenticated using (user_id = auth.uid());

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists notifications_delete_own on public.notifications;
create policy notifications_delete_own on public.notifications
  for delete to authenticated using (user_id = auth.uid());

-- Reply → notify the post's author (unless replying to yourself).
create or replace function public.notify_on_comment()
returns trigger language plpgsql security definer set search_path = public as $$
declare author uuid;
begin
  select author_id into author from public.posts where id = NEW.post_id;
  if author is not null and author <> NEW.author_id then
    insert into public.notifications (user_id, actor_id, type, post_id, comment_id)
    values (author, NEW.author_id, 'reply', NEW.post_id, NEW.id);
  end if;
  return NEW;
end; $$;

drop trigger if exists on_comment_notify on public.post_comments;
create trigger on_comment_notify
  after insert on public.post_comments
  for each row execute function public.notify_on_comment();

-- Like → notify the post's author (unless liking your own post).
create or replace function public.notify_on_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare author uuid;
begin
  select author_id into author from public.posts where id = NEW.post_id;
  if author is not null and author <> NEW.member_id then
    insert into public.notifications (user_id, actor_id, type, post_id)
    values (author, NEW.member_id, 'like', NEW.post_id);
  end if;
  return NEW;
end; $$;

drop trigger if exists on_like_notify on public.post_likes;
create trigger on_like_notify
  after insert on public.post_likes
  for each row execute function public.notify_on_like();

-- Unlike → remove the matching like notification (keeps toggling from piling up).
create or replace function public.cleanup_like_notification()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  delete from public.notifications
  where type = 'like' and post_id = OLD.post_id and actor_id = OLD.member_id;
  return OLD;
end; $$;

drop trigger if exists on_like_delete_notify on public.post_likes;
create trigger on_like_delete_notify
  after delete on public.post_likes
  for each row execute function public.cleanup_like_notification();
