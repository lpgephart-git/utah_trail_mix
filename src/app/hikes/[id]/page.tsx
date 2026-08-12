import { notFound } from "next/navigation";
import { getComments, getCurrentProfile, getHike } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { RsvpPanel } from "@/components/RsvpPanel";
import { CommentForm } from "@/components/CommentForm";
import { StravaEmbed } from "@/components/StravaEmbed";
import { googleCalUrl } from "@/lib/calendar";
import { formatHikeDate } from "@/lib/format";
import type { Rsvp } from "@/lib/types";

async function getMyRsvp(hikeId: string): Promise<Pick<Rsvp, "guests" | "carpool"> | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("rsvps")
    .select("guests, carpool")
    .eq("hike_id", hikeId)
    .eq("member_id", user.id)
    .maybeSingle();
  return (data as Pick<Rsvp, "guests" | "carpool">) ?? null;
}

export default async function HikeDetailPage(props: PageProps<"/hikes/[id]">) {
  const { id } = await props.params;
  const hike = await getHike(id);
  if (!hike) notFound();

  const [comments, profile, myRsvp] = await Promise.all([
    getComments(id),
    getCurrentProfile(),
    getMyRsvp(id),
  ]);

  const stats = [
    { label: "Date", value: formatHikeDate(hike.starts_at) },
    hike.distance_miles != null && { label: "Distance", value: `${hike.distance_miles} mi` },
    hike.elevation_gain_ft != null && {
      label: "Elevation",
      value: `${hike.elevation_gain_ft.toLocaleString("en-US")} ft`,
    },
    { label: "Going", value: `${hike.going_count}` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main column */}
        <article className="flex flex-col gap-8 lg:col-span-2">
          <header>
            <div className="mb-2 flex items-center gap-3">
              <DifficultyBadge difficulty={hike.difficulty} />
              <span className="text-sm font-medium text-primary">
                {formatHikeDate(hike.starts_at)}
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold text-on-surface">
              {hike.title}
            </h1>
            <p className="mt-1 text-on-surface-variant">📍 {hike.trailhead}</p>
          </header>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-surface-variant bg-surface-container-lowest p-4 text-center"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                  {s.label}
                </p>
                <p className="mt-1 font-display text-xl font-bold text-primary">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {hike.notes && (
            <section>
              <h2 className="font-display text-2xl font-bold text-on-surface">
                About this hike
              </h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-on-surface-variant">
                {hike.notes}
              </p>
            </section>
          )}

          {hike.what_to_bring && (
            <section>
              <h2 className="font-display text-2xl font-bold text-on-surface">
                What to bring
              </h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-on-surface-variant">
                {hike.what_to_bring}
              </p>
            </section>
          )}

          {/* Map & links */}
          <section>
            <h2 className="font-display text-2xl font-bold text-on-surface">
              Trail & route
            </h2>
            {hike.strava_embed ? (
              hike.strava_embed.includes("strava-embed-placeholder") ? (
                <StravaEmbed snippet={hike.strava_embed} />
              ) : (
                <iframe
                  title="Route map"
                  src={hike.strava_embed}
                  className="mt-3 h-96 w-full rounded-xl border border-outline-variant"
                  loading="lazy"
                />
              )
            ) : (
              <>
                <iframe
                  title="Trailhead map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    hike.trailhead || hike.title,
                  )}&output=embed`}
                  className="mt-3 h-80 w-full rounded-xl border border-outline-variant"
                  loading="lazy"
                />
                <p className="mt-2 text-xs text-on-surface-variant">
                  Showing the trailhead. Add a Strava route in the admin editor to
                  show the full route here.
                </p>
              </>
            )}
            <div className="mt-3 flex flex-wrap gap-3">
              {hike.alltrails_url && (
                <a
                  href={hike.alltrails_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container"
                >
                  🗺️ View full trail on AllTrails
                </a>
              )}
              {hike.gmaps_url && (
                <a
                  href={hike.gmaps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container"
                >
                  🧭 Directions to trailhead
                </a>
              )}
            </div>
          </section>

          {/* Comment board */}
          <section>
            <h2 className="font-display text-2xl font-bold text-on-surface">
              Hike board
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {comments.length} {comments.length === 1 ? "post" : "posts"}
            </p>

            <div className="mt-4 flex flex-col gap-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-surface-variant bg-surface-container-lowest p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-on-surface">
                      {c.author_name ?? "Member"}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {formatHikeDate(c.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-on-surface-variant">
                    {c.body}
                  </p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-on-surface-variant">
                  No posts yet — be the first to say hello.
                </p>
              )}
            </div>

            <div className="mt-4">
              {profile ? (
                <CommentForm hikeId={hike.id} />
              ) : (
                <p className="text-sm text-on-surface-variant">
                  Log in to post on the board.
                </p>
              )}
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {new Date(hike.starts_at) < new Date() ? (
            <div className="rounded-xl border border-surface-variant bg-surface-container p-5">
              <h3 className="font-display text-lg font-bold text-on-surface">
                This hike has happened 🎉
              </h3>
              <p className="mt-1 text-sm text-on-surface-variant">
                {hike.going_count} {hike.going_count === 1 ? "person" : "people"}{" "}
                came along. Scroll down to the board to see the recap and photos.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <RsvpPanel hikeId={hike.id} isAuthed={!!profile} rsvp={myRsvp} />
              <div className="rounded-xl border border-surface-variant bg-surface-container-lowest p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-tertiary">
                  Add to calendar
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Get a reminder on your own calendar.
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <a
                    href={`/hikes/${hike.id}/calendar`}
                    className="rounded-full border border-outline-variant px-4 py-2 text-center text-sm font-medium text-on-surface hover:bg-surface-container"
                  >
                    📅 Apple / Outlook (.ics)
                  </a>
                  <a
                    href={googleCalUrl(
                      hike,
                      `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/hikes/${hike.id}`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-outline-variant px-4 py-2 text-center text-sm font-medium text-on-surface hover:bg-surface-container"
                  >
                    📅 Google Calendar
                  </a>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
