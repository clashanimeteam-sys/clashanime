"use client";

import type { AnimeSynopsis } from "@/lib/animeTracker";
import { animeSynopsisEntries, localizedAnimeSynopsis } from "@/lib/animeTracker";
import { useLocale } from "@/providers/LocaleProvider";

type AnimeSynopsisBlockProps = {
  synopsis: Partial<AnimeSynopsis>;
  variant?: "compact" | "full";
};

const localeLabels = {
  en: "English",
  ar: "العربية",
  ja: "日本語",
} as const;

function normalizeSynopsis(synopsis: Partial<AnimeSynopsis>): AnimeSynopsis {
  return {
    synopsisEn: synopsis.synopsisEn ?? null,
    synopsisAr: synopsis.synopsisAr ?? null,
    synopsisJa: synopsis.synopsisJa ?? null,
  };
}

export function AnimeSynopsisBlock({ synopsis, variant = "compact" }: AnimeSynopsisBlockProps) {
  const { locale, t } = useLocale();
  const normalized = normalizeSynopsis(synopsis);
  const entries = animeSynopsisEntries(normalized);
  const primary = localizedAnimeSynopsis(normalized, locale);

  if (!primary && entries.length === 0) return null;

  if (variant === "compact") {
    if (!primary) return null;
    return (
      <div className="mt-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
          {t.animeTracker.storyTitle}
        </p>
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {primary}
        </p>
      </div>
    );
  }

  const visibleEntries =
    entries.length > 1
      ? entries
      : [];

  if (visibleEntries.length > 0) {
    return (
      <div className="mt-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
          {t.animeTracker.storyTitle}
        </p>
        {visibleEntries.map((entry) => (
          <div
            key={entry.locale}
            className="rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/50"
          >
            <p className="text-xs font-bold text-violet-700 dark:text-violet-300">
              {localeLabels[entry.locale]}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{entry.text}</p>
          </div>
        ))}
      </div>
    );
  }

  if (!primary) return null;

  return (
    <div className="mt-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
        {t.animeTracker.storyTitle}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{primary}</p>
    </div>
  );
}
