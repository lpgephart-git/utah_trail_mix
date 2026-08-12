-- Utah Trail Mix — the 2026–2027 schedule (fresh-install seed).
-- Six hikes, all under 3 miles, verified AllTrails links, 3rd-Saturday dates.
-- Times are UTC; they display in America/Denver on the site.
-- For an already-populated DB, use supabase/schedule.sql (non-destructive) instead.

-- If re-running on a DB that already has these, clear first:
--   delete from public.hikes;

insert into public.hikes
  (title, trailhead, starts_at, difficulty, distance_miles, elevation_gain_ft,
   notes, what_to_bring, alltrails_url, gmaps_url, status)
values
  (
    'Ensign Peak — season kickoff',
    'Ensign Peak Trailhead, Salt Lake City',
    '2026-09-19 15:00:00+00', 'easy', 0.9, 374,
    'Our season kickoff! A short, rewarding climb to an iconic view of the whole valley. Free parking, all fitness levels welcome. We''ll grab coffee nearby afterward to say hello.',
    'Water, comfortable shoes, a light layer, sunscreen.',
    'https://www.alltrails.com/trail/us/utah/ensign-peak-trail-and-overlook',
    'https://maps.google.com/?q=Ensign+Peak+Trailhead', 'published'
  ),
  (
    'The Living Room',
    'Living Room Trailhead, Salt Lake City foothills',
    '2026-10-17 15:00:00+00', 'moderate', 2.3, 971,
    'A foothill favorite above the U — free parking and stone "chairs" with a sweeping valley view, timed for fall color. A steady but manageable climb.',
    'Water, layers, comfortable shoes.',
    'https://www.alltrails.com/trail/us/utah/the-living-room-lookout-trail',
    'https://maps.google.com/?q=Living+Room+Trailhead+Salt+Lake+City', 'published'
  ),
  (
    'City Creek Canyon stroll',
    'Memory Grove Park, Salt Lake City',
    '2027-05-15 15:00:00+00', 'easy', 2.9, 285,
    'A mellow spring walk up a shaded canyon right by downtown — low elevation, gentle grade, easy to reach, with the creek running high.',
    'Water, a light layer, comfortable shoes.',
    'https://www.alltrails.com/trail/us/utah/city-creek-park-to-memory-grove-trail',
    'https://maps.google.com/?q=Memory+Grove+Park+Salt+Lake+City', 'published'
  ),
  (
    'Mount Van Cott',
    'Van Cott Trailhead, above the University of Utah',
    '2027-06-19 14:00:00+00', 'ambitious', 2.6, 1305,
    'Short but steep — a punchy foothill climb with a big payoff view. For the crowd that wants a workout without a long day. Early start to beat the heat; free parking near Red Butte Garden.',
    'Water, sturdy shoes, layers, sunscreen.',
    'https://www.alltrails.com/trail/us/utah/mount-van-cott--3',
    'https://maps.google.com/?q=Mount+Van+Cott+Trailhead', 'published'
  ),
  (
    'Cecret Lake, Albion Basin',
    'Cecret Lake Trailhead, Albion Basin (Alta)',
    '2027-07-17 14:00:00+00', 'moderate', 1.8, 459,
    'A summer classic — a short climb to an alpine lake surrounded by the Wasatch''s legendary July wildflowers. Little Cottonwood is a paid parking (REA) area; arrive early, it fills fast.',
    'Water, sun protection, layers, day-use parking pass.',
    'https://www.alltrails.com/trail/us/utah/cecret-lake-trail',
    'https://maps.google.com/?q=Cecret+Lake+Trailhead+Albion+Basin', 'published'
  ),
  (
    'Silver Lake, Brighton',
    'Silver Lake Trailhead, Brighton (Big Cottonwood Canyon)',
    '2027-08-21 14:00:00+00', 'easy', 0.9, 62,
    'A flat, wheelchair-accessible boardwalk loop around an alpine lake at 8,760 ft — cool and gorgeous in late summer, and the most accessible trail in the Wasatch. Big Cottonwood is a paid parking (REA) area; carpool and bring a day-use pass.',
    'Water, sun protection, a layer, day-use parking pass.',
    'https://www.alltrails.com/trail/us/utah/silver-lake-loop-trail',
    'https://maps.google.com/?q=Silver+Lake+Trailhead+Brighton+Utah', 'published'
  );
