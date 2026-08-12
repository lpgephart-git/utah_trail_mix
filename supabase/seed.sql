-- Utah Trail Mix — sample hikes (run once in the Supabase SQL editor).
-- Verified Wasatch Front trails from docs/TRAILS.md, all kept under 3 miles.
-- Times are stored in UTC; they display in America/Denver on the site.
-- created_by is left null (fine). Add a Strava route embed later via Admin → Edit.

-- If you already ran an earlier version of this seed, clear it first:
--   delete from public.hikes;

insert into public.hikes
  (title, trailhead, starts_at, difficulty, distance_miles, elevation_gain_ft,
   capacity, notes, what_to_bring, alltrails_url, gmaps_url, status)
values
  (
    'Ensign Peak — season kickoff',
    'Ensign Peak Trailhead, Salt Lake City',
    '2026-09-19 15:00:00+00',           -- Sat 9:00 AM MDT
    'easy', 1.0, 400, null,
    'Our season kickoff! A short, rewarding climb to an iconic view of the whole valley. Free parking, all fitness levels welcome. We''ll grab coffee nearby afterward to say hello.',
    'Water, comfortable shoes, a light layer, sunscreen.',
    'https://www.alltrails.com/trail/us/utah/ensign-peak-trail',
    'https://maps.google.com/?q=Ensign+Peak+Trailhead',
    'published'
  ),
  (
    'Mount Van Cott',
    'Van Cott Trailhead, above the University of Utah',
    '2026-10-03 14:30:00+00',           -- Sat 8:30 AM MDT
    'ambitious', 2.6, 1150, 15,
    'Short but steep — a punchy foothill climb with a big payoff view of the valley. For the crowd that wants a workout without a long day. Free parking near the trailhead.',
    'Water, sturdy shoes, layers, sunscreen.',
    'https://www.alltrails.com/trail/us/utah/mount-van-cott',
    'https://maps.google.com/?q=Mount+Van+Cott+Trailhead',
    'published'
  ),
  (
    'The Living Room',
    'Living Room Trailhead, Salt Lake City foothills',
    '2026-10-24 16:00:00+00',           -- Sat 10:00 AM MDT
    'moderate', 2.3, 980, null,
    'A foothill favorite above the U — free parking and stone "chairs" with a sweeping valley view. A steady but manageable climb, great for good conversation.',
    'Water, layers, comfortable shoes.',
    'https://www.alltrails.com/trail/us/utah/living-room-trail',
    'https://maps.google.com/?q=Living+Room+Trailhead+Salt+Lake+City',
    'published'
  ),
  (
    'City Creek Canyon stroll',
    'Memory Grove Park, Salt Lake City',
    '2026-11-14 17:00:00+00',           -- Sat 10:00 AM MST
    'easy', 2.5, 300, null,
    'A mellow late-season walk up a shaded canyon right by downtown — low elevation, gentle grade, and easy to reach. Perfect as the days get shorter.',
    'Water, a warm layer, traction if it''s icy.',
    'https://www.alltrails.com/trail/us/utah/city-creek-canyon',
    'https://maps.google.com/?q=Memory+Grove+Park+Salt+Lake+City',
    'published'
  ),
  (
    'Cecret Lake, Albion Basin',
    'Cecret Lake Trailhead, Albion Basin (Alta)',
    '2027-07-10 14:00:00+00',           -- Sat 8:00 AM MDT
    'moderate', 1.7, 450, 20,
    'A summer classic — a short climb to an alpine lake surrounded by the Wasatch''s legendary July wildflowers. Little Cottonwood is a paid parking (REA) area; arrive early, it fills fast.',
    'Water, sun protection, layers, day-use parking pass.',
    'https://www.alltrails.com/trail/us/utah/cecret-lake-trail',
    'https://maps.google.com/?q=Cecret+Lake+Trailhead+Albion+Basin',
    'published'
  );
