"use client";

import { useTransition } from "react";
import { toggleLike } from "@/app/community/actions";

export function LikeButton({
  postId,
  likeCount,
  liked,
}: {
  postId: string;
  likeCount: number;
  liked: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => toggleLike(postId))}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
        liked
          ? "bg-secondary-container text-on-secondary-container"
          : "text-on-surface-variant hover:bg-surface-container"
      }`}
      aria-pressed={liked}
    >
      <span aria-hidden>{liked ? "💚" : "🤍"}</span>
      {likeCount > 0 ? likeCount : ""} Like{likeCount === 1 ? "" : "s"}
    </button>
  );
}
