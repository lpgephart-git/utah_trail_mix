"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type FeedActionState = { error?: string; ok?: boolean };

const BUCKET = "post-images";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function extFor(file: File): string {
  const fromName = file.name.includes(".") ? file.name.split(".").pop() : "";
  const ext = (fromName || file.type.split("/")[1] || "jpg").toLowerCase();
  return ext.replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
}

export async function createPost(
  _prev: FeedActionState,
  formData: FormData,
): Promise<FeedActionState> {
  if (!isSupabaseConfigured) return { error: "Connect Supabase to enable posting." };
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Please log in to post." };

  const body = String(formData.get("body") ?? "").trim();
  const image = formData.get("image") as File | null;
  const hasImage = image && image.size > 0;

  if (!body && !hasImage) return { error: "Write something or add a photo." };
  if (body.length > 5000) return { error: "That post is a bit long." };

  let image_path: string | null = null;
  if (hasImage) {
    if (image.size > MAX_IMAGE_BYTES) return { error: "Image must be under 8 MB." };
    if (!image.type.startsWith("image/")) return { error: "That file isn't an image." };
    const path = `${user.id}/${randomUUID()}.${extFor(image)}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, image, { contentType: image.type, upsert: false });
    if (upErr) return { error: `Image upload failed: ${upErr.message}` };
    image_path = path;
  }

  const { error } = await supabase
    .from("posts")
    .insert({ author_id: user.id, body, image_path });
  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true };
}

export async function toggleLike(postId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { supabase, user } = await requireUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("member_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("member_id", user.id);
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, member_id: user.id });
  }
  revalidatePath("/");
}

export async function addReply(
  postId: string,
  _prev: FeedActionState,
  formData: FormData,
): Promise<FeedActionState> {
  if (!isSupabaseConfigured) return { error: "Connect Supabase to reply." };
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Please log in to reply." };

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Write a reply first." };
  if (body.length > 2000) return { error: "Reply is too long." };

  const { error } = await supabase
    .from("post_comments")
    .insert({ post_id: postId, author_id: user.id, body });
  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true };
}

export async function deletePost(postId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { supabase, user } = await requireUser();
  if (!user) return;
  await supabase.from("posts").delete().eq("id", postId);
  revalidatePath("/");
}

export async function deleteReply(commentId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { supabase, user } = await requireUser();
  if (!user) return;
  await supabase.from("post_comments").delete().eq("id", commentId);
  revalidatePath("/");
}
