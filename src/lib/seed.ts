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
    distance_miles: 1.0,
    elevation_gain_ft: 400,
    notes:
      "Our season kickoff! A short, rewarding climb to an iconic view of the whole valley. Free parking, all fitness levels welcome. Coffee nearby afterward to say hello.",
    what_to_bring: "Water, comfortable shoes, a light layer, sunscreen.",
    capacity: null,
    strava_embed: null,
    alltrails_url: "https://www.alltrails.com/trail/us/utah/ensign-peak-trail",
    gmaps_url: "https://maps.google.com/?q=Ensign+Peak+Trailhead",
    status: "published",
    created_by: null,
    created_at: "2026-08-11T00:00:00.000Z",
    going_count: 12,
  },
  {
    id: "donut-falls",
    title: "Donut Falls",
    trailhead: "Donut Falls Trailhead, Big Cottonwood Canyon",
    starts_at: "2026-10-17T15:00:00.000Z",
    difficulty: "moderate",
    distance_miles: 3.5,
    elevation_gain_ft: 750,
    notes:
      "Family-friendly waterfall hike through aspens at peak fall color. NOTE: Big Cottonwood is now a paid parking (REA) area — grab a day-use pass and carpool if you can.",
    what_to_bring: "Water, sturdy shoes, layers, day-use parking pass.",
    capacity: 20,
    strava_embed: null,
    alltrails_url: "https://www.alltrails.com/trail/us/utah/donut-falls-trail",
    gmaps_url: "https://maps.google.com/?q=Donut+Falls+Trailhead",
    status: "published",
    created_by: null,
    created_at: "2026-08-11T00:00:00.000Z",
    going_count: 5,
  },
  {
    id: "lake-blanche",
    title: "Lake Blanche",
    trailhead: "Mill B South Trailhead, Big Cottonwood Canyon",
    starts_at: "2026-11-07T14:30:00.000Z",
    difficulty: "ambitious",
    distance_miles: 6.5,
    elevation_gain_ft: 2700,
    notes:
      "For the eager crowd — a steep but stunning climb to an alpine lake beneath Sundial Peak. Paid parking (REA) area; carpool encouraged.",
    what_to_bring:
      "2+ liters water, snacks, sturdy boots, layers, day-use parking pass.",
    capacity: 15,
    strava_embed: null,
    alltrails_url: "https://www.alltrails.com/trail/us/utah/lake-blanche-trail",
    gmaps_url: "https://maps.google.com/?q=Mill+B+South+Trailhead",
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
