"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimeRadioPlayer } from "@/components/AnimeRadioPlayer";
import { AnimeBeatsLoungeSection } from "@/components/lounge/AnimeBeatsLoungeSection";
import type { BeatsTrack } from "@/lib/animeBeatsLounge";
import { useBeatsLounge } from "@/providers/BeatsLoungeProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type MusicPageContentProps = {
  initialPlaylist: BeatsTrack[];
};

type MusicMode = "radio" | "lounge";

export function MusicPageContent({ initialPlaylist }: MusicPageContentProps) {
  const { t } = useLocale();
  const { setLoungePanelOpen } = useBeatsLounge();
  const searchParams = useSearchParams();
  const requestedMode = searchParams.get("mode");
  const [mode, setMode] = useState<MusicMode>(requestedMode === "lounge" ? "lounge" : "radio");

  useEffect(() => {
    if (requestedMode === "lounge") setMode("lounge");
  }, [requestedMode]);

  useEffect(() => {
    setLoungePanelOpen(mode === "lounge");
    return () => setLoungePanelOpen(false);
  }, [mode, setLoungePanelOpen]);

  usePageTitle(mode === "lounge" ? t.lounge.title : t.radio.title);

  return (
    <div>
      <div className="mx-auto mb-6 flex max-w-5xl flex-wrap gap-2 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setMode("radio")}
          className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
            mode === "radio"
              ? "bg-red-500 text-white shadow-md shadow-red-500/25"
              : "border-2 border-zinc-300 bg-white text-zinc-800 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          }`}
        >
          {t.lounge.tabRadio}
        </button>
        <button
          type="button"
          onClick={() => setMode("lounge")}
          className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
            mode === "lounge"
              ? "bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30"
              : "border-2 border-zinc-300 bg-white text-zinc-800 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
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
