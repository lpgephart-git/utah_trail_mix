import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { avatarUrl, postImageUrl } from "@/lib/storage";
import { getSeedHike, seedComments, seedHikes } from "@/lib/seed";
import type {
  AppNotification,
  Comment,
  FeedPost,
  HikeWithCounts,
  Profile,
} from "@/lib/types";

/** The community feed: posts newest-first with author, likes, and replies. */
export async function getFeed(): Promise<FeedPost[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `id, author_id, body, image_path, created_at,
       author:profiles!posts_author_id_fkey(full_name, avatar_path),
       likes:post_likes(member_id),
       comments:post_comments(id, body, created_at, author:profiles!post_comments_author_id_fkey(full_name, avatar_path))`,
    )
    .order("created_at", { ascending: false })
    .order("created_at", { referencedTable: "post_comments", ascending: true });

  if (error) {
    // Most likely the community.sql migration hasn't been run yet — show an
    // empty feed rather than crashing the homepage.
    console.error("getFeed error (has community.sql been run?):", error.message);
    return [];
  }

  type Author = { full_name: string; avatar_path: string | null } | null;
  type Row = {
    id: string;
    author_id: string;
    body: string;
    image_path: string | null;
    created_at: string;
    author: Author;
    likes: { member_id: string }[];
    comments: {
      id: string;
      body: string;
      created_at: string;
      author: Author;
    }[];
  };

  return (data as unknown as Row[]).map((p) => ({
    id: p.id,
    author_id: p.author_id,
    body: p.body,
    image_url: postImageUrl(p.image_path),
    created_at: p.created_at,
    author_name: p.author?.full_name || "Member",
    author_avatar_url: avatarUrl(p.author?.avatar_path ?? null),
    like_count: p.likes.length,
    liked_by_me: user ? p.likes.some((l) => l.member_id === user.id) : false,
    comments: p.comments.map((c) => ({
      id: c.id,
      body: c.body,
      created_at: c.created_at,
      author_name: c.author?.full_name || "Member",
      author_avatar_url: avatarUrl(c.author?.avatar_path ?? null),
    })),
  }));
}

/** Upcoming published hikes, soonest first. Seed fallback before Supabase is set up. */
export async function getUpcomingHikes(): Promise<HikeWithCounts[]> {
  const now = new Date().toISOString();
  if (!isSupabaseConfigured) {
    return [...seedHikes]
      .filter((h) => h.starts_at >= now)
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hikes_with_counts")
    .select("*")
    .eq("status", "published")
    .gte("starts_at", now)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as HikeWithCounts[];
}

/** Past published hikes, most recent first — the "history" / recap archive. */
export async function getPastHikes(): Promise<HikeWithCounts[]> {
  const now = new Date().toISOString();
  if (!isSupabaseConfigured) {
    return [...seedHikes]
      .filter((h) => h.starts_at < now)
      .sort((a, b) => b.starts_at.localeCompare(a.starts_at));
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hikes_with_counts")
    .select("*")
    .eq("status", "published")
    .lt("starts_at", now)
    .order("starts_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as HikeWithCounts[];
}

export async function getHike(id: string): Promise<HikeWithCounts | null> {
  if (!isSupabaseConfigured) return getSeedHike(id) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("hikes_with_counts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as HikeWithCounts) ?? null;
}

export async function getComments(hikeId: string): Promise<Comment[]> {
  if (!isSupabaseConfigured) return seedComments[hikeId] ?? [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("id, hike_id, member_id, body, created_at, profiles(full_name)")
    .eq("hike_id", hikeId)
    .order("created_at", { ascending: true });
  return (data ?? []).map((row) => {
    const { profiles, ...rest } = row as typeof row & {
      profiles: { full_name: string } | null;
    };
    return { ...rest, author_name: profiles?.full_name ?? "Member" } as Comment;
  });
}

/** Total member count, for a bit of social proof on the feed. */
export async function getMemberCount(): Promise<number> {
  if (!isSupabaseConfigured) return 0;
  const supabase = await createClient();
  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });
  return count ?? 0;
}

/** Unread notification count for the header bell. Returns 0 if the migration
 *  hasn't run yet (so the header never crashes). */
export async function getUnreadCount(): Promise<number> {
  if (!isSupabaseConfigured) return 0;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);
  if (error) return 0;
  return count ?? 0;
}

/** The current member's notifications, newest first. */
export async function getNotifications(): Promise<AppNotification[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("notifications")
    .select(
      `id, type, post_id, read, created_at,
       actor:profiles!notifications_actor_id_fkey(full_name, avatar_path)`,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return [];

  type Row = {
    id: string;
    type: "reply" | "like";
    post_id: string | null;
    read: boolean;
    created_at: string;
    actor: { full_name: string; avatar_path: string | null } | null;
  };
  return (data as unknown as Row[]).map((n) => ({
    id: n.id,
    type: n.type,
    post_id: n.post_id,
    read: n.read,
    created_at: n.created_at,
    actor_name: n.actor?.full_name || "Someone",
    actor_avatar_url: avatarUrl(n.actor?.avatar_path ?? null),
  }));
}

/** Mark all of the current member's notifications read. */
export async function markNotificationsRead(): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);
}

/** The signed-in member's profile, or null when not authenticated / not configured. */
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return (data as Profile) ?? null;
}
