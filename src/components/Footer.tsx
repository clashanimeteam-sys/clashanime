import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-semibold text-foreground">ClashAnime.com</p>
          <p className="mt-1 text-xs text-muted">
            Anime duels ranked by real-time community engagement.
          </p>
        </div>

        <nav className="flex flex-wrap gap-4 text-xs text-muted">
          <Link href="/terms" className="transition-colors hover:text-brand">
            Terms of Use
          </Link>
          <Link href="/dmca" className="transition-colors hover:text-brand">
            DMCA
          </Link>
          <Link href="/report" className="transition-colors hover:text-brand">
            Report Content
          </Link>
        </nav>
      </div>
    </footer>
  );
}
