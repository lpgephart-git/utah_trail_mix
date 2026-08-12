import Link from "next/link";
import { getCurrentProfile } from "@/lib/data";

export const metadata = {
  title: "About — Utah Trail Mix",
};

export default async function AboutPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-on-surface">
        About Utah Trail Mix
      </h1>
      <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-on-surface-variant">
        <p>
          Utah Trail Mix is a hiking community for the people who make Utah schools
          run. If you work at a school or district — teacher, nutrition or food
          service, nurse, counselor, coach, front office, custodial, bus driver,
          administrator, anyone — you&apos;re welcome here. We&apos;ve got a nutrition
          and wellness heart, but nobody needs the &quot;right&quot; job title to lace
          up and come along.
        </p>
        <p>
          We hike the Wasatch Front about once a month, with a range of difficulty
          so nobody has to sit one out. Every hike lists the trail, the meetup
          details, and a map — and once you&apos;re a member you can RSVP and chat
          with the group right here on the site.
        </p>
        <p>
          The whole idea is simple: fresh air, good company, and genuine
          connections across roles and districts. Lace up and come say hello.
        </p>
      </div>
      <div className="mt-8">
        {profile ? (
          <Link
            href="/schedule"
            className="rounded-full bg-primary px-6 py-3 font-medium text-on-primary hover:bg-primary-container"
          >
            See the schedule
          </Link>
        ) : (
          <Link
            href="/join"
            className="rounded-full bg-primary px-6 py-3 font-medium text-on-primary hover:bg-primary-container"
          >
            Join the group
          </Link>
        )}
      </div>
    </div>
  );
}
