import Link from "next/link";
import { getFeed, getMemberCount, getUpcomingHikes } from "@/lib/data";
import { avatarUrl } from "@/lib/storage";
import { formatHikeDate } from "@/lib/format";
import { PostComposer } from "./PostComposer";
import { PostCard } from "./PostCard";
import { DifficultyBadge } from "./DifficultyBadge";
import type { Profile } from "@/lib/types";

function greeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "America/Denver",
    }).format(new Date()),
  );
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export async function CommunityFeed({ profile }: { profile: Profile }) {
  const [posts, hikes, memberCount] = await Promise.all([
    getFeed(),
    getUpcomingHikes(),
    getMemberCount(),
  ]);
  const firstName = profile.full_name.split(" ")[0] || "friend";
  const nextHike = hikes[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Greeting banner */}
      <div className="mb-6 rounded-2xl bg-secondary-container px-6 py-5">
        <h1 className="font-display text-2xl font-bold text-on-secondary-container sm:text-3xl">
          {greeting()}, {firstName} 👋
        </h1>
        <p className="mt-1 text-on-secondary-container/80">
          Here&apos;s what the group&apos;s been up to.
          {memberCount > 1 && (
            <> You&apos;re one of {memberCount} on the trail.</>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Feed */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <PostComposer
            authorName={profile.full_name}
            avatarUrl={avatarUrl(profile.avatar_path)}
          />

          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              canReply
              canDelete={post.author_id === profile.id || profile.is_admin}
            />
          ))}

          {posts.length === 0 && (
            <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center">
              <div className="text-4xl" aria-hidden>
                🏔️
              </div>
              <p className="mt-3 font-display text-lg font-bold text-on-surface">
                The trail&apos;s quiet… for now
              </p>
              <p className="mt-1 text-on-surface-variant">
                Be the first to post — introduce yourself or share a favorite
                Utah trail.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-surface-variant bg-surface-container-lowest p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-tertiary">
              Next hike
            </p>
            {nextHike ? (
              <div className="mt-2">
                <div className="mb-1 flex items-center gap-2">
                  <DifficultyBadge difficulty={nextHike.difficulty} />
                  <span className="text-sm text-on-surface-variant">
                    {formatHikeDate(nextHike.starts_at)}
                  </span>
                </div>
                <p className="font-display text-lg font-bold text-on-surface">
                  {nextHike.title}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {nextHike.trailhead}
                </p>
                <Link
                  href={`/hikes/${nextHike.id}`}
                  className="mt-3 inline-block rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-container"
                >
                  View &amp; RSVP
                </Link>
              </div>
            ) : (
              <p className="mt-2 text-sm text-on-surface-variant">
                No hikes on the calendar yet — check back soon.
              </p>
            )}
            <Link
              href="/schedule"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Full schedule →
            </Link>
          </div>

          <div className="rounded-xl border border-surface-variant bg-surface-container p-5">
            <p className="font-display text-base font-bold text-on-surface">
              Welcome to the group 🌲
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              This is our home base between hikes. Say hi, share trail photos,
              swap carpools, and cheer each other on. Everyone who works at a
              Utah school or district belongs here — be kind, we&apos;re all off
              the clock.
            </p>
            <Link
              href="/account"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Add a profile photo →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
