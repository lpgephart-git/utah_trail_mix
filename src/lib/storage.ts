import { SUPABASE_URL } from "@/lib/supabase/config";

/** Public URL for an object in a public Supabase Storage bucket. */
export function storageUrl(bucket: string, path: string | null): string | null {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export const postImageUrl = (path: string | null) => storageUrl("post-images", path);
export const avatarUrl = (path: string | null) => storageUrl("avatars", path);
