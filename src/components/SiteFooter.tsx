import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-outline-variant/40 bg-surface-container">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg font-bold text-tertiary">
            Utah Trail Mix
          </p>
          <p className="text-sm text-on-surface-variant">
            © {new Date().getFullYear()} Utah Trail Mix for educators.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/schedule" className="hover:text-primary">
            Schedule
          </Link>
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
          <Link href="/join" className="hover:text-primary">
            Join
          </Link>
        </nav>
      </div>
    </footer>
  );
}
