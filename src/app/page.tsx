import Link from "next/link";
import { getCurrentProfile, getUpcomingHikes } from "@/lib/data";
import { HikeCard } from "@/components/HikeCard";
import { CommunityFeed } from "@/components/CommunityFeed";
import { formatHikeDate } from "@/lib/format";

const WELCOME_ROLES = [
  "Teachers",
  "Nutrition & food service",
  "School nurses",
  "Counselors",
  "Coaches & PE",
  "Paraeducators",
  "Administrators",
  "Office & support staff",
  "Bus drivers",
];

export default async function HomePage() {
  // Members land on the community feed; visitors see the marketing page.
  const profile = await getCurrentProfile();
  if (profile) return <CommunityFeed profile={profile} />;

  const hikes = await getUpcomingHikes();
  const featured = hikes[0];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="flex flex-col items-center gap-5 py-16 text-center sm:py-24">
        <span className="rounded-full bg-surface-container px-4 py-1 text-sm font-medium text-tertiary">
          Wasatch Front · educators
        </span>
        <h1 className="max-w-3xl font-display text-4xl font-bold text-primary sm:text-6xl">
          Educators who&apos;d rather network on a trail.
        </h1>
        <p className="max-w-2xl text-lg text-on-surface-variant">
          A welcoming community for anyone who works at a Utah school or district —
          every role, every fitness level. Fresh air, restorative wellness, and
          genuine connections outside the classroom, one hike at a time.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/join"
            className="rounded-full bg-primary px-6 py-3 font-medium text-on-primary hover:bg-primary-container"
          >
            Join the group
          </Link>
          <Link
            href="/schedule"
            className="rounded-full border-2 border-primary px-6 py-3 font-medium text-primary hover:bg-surface-container-low"
          >
            See the schedule
          </Link>
        </div>
      </section>

      {/* Everyone's welcome */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-surface-variant bg-surface-container-lowest p-8 text-center sm:p-10">
          <h2 className="font-display text-3xl font-bold text-on-surface">
            Everyone&apos;s welcome
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-on-surface-variant">
            If you work at a Utah school or district, you belong here — whatever your
            role, and no matter how fast you hike. We&apos;ve got a nutrition &amp;
            wellness heart, but the trail is open to all.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {WELCOME_ROLES.map((role) => (
              <span
                key={role}
                className="rounded-full bg-surface-container px-3 py-1.5 text-sm text-on-surface"
              >
                {role}
              </span>
            ))}
            <span className="rounded-full bg-secondary-container px-3 py-1.5 text-sm font-medium text-on-secondary-container">
              …and you
            </span>
          </div>
        </div>
      </section>

      {/* Upcoming hikes */}
      {featured && (
        <section className="py-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-tertiary">Next up</p>
              <h2 className="font-display text-3xl font-bold text-on-surface">
                {featured.title}
              </h2>
              <p className="mt-1 text-on-surface-variant">
                {formatHikeDate(featured.starts_at)} · {featured.trailhead}
              </p>
            </div>
            <Link
              href="/schedule"
              className="hidden shrink-0 font-medium text-primary hover:underline sm:inline"
            >
              Full schedule →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hikes.map((hike) => (
              <HikeCard key={hike.id} hike={hike} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
