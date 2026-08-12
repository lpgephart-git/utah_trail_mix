-- Utah Trail Mix — database schema + row-level security
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh project.

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '',
  role        text not null default 'other'
              check (role in ('teacher','nutrition','nurse','counselor','coach','admin','support','other')),
  district    text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.hikes (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  trailhead         text not null default '',
  starts_at         timestamptz not null,
  difficulty        text not null default 'easy'
                    check (difficulty in ('easy','moderate','ambitious')),
  distance_miles    numeric(5,1),
  elevation_gain_ft integer,
  notes             text,
  what_to_bring     text,
  capacity          integer,
  strava_embed      text,   -- Strava route/activity embed URL
  alltrails_url     text,
  gmaps_url         text,   -- trailhead directions link
  status            text not null default 'draft'
                    check (status in ('draft','published')),
  created_by        uuid references public.profiles (id) on delete set null,
  created_at        timestamptz not null default now()
);

create table if not exists public.rsvps (
  id         uuid primary key default gen_random_uuid(),
  hike_id    uuid not null references public.hikes (id) on delete cascade,
  member_id  uuid not null references public.profiles (id) on delete cascade,
  guests     integer not null default 0 check (guests >= 0 and guests <= 5),
  carpool    text check (carpool in ('drive','need_ride','meet_there')),
  created_at timestamptz not null default now(),
  unique (hike_id, member_id)
);

create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  hike_id    uuid not null references public.hikes (id) on delete cascade,
  member_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists hikes_starts_at_idx on public.hikes (starts_at);
create index if not exists rsvps_hike_idx on public.rsvps (hike_id);
create index if not exists comments_hike_idx on public.comments (hike_id, created_at);

-- ─────────────────────────────────────────────────────────────
-- New-user trigger: create a profile row from signup metadata
-- ─────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, district)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'other'),
    new.raw_user_meta_data ->> 'district'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is the current user an admin? SECURITY DEFINER avoids recursive
-- RLS evaluation when policies on other tables check admin status.
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ─────────────────────────────────────────────────────────────
-- View: hikes with going counts (respects caller's RLS)
-- ─────────────────────────────────────────────────────────────

create or replace view public.hikes_with_counts as
  select h.*,
         coalesce(r.going_count, 0)::int as going_count
  from public.hikes h
  left join (
    select hike_id, sum(1 + guests) as going_count
    from public.rsvps
    group by hike_id
  ) r on r.hike_id = h.id;

alter view public.hikes_with_counts set (security_invoker = on);

-- ─────────────────────────────────────────────────────────────
-- Row-level security
-- ─────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.hikes    enable row level security;
alter table public.rsvps    enable row level security;
alter table public.comments enable row level security;

-- profiles: members see each other (names on comments/RSVPs); edit only self.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated using (true);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- hikes: anyone may read PUBLISHED hikes; admins read/write everything.
drop policy if exists hikes_select_published on public.hikes;
create policy hikes_select_published on public.hikes
  for select using (status = 'published' or public.is_admin());

drop policy if exists hikes_admin_write on public.hikes;
create policy hikes_admin_write on public.hikes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- rsvps: everyone can read counts/attendees; members manage their own row.
drop policy if exists rsvps_select on public.rsvps;
create policy rsvps_select on public.rsvps
  for select using (true);

drop policy if exists rsvps_insert_self on public.rsvps;
create policy rsvps_insert_self on public.rsvps
  for insert to authenticated with check (member_id = auth.uid());

drop policy if exists rsvps_update_self on public.rsvps;
create policy rsvps_update_self on public.rsvps
  for update to authenticated using (member_id = auth.uid()) with check (member_id = auth.uid());

drop policy if exists rsvps_delete_self on public.rsvps;
create policy rsvps_delete_self on public.rsvps
  for delete to authenticated using (member_id = auth.uid());

-- comments: readable by all; authored by self; deletable by author or admin.
drop policy if exists comments_select on public.comments;
create policy comments_select on public.comments
  for select using (true);

drop policy if exists comments_insert_self on public.comments;
create policy comments_insert_self on public.comments
  for insert to authenticated with check (member_id = auth.uid());

drop policy if exists comments_delete_own_or_admin on public.comments;
create policy comments_delete_own_or_admin on public.comments
  for delete to authenticated using (member_id = auth.uid() or public.is_admin());
