export type Difficulty = "easy" | "moderate" | "ambitious";
export type HikeStatus = "draft" | "published";
export type MemberRole =
  | "teacher"
  | "nutrition"
  | "nurse"
  | "counselor"
  | "coach"
  | "admin"
  | "support"
  | "other";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  ambitious: "Ambitious",
};

export const ROLE_LABELS: Record<MemberRole, string> = {
  teacher: "Teacher",
  nutrition: "Nutrition / food service",
  nurse: "School nurse / health",
  counselor: "Counselor / wellness",
  coach: "Coach / PE",
  admin: "Administration",
  support: "Support staff",
  other: "Other district role",
};

export type Profile = {
  id: string;
  full_name: string;
  role: MemberRole;
  district: string | null;
  avatar_path: string | null;
  is_admin: boolean;
  created_at: string;
};

export type Hike = {
  id: string;
  title: string;
  trailhead: string;
  starts_at: string; // ISO timestamp
  difficulty: Difficulty;
  distance_miles: number | null;
  elevation_gain_ft: number | null;
  notes: string | null;
  what_to_bring: string | null;
  capacity: number | null;
  strava_embed: string | null; // Strava route/activity embed URL or snippet
  alltrails_url: string | null;
  gmaps_url: string | null; // trailhead directions link
  status: HikeStatus;
  created_by: string | null;
  created_at: string;
};

export type Rsvp = {
  id: string;
  hike_id: string;
  member_id: string;
  guests: number;
  carpool: "drive" | "need_ride" | "meet_there" | null;
  created_at: string;
};

export type Comment = {
  id: string;
  hike_id: string;
  member_id: string;
  body: string;
  created_at: string;
  // joined for display
  author_name?: string;
};

/** A hike enriched with counts for list/detail views. */
export type HikeWithCounts = Hike & {
  going_count: number;
};

export type FeedComment = {
  id: string;
  body: string;
  created_at: string;
  author_name: string;
  author_avatar_url: string | null;
};

export type FeedPost = {
  id: string;
  author_id: string;
  body: string;
  image_url: string | null;
  created_at: string;
  author_name: string;
  author_avatar_url: string | null;
  like_count: number;
  liked_by_me: boolean;
  comments: FeedComment[];
};
