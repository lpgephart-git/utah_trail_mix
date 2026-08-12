-- Utah Trail Mix — real 2026–2027 schedule (3rd Saturdays).
-- Non-destructive: re-dates the existing hikes (preserving any Strava embeds)
-- and adds Silver Lake. Run once in the Supabase SQL editor.

-- 2026 kickoff pair
update public.hikes set starts_at = '2026-09-19 15:00:00+00'  -- Sat 9:00 AM MDT
  where title = 'Ensign Peak — season kickoff';
update public.hikes set starts_at = '2026-10-17 15:00:00+00'  -- Sat 9:00 AM MDT
  where title = 'The Living Room';

-- 2027 summer series (earlier starts to beat the heat)
update public.hikes set starts_at = '2027-05-15 15:00:00+00'  -- Sat 9:00 AM MDT
  where title = 'City Creek Canyon stroll';
update public.hikes set starts_at = '2027-06-19 14:00:00+00'  -- Sat 8:00 AM MDT
  where title = 'Mount Van Cott';
update public.hikes set starts_at = '2027-07-17 14:00:00+00'  -- Sat 8:00 AM MDT
  where title = 'Cecret Lake, Albion Basin';

-- New: Silver Lake (Brighton) — Aug 2027
insert into public.hikes
  (title, trailhead, starts_at, difficulty, distance_miles, elevation_gain_ft,
   notes, what_to_bring, alltrails_url, gmaps_url, status)
select
  'Silver Lake, Brighton',
  'Silver Lake Trailhead, Brighton (Big Cottonwood Canyon)',
  '2027-08-21 14:00:00+00',   -- Sat 8:00 AM MDT
  'easy', 0.9, 62,
  'A flat, wheelchair-accessible boardwalk loop around an alpine lake at 8,760 ft — cool and gorgeous in late summer, and the most accessible trail in the Wasatch. Big Cottonwood is a paid parking (REA) area; carpool and bring a day-use pass.',
  'Water, sun protection, a layer, day-use parking pass.',
  'https://www.alltrails.com/trail/us/utah/silver-lake-loop-trail',
  'https://maps.google.com/?q=Silver+Lake+Trailhead+Brighton+Utah',
  'published'
where not exists (
  select 1 from public.hikes where title = 'Silver Lake, Brighton'
);
