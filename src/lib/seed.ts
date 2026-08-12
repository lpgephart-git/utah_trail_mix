import type { Comment, HikeWithCounts } from "./types";

/**
 * Preview data used when Supabase isn't configured yet, so the UI is viewable
 * immediately. Trails are from docs/TRAILS.md (verified Wasatch Front options).
 * Dates are illustrative — replace once real hikes are scheduled.
 */
export const seedHikes: HikeWithCounts[] = [
  {
    id: "ensign-peak",
    title: "Ensign Peak — kickoff hike",
    trailhead: "Ensign Peak Trailhead, Salt Lake City",
    starts_at: "2026-09-19T15:00:00.000Z", // Sat 9:00 AM MDT
    difficulty: "easy",
    distance_miles: 0.9,
    elevation_gain_ft: 374,
    notes:
      "Our season kickoff! A short, rewarding climb to an iconic view of the whole valley. Free parking, all fitness levels welcome. Coffee nearby afterward to say hello.",
    what_to_bring: "Water, comfortable shoes, a light layer, sunscreen.",
    capacity: null,
    strava_embed: null,
    alltrails_url:
      "https://www.alltrails.com/trail/us/utah/ensign-peak-trail-and-overlook",
    gmaps_url: "https://maps.google.com/?q=Ensign+Peak+Trailhead",
    status: "published",
    created_by: null,
    created_at: "2026-08-11T00:00:00.000Z",
    going_count: 12,
  },
  {
    id: "mount-van-cott",
    title: "Mount Van Cott",
    trailhead: "Van Cott Trailhead, above the University of Utah",
    starts_at: "2027-06-19T14:00:00.000Z",
    difficulty: "ambitious",
    distance_miles: 2.6,
    elevation_gain_ft: 1305,
    notes:
      "Short but steep — a punchy foothill climb with a big payoff view. For the crowd that wants a workout without a long day. Trailhead at Red Butte Garden.",
    what_to_bring: "Water, sturdy shoes, layers, sunscreen.",
    capacity: 15,
    strava_embed: null,
    alltrails_url: "https://www.alltrails.com/trail/us/utah/mount-van-cott--3",
    gmaps_url: "https://maps.google.com/?q=Mount+Van+Cott+Trailhead",
    status: "published",
    created_by: null,
    created_at: "2026-08-11T00:00:00.000Z",
    going_count: 4,
  },
  {
    id: "city-creek",
    title: "City Creek Canyon stroll",
    trailhead: "Memory Grove Park, Salt Lake City",
    starts_at: "2027-05-15T15:00:00.000Z",
    difficulty: "easy",
    distance_miles: 2.9,
    elevation_gain_ft: 285,
    notes:
      "A mellow late-season walk up a shaded canyon right by downtown — low elevation, gentle grade, easy to reach. Perfect as the days get shorter.",
    what_to_bring: "Water, a warm layer, traction if it's icy.",
    capacity: null,
    strava_embed: null,
    alltrails_url:
      "https://www.alltrails.com/trail/us/utah/city-creek-park-to-memory-grove-trail",
    gmaps_url: "https://maps.google.com/?q=Memory+Grove+Park+Salt+Lake+City",
    status: "published",
    created_by: null,
    created_at: "2026-08-11T00:00:00.000Z",
    going_count: 3,
  },
];

export const seedComments: Record<string, Comment[]> = {
  "ensign-peak": [
    {
      id: "c1",
      hike_id: "ensign-peak",
      member_id: "seed",
      body: "So excited for this! Is there room to carpool from the east side?",
      created_at: "2026-08-10T18:00:00.000Z",
      author_name: "Sarah (school nurse)",
    },
    {
      id: "c2",
      hike_id: "ensign-peak",
      member_id: "seed",
      body: "I'll bring extra water and some trail mix (of course). See everyone there!",
      created_at: "2026-08-10T19:30:00.000Z",
      author_name: "Mike (PE)",
    },
  ],
};

export function getSeedHike(id: string): HikeWithCounts | undefined {
  return seedHikes.find((h) => h.id === id);
}
