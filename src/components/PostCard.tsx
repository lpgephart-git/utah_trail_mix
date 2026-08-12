import { Avatar } from "./Avatar";
import { LikeButton } from "./LikeButton";
import { ReplyForm } from "./ReplyForm";
import { deletePost } from "@/app/community/actions";
import { formatHikeDate } from "@/lib/format";
import type { FeedPost } from "@/lib/types";

export function PostCard({
  post,
  canDelete,
  canReply,
}: {
  post: FeedPost;
  canDelete: boolean;
  canReply: boolean;
}) {
  return (
    <article className="rounded-xl border border-surface-variant bg-surface-container-lowest p-5">
      <div className="flex items-start gap-3">
        <Avatar name={post.author_name} imageUrl={post.author_avatar_url} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-on-surface">{post.author_name}</p>
              <p className="text-xs text-on-surface-variant">
                {formatHikeDate(post.created_at)}
              </p>
            </div>
            {canDelete && (
              <form action={deletePost.bind(null, post.id)}>
                <button
                  type="submit"
                  className="text-xs text-on-surface-variant hover:text-error"
                  aria-label="Delete post"
                >
                  Delete
                </button>
              </form>
            )}
          </div>

          {post.body && (
            <p className="mt-2 whitespace-pre-line leading-relaxed text-on-surface">
              {post.body}
            </p>
          )}

          {post.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image_url}
              alt=""
              className="mt-3 max-h-96 w-full rounded-lg border border-outline-variant object-cover"
              loading="lazy"
            />
          )}

          <div className="mt-3 flex items-center gap-3 border-t border-surface-container-highest pt-3">
            <LikeButton
              postId={post.id}
              likeCount={post.like_count}
              liked={post.liked_by_me}
            />
            <span className="text-sm text-on-surface-variant">
              {post.comments.length}{" "}
              {post.comments.length === 1 ? "reply" : "replies"}
            </span>
          </div>

          {post.comments.length > 0 && (
            <div className="mt-3 flex flex-col gap-3">
              {post.comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <Avatar name={c.author_name} imageUrl={c.author_avatar_url} size="sm" />
                  <div className="rounded-2xl bg-surface-container px-3 py-2">
                    <p className="text-sm font-medium text-on-surface">
                      {c.author_name}
                    </p>
                    <p className="text-sm text-on-surface-variant">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {canReply && <ReplyForm postId={post.id} />}
        </div>
      </div>
    </article>
  );
}
