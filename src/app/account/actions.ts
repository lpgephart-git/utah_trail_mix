"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AccountState = { error?: string; ok?: boolean };

const BUCKET = "avatars";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function ext(file: File): string {
  const fromName = file.name.includes(".") ? file.name.split(".").pop() : "";
  return ((fromName || file.type.split("/")[1] || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg").slice(0, 5);
}

export async function updateProfile(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  if (!isSupabaseConfigured) return { error: "Connect Supabase first." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in." };

  const full_name = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "other");
  const district = String(formData.get("district") ?? "").trim() || null;
  const image = formData.get("avatar") as File | null;
  const removeAvatar = formData.get("remove_avatar") === "on";

  if (!full_name) return { error: "Please keep a name on your profile." };

  // Current avatar, so we can clean up on replace/remove.
  const { data: current } = await supabase
    .from("profiles")
    .select("avatar_path")
    .eq("id", user.id)
    .maybeSingle();
  const currentPath = (current?.avatar_path as string | null) ?? null;

  let avatar_path: string | null | undefined; // undefined = leave unchanged

  if (removeAvatar) {
    if (currentPath) await supabase.storage.from(BUCKET).remove([currentPath]);
    avatar_path = null;
  } else if (image && image.size > 0) {
    if (image.size > MAX_BYTES) return { error: "Image must be under 5 MB." };
    if (!image.type.startsWith("image/")) return { error: "That file isn't an image." };
    const path = `${user.id}/${randomUUID()}.${ext(image)}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, image, { contentType: image.type, upsert: false });
    if (upErr) return { error: `Photo upload failed: ${upErr.message}` };
    if (currentPath) await supabase.storage.from(BUCKET).remove([currentPath]);
    avatar_path = path;
  }

  const update: Record<string, unknown> = { full_name, role, district };
  if (avatar_path !== undefined) update.avatar_path = avatar_path;

  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/account");
  return { ok: true };
}
