"use client";

import { DuelArenaContent } from "@/components/duel/DuelArenaContent";
import { useLocale } from "@/providers/LocaleProvider";
import type { VideoDuelRecord } from "@/lib/videoDuelsServer";

type ChallengeDuelContentProps = {
  duel: VideoDuelRecord;
};

export function ChallengeDuelContent({ duel }: ChallengeDuelContentProps) {
  const { t } = useLocale();

  return (
    <DuelArenaContent
      left={duel.challengedVideo}
      right={duel.challengerVideo}
      badge={t.exclusives.challengeDuelBadge}
      title={t.exclusives.challengeDuelTitle}
      description={t.exclusives.challengeDuelPageDesc}
    />
  );
}
