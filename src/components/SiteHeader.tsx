import Link from "next/link";
import { getCurrentProfile } from "@/lib/data";
import { signOut } from "@/app/auth/actions";

export async function SiteHeader() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span aria-hidden className="text-2xl">
            🥾
          </span>
          <span className="font-display text-xl font-bold text-primary">
            Utah Trail Mix
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm sm:gap-6">
          <Link
            href="/schedule"
            className="font-medium text-on-surface-variant hover:text-primary"
          >
            Schedule
          </Link>
          <Link
            href="/about"
            className="hidden font-medium text-on-surface-variant hover:text-primary sm:inline"
          >
            About
          </Link>

          {profile?.is_admin && (
            <Link
              href="/admin"
              className="font-medium text-on-surface-variant hover:text-primary"
            >
              Admin
            </Link>
          )}

          {profile ? (
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-outline-variant px-4 py-1.5 font-medium text-on-surface hover:bg-surface-container"
              >
                Sign out
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden font-medium text-on-surface-variant hover:text-primary sm:inline"
              >
                Log in
              </Link>
              <Link
                href="/join"
                className="rounded-full bg-primary px-4 py-1.5 font-medium text-on-primary hover:bg-primary-container"
              >
                Join
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
