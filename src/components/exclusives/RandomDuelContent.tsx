"use client";

import Link from "next/link";
import { DuelArenaContent } from "@/components/duel/DuelArenaContent";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type RandomDuelContentProps = {
  pair: { left: Video; right: Video } | null;
};

export function RandomDuelContent({ pair }: RandomDuelContentProps) {
  const { t } = useLocale();

  if (!pair) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          {t.exclusives.randomDuelTitle}
        </h1>
        <p className="mt-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {t.exclusives.noDuelVideos}
        </p>
        <Link href="/exclusives" className="mt-6 inline-flex text-sm font-semibold text-accent hover:underline">
          {t.exclusives.backToExclusives}
        </Link>
      </div>
    );
  }

  return (
    <DuelArenaContent
      left={pair.left}
      right={pair.right}
      badge={t.exclusives.randomDuelBadge}
      title={t.exclusives.randomDuelTitle}
      description={t.exclusives.randomDuelPageDesc}
    />
  );
}
