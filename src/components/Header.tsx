import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const locales = [
  { code: "en", label: "EN" },
  { code: "ja", label: "JA" },
  { code: "ar", label: "AR" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="ClashAnime"
            width={40}
            height={40}
            priority
            className="h-10 w-10"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-bold tracking-wide text-foreground">
              ClashAnime
            </p>
            <p className="text-xs text-muted">Duel System</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex items-center rounded-lg border border-border bg-surface p-0.5"
            role="group"
            aria-label="Language"
          >
            {locales.map((locale) => (
              <button
                key={locale.code}
                type="button"
                className="rounded-md px-2.5 py-1 text-xs font-semibold text-muted transition-colors first:text-brand hover:text-foreground"
                aria-pressed={locale.code === "en"}
              >
                {locale.label}
              </button>
            ))}
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
