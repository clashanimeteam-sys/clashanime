"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getPackName } from "@/lib/stickers";
import { useLocale } from "@/providers/LocaleProvider";
import { useStickers } from "@/providers/StickersProvider";

type StickerPickerProps = {
  onPick: (stickerId: string) => void;
};

export function StickerPicker({ onPick }: StickerPickerProps) {
  const { locale, t } = useLocale();
  const { catalog, loading } = useStickers();
  const [activePackId, setActivePackId] = useState<string | null>(null);

  useEffect(() => {
    if (!catalog.length) {
      setActivePackId(null);
      return;
    }

    if (!activePackId || !catalog.some((pack) => pack.id === activePackId)) {
      setActivePackId(catalog[0]?.id ?? null);
    }
  }, [catalog, activePackId]);

  const activePack = catalog.find((pack) => pack.id === activePackId) ?? catalog[0] ?? null;

  return (
    <div className="absolute bottom-full end-0 z-20 mb-2 w-72 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      {loading ? (
        <p className="px-2 py-3 text-xs text-zinc-500">{t.stickers.loading}</p>
      ) : catalog.length === 0 ? (
        <p className="px-2 py-3 text-xs text-zinc-500">{t.stickers.empty}</p>
      ) : (
        <>
          <div className="mb-2 flex gap-1 overflow-x-auto pb-1">
            {catalog.map((pack) => (
              <button
                key={pack.id}
                type="button"
                onClick={() => setActivePackId(pack.id)}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                  pack.id === activePack?.id
                    ? "bg-accent text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {getPackName(pack, locale)}
              </button>
            ))}
          </div>

          <div className="grid max-h-52 grid-cols-4 gap-1 overflow-y-auto">
            {(activePack?.stickers ?? []).map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                onClick={() => onPick(sticker.id)}
                title={sticker.label || sticker.slug}
                className="rounded-lg p-1 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Image
                  src={sticker.image_url}
                  alt={sticker.label || sticker.slug}
                  width={56}
                  height={56}
                  unoptimized
                  className="mx-auto h-14 w-14 object-contain"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
