"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type ActionResult = { error?: string; ok?: boolean };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function submitRsvp(
  hikeId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { error: "Connect Supabase to enable RSVPs." };
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Please log in to RSVP." };

  const guests = Math.max(0, Math.min(5, Number(formData.get("guests") ?? 0)));
  const carpool = (formData.get("carpool") as string) || null;

  const { error } = await supabase.from("rsvps").upsert(
    { hike_id: hikeId, member_id: user.id, guests, carpool },
    { onConflict: "hike_id,member_id" },
  );
  if (error) return { error: error.message };

  revalidatePath(`/hikes/${hikeId}`);
  return { ok: true };
}

// Used directly as a <form action>, so it returns void.
export async function cancelRsvp(hikeId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { supabase, user } = await requireUser();
  if (!user) return;

  await supabase
    .from("rsvps")
    .delete()
    .eq("hike_id", hikeId)
    .eq("member_id", user.id);

  revalidatePath(`/hikes/${hikeId}`);
}

export async function postComment(
  hikeId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { error: "Connect Supabase to enable comments." };
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Please log in to post." };

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Write something first." };
  if (body.length > 2000) return { error: "That's a bit long — keep it under 2000 characters." };

  const { error } = await supabase
    .from("comments")
    .insert({ hike_id: hikeId, member_id: user.id, body });
  if (error) return { error: error.message };

  revalidatePath(`/hikes/${hikeId}`);
  return { ok: true };
}
