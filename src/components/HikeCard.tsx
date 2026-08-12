import Link from "next/link";
import { DifficultyBadge } from "./DifficultyBadge";
import { formatDistance, formatElevation, formatHikeDate } from "@/lib/format";
import type { HikeWithCounts } from "@/lib/types";

export function HikeCard({
  hike,
  past = false,
}: {
  hike: HikeWithCounts;
  past?: boolean;
}) {
  const distance = formatDistance(hike.distance_miles);
  const elevation = formatElevation(hike.elevation_gain_ft);

  return (
    <article
      className={`flex flex-col rounded-xl border border-surface-container-highest bg-surface-container-lowest p-5 shadow-sm transition-shadow hover:shadow-md ${
        past ? "opacity-75" : ""
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-primary">
          {formatHikeDate(hike.starts_at)}
        </span>
        <DifficultyBadge difficulty={hike.difficulty} />
      </div>

      <h3 className="font-display text-xl font-bold text-on-surface">
        <Link href={`/hikes/${hike.id}`} className="hover:text-primary">
          {hike.title}
        </Link>
      </h3>
      <p className="mt-0.5 text-sm text-on-surface-variant">{hike.trailhead}</p>

      {(distance || elevation) && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {distance && (
            <span className="rounded-md bg-surface-container px-2 py-1 text-on-surface">
              {distance}
            </span>
          )}
          {elevation && (
            <span className="rounded-md bg-surface-container px-2 py-1 text-on-surface">
              {elevation}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-surface-container-highest pt-4">
        <span className="text-sm text-on-surface-variant">
          {hike.going_count} {past ? "went" : "going"}
        </span>
        <Link
          href={`/hikes/${hike.id}`}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            past
              ? "border border-outline-variant text-on-surface hover:bg-surface-container"
              : "bg-primary text-on-primary hover:bg-primary-container"
          }`}
        >
          {past ? "View recap" : "View & RSVP"}
        </Link>
      </div>
    </article>
  );
}
