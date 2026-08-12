-- One-time fix: correct AllTrails links + stats for the seeded hikes
-- (the original slugs were guessed). Safe to run once in the SQL editor.

update public.hikes set
  alltrails_url = 'https://www.alltrails.com/trail/us/utah/ensign-peak-trail-and-overlook',
  distance_miles = 0.9, elevation_gain_ft = 374
where title = 'Ensign Peak — season kickoff';

update public.hikes set
  alltrails_url = 'https://www.alltrails.com/trail/us/utah/mount-van-cott--3',
  distance_miles = 2.6, elevation_gain_ft = 1305
where title = 'Mount Van Cott';

update public.hikes set
  alltrails_url = 'https://www.alltrails.com/trail/us/utah/the-living-room-lookout-trail',
  distance_miles = 2.3, elevation_gain_ft = 971
where title = 'The Living Room';

update public.hikes set
  alltrails_url = 'https://www.alltrails.com/trail/us/utah/city-creek-park-to-memory-grove-trail',
  distance_miles = 2.9, elevation_gain_ft = 285
where title = 'City Creek Canyon stroll';

update public.hikes set
  alltrails_url = 'https://www.alltrails.com/trail/us/utah/cecret-lake-trail',
  distance_miles = 1.8, elevation_gain_ft = 459
where title = 'Cecret Lake, Albion Basin';
