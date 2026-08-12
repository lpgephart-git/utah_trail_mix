"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin");
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) redirect("/");
  return { supabase, userId: user.id };
}

function parseHike(formData: FormData) {
  const startsLocal = String(formData.get("starts_at") ?? "");
  return {
    title: String(formData.get("title") ?? "").trim(),
    trailhead: String(formData.get("trailhead") ?? "").trim(),
    starts_at: startsLocal ? new Date(startsLocal).toISOString() : null,
    difficulty: String(formData.get("difficulty") ?? "easy"),
    distance_miles: numberOrNull(formData.get("distance_miles")),
    elevation_gain_ft: intOrNull(formData.get("elevation_gain_ft")),
    capacity: intOrNull(formData.get("capacity")),
    notes: strOrNull(formData.get("notes")),
    what_to_bring: strOrNull(formData.get("what_to_bring")),
    strava_embed: strOrNull(formData.get("strava_embed")),
    alltrails_url: strOrNull(formData.get("alltrails_url")),
    gmaps_url: strOrNull(formData.get("gmaps_url")),
  };
}

function strOrNull(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
function numberOrNull(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s.length ? Number(s) : null;
}
function intOrNull(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s.length ? parseInt(s, 10) : null;
}

export async function createHike(formData: FormData) {
  const { supabase, userId } = await requireAdmin();
  const values = parseHike(formData);
  if (!values.title || !values.starts_at) {
    redirect("/admin/hikes/new?error=required");
  }
  const status = formData.get("publish") ? "published" : "draft";
  const { error } = await supabase
    .from("hikes")
    .insert({ ...values, status, created_by: userId });
  if (error) redirect(`/admin/hikes/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
  revalidatePath("/schedule");
  redirect("/admin");
}

export async function updateHike(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const values = parseHike(formData);
  const status = formData.get("publish") ? "published" : "draft";
  const { error } = await supabase
    .from("hikes")
    .update({ ...values, status })
    .eq("id", id);
  if (error) redirect(`/admin/hikes/${id}/edit?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
  revalidatePath("/schedule");
  revalidatePath(`/hikes/${id}`);
  redirect("/admin");
}

export async function deleteHike(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("hikes").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/schedule");
  redirect("/admin");
}
