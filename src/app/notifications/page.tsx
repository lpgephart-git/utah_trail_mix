import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getCurrentProfile,
  getNotifications,
  markNotificationsRead,
} from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Avatar } from "@/components/Avatar";
import { formatHikeDate } from "@/lib/format";

export const metadata = { title: "Notifications — Utah Trail Mix" };

export default async function NotificationsPage() {
  if (!isSupabaseConfigured) redirect("/");
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirect=/notifications");

  // Fetch first (to keep the unread styling), then mark everything read.
  const notes = await getNotifications();
  await markNotificationsRead();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-on-surface">
        Notifications
      </h1>

      <div className="mt-6 flex flex-col gap-2">
        {notes.map((n) => (
          <Link
            key={n.id}
            href={n.post_id ? `/#post-${n.post_id}` : "/"}
            className={`flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-surface-container ${
              n.read
                ? "border-surface-variant bg-surface-container-lowest"
                : "border-primary/30 bg-secondary-container/30"
            }`}
          >
            <Avatar name={n.actor_name} imageUrl={n.actor_avatar_url} />
            <div className="min-w-0 flex-1">
              <p className="text-on-surface">
                <span className="font-medium">{n.actor_name}</span>{" "}
                {n.type === "reply"
                  ? "replied to your post"
                  : "liked your post"}
                <span aria-hidden> {n.type === "reply" ? "💬" : "💚"}</span>
              </p>
              <p className="text-xs text-on-surface-variant">
                {formatHikeDate(n.created_at)}
              </p>
            </div>
          </Link>
        ))}

        {notes.length === 0 && (
          <p className="rounded-xl border border-surface-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant">
            No notifications yet. When someone replies to or likes your posts,
            you&apos;ll see it here.
          </p>
        )}
      </div>
    </div>
  );
}
