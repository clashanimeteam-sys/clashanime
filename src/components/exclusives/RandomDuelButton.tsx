"use client";

import Link from "next/link";
import { useLocale } from "@/providers/LocaleProvider";

export function RandomDuelButton() {
  const { t } = useLocale();

  return (
    <section className="overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/15 via-zinc-950/50 to-red-600/10 p-5 shadow-lg shadow-accent/10 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {t.exclusives.randomDuelBadge}
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            {t.exclusives.randomDuelTitle}
          </h2>
          <p className="mt-2 text-sm text-zinc-300">{t.exclusives.randomDuelDesc}</p>
        </div>

        <Link
          href="/duel/random"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-lg shadow-accent/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t.exclusives.startRandomDuel}
        </Link>
      </div>
    </section>
  );
}
