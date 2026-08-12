import { getPublishedHikes } from "@/lib/data";
import { HikeCard } from "@/components/HikeCard";

export const metadata = {
  title: "Hike schedule — Utah Trail Mix",
};

export default async function SchedulePage() {
  const hikes = await getPublishedHikes();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold text-on-surface">
          Upcoming hikes
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-on-surface-variant">
          Join fellow Utah educators on the trails. We schedule around teaching
          hours and a range of fitness levels — come to one or come to them all.
        </p>
      </header>

      {hikes.length === 0 ? (
        <p className="rounded-xl border border-surface-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant">
          No hikes on the calendar yet — check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hikes.map((hike) => (
            <HikeCard key={hike.id} hike={hike} />
          ))}
        </div>
      )}
    </div>
  );
}
