"use client";

import Link from "next/link";
import { useLocale } from "@/providers/LocaleProvider";

export function RandomDuelButton() {
  const { t } = useLocale();

  return (
    <section className="overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-br from-orange-50 via-white to-red-100 p-5 shadow-md shadow-accent/15 dark:border-accent/30 dark:from-accent/15 dark:via-zinc-950/70 dark:to-red-600/10 dark:shadow-accent/10 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-wide text-accent dark:text-accent">
            {t.exclusives.randomDuelBadge}
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {t.exclusives.randomDuelTitle}
          </h2>
          <p className="mt-3 text-base font-medium leading-relaxed text-zinc-700 dark:text-zinc-200">
            {t.exclusives.randomDuelDesc}
          </p>
        </div>

        <Link
          href="/duel/random"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-7 py-3.5 text-base font-extrabold text-white shadow-lg shadow-accent/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t.exclusives.startRandomDuel}
        </Link>
      </div>
    </section>
  );
}
