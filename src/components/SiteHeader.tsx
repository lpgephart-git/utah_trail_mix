import Link from "next/link";
import { getCurrentProfile, getUnreadCount } from "@/lib/data";
import { signOut } from "@/app/auth/actions";
import { avatarUrl } from "@/lib/storage";
import { Avatar } from "./Avatar";

export async function SiteHeader() {
  const profile = await getCurrentProfile();
  const unread = profile ? await getUnreadCount() : 0;

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
          {profile && (
            <Link
              href="/"
              className="font-medium text-on-surface-variant hover:text-primary"
            >
              The Mix
            </Link>
          )}
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
            <div className="flex items-center gap-3">
              <Link
                href="/notifications"
                aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
                className="relative text-on-surface-variant hover:text-primary"
              >
                <span aria-hidden className="text-xl">
                  🔔
                </span>
                {unread > 0 && (
                  <span className="absolute -right-1.5 -top-1 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] font-medium leading-4 text-on-primary">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Link>
              <Link href="/account" aria-label="Your profile" className="hover:opacity-80">
                <Avatar
                  name={profile.full_name}
                  imageUrl={avatarUrl(profile.avatar_path)}
                  size="sm"
                />
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full border border-outline-variant px-4 py-1.5 font-medium text-on-surface hover:bg-surface-container"
                >
                  Sign out
                </button>
              </form>
            </div>
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
