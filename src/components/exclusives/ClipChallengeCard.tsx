"use client";

import Link from "next/link";
import { useLocale } from "@/providers/LocaleProvider";

export function ClipChallengeCard() {
  const { t } = useLocale();

  return (
    <section className="overflow-hidden rounded-2xl border border-sky-400/40 bg-gradient-to-br from-sky-50 via-white to-indigo-100 p-5 shadow-md shadow-sky-500/10 dark:border-sky-400/30 dark:from-sky-500/10 dark:via-zinc-950/70 dark:to-indigo-600/10 dark:shadow-sky-500/10 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">
            {t.exclusives.challengeDuelBadge}
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {t.exclusives.challengeClipButton}
          </h2>
          <p className="mt-3 text-base font-medium leading-relaxed text-zinc-700 dark:text-zinc-200">
            {t.exclusives.clipChallengeExclusivesDesc}
          </p>
        </div>

        <Link
          href="/videos"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-sky-600 px-7 py-3.5 text-base font-extrabold text-white shadow-lg shadow-sky-600/30 transition-transform hover:scale-[1.02] active:scale-[0.98] dark:bg-sky-500"
        >
          {t.exclusives.browseVideosToChallenge}
        </Link>
      </div>
    </section>
  );
}
