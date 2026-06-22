"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimeRadioPlayer } from "@/components/AnimeRadioPlayer";
import { AnimeBeatsLoungeSection } from "@/components/lounge/AnimeBeatsLoungeSection";
import type { BeatsTrack } from "@/lib/animeBeatsLounge";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type MusicPageContentProps = {
  initialPlaylist: BeatsTrack[];
};

type MusicMode = "radio" | "lounge";

export function MusicPageContent({ initialPlaylist }: MusicPageContentProps) {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const requestedMode = searchParams.get("mode");
  const [mode, setMode] = useState<MusicMode>(requestedMode === "lounge" ? "lounge" : "radio");

  useEffect(() => {
    if (requestedMode === "lounge") setMode("lounge");
  }, [requestedMode]);

  usePageTitle(mode === "lounge" ? t.lounge.title : t.radio.title);

  return (
    <div>
      <div className="mx-auto mb-4 flex max-w-5xl flex-wrap gap-2 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setMode("radio")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            mode === "radio"
              ? "bg-accent text-white"
              : "border border-zinc-300 text-zinc-700 dark:border-white/15 dark:text-zinc-200"
          }`}
        >
          {t.lounge.tabRadio}
        </button>
        <button
          type="button"
          onClick={() => setMode("lounge")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            mode === "lounge"
              ? "bg-fuchsia-500 text-white"
              : "border border-zinc-300 text-zinc-700 dark:border-white/15 dark:text-zinc-200"
          }`}
        >
          {t.lounge.tabLounge}
        </button>
      </div>

      {mode === "radio" ? (
        <AnimeRadioPlayer />
      ) : (
        <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
          <AnimeBeatsLoungeSection initialPlaylist={initialPlaylist} />
        </div>
      )}
    </div>
  );
}
