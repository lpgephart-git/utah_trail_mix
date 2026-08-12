import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSeedHike, seedComments, seedHikes } from "@/lib/seed";
import type { Comment, HikeWithCounts, Profile } from "@/lib/types";

/** Published hikes, soonest first. Falls back to seed data before Supabase is set up. */
export async function getPublishedHikes(): Promise<HikeWithCounts[]> {
  if (!isSupabaseConfigured) {
    return [...seedHikes].sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hikes_with_counts")
    .select("*")
    .eq("status", "published")
    .order("starts_at", { ascending: true });
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
