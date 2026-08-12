import { getPastHikes, getUpcomingHikes } from "@/lib/data";
import { HikeCard } from "@/components/HikeCard";

export const metadata = {
  title: "Hike schedule — Utah Trail Mix",
};

export default async function SchedulePage() {
  const [upcoming, past] = await Promise.all([getUpcomingHikes(), getPastHikes()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold text-on-surface">
          Upcoming hikes
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-on-surface-variant">
          We hike the <span className="font-medium text-on-surface">3rd Saturday
          of the month</span>, with a range of fitness levels — come to one or come
          to them all.
        </p>
      </header>

      {upcoming.length === 0 ? (
        <p className="rounded-xl border border-surface-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant">
          No hikes on the calendar yet — check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((hike) => (
            <HikeCard key={hike.id} hike={hike} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-on-surface">
            Past hikes
          </h2>
          <p className="mt-1 text-on-surface-variant">
            Trails we&apos;ve already tackled — open one to see the recap and photos.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((hike) => (
              <HikeCard key={hike.id} hike={hike} past />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
