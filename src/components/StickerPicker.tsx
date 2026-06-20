"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getPackName, type AnimeSticker } from "@/lib/stickers";
import { useLocale } from "@/providers/LocaleProvider";
import { useStickers } from "@/providers/StickersProvider";

type StickerPickerProps = {
  onPick: (stickerId: string) => void;
};

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

export function StickerPicker({ onPick }: StickerPickerProps) {
  const { locale, t } = useLocale();
  const { catalog, stickerMap, loading } = useStickers();
  const [activePackId, setActivePackId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const normalizedQuery = normalizeSearch(query);

  const filteredPacks = useMemo(() => {
    if (!normalizedQuery) return catalog;

    return catalog
      .map((pack) => {
        const packName = getPackName(pack, locale).toLowerCase();
        const stickers = pack.stickers.filter((sticker) => {
          const haystack = `${packName} ${sticker.label} ${sticker.slug}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        });

        if (packName.includes(normalizedQuery)) return pack;
        if (stickers.length === 0) return null;
        return { ...pack, stickers };
      })
      .filter((pack): pack is NonNullable<typeof pack> => Boolean(pack));
  }, [catalog, locale, normalizedQuery]);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [] as AnimeSticker[];

    const results = [];
    for (const sticker of stickerMap.values()) {
      const pack = catalog.find((entry) => entry.id === sticker.pack_id);
      const packName = pack ? getPackName(pack, locale).toLowerCase() : "";
      const haystack = `${packName} ${sticker.label} ${sticker.slug}`.toLowerCase();
      if (haystack.includes(normalizedQuery)) {
        results.push(sticker);
      }
    }

    return results.slice(0, 120);
  }, [catalog, locale, normalizedQuery, stickerMap]);

  useEffect(() => {
    if (!filteredPacks.length) {
      setActivePackId(null);
      return;
    }

    if (!activePackId || !filteredPacks.some((pack) => pack.id === activePackId)) {
      setActivePackId(filteredPacks[0]?.id ?? null);
    }
  }, [filteredPacks, activePackId]);

  const activePack =
    filteredPacks.find((pack) => pack.id === activePackId) ?? filteredPacks[0] ?? null;

  const visibleStickers = normalizedQuery ? searchResults : (activePack?.stickers ?? []);

  return (
    <div className="absolute bottom-full end-0 z-20 mb-2 w-80 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      {loading ? (
        <p className="px-2 py-3 text-xs text-zinc-500">{t.stickers.loading}</p>
      ) : catalog.length === 0 ? (
        <p className="px-2 py-3 text-xs text-zinc-500">{t.stickers.empty}</p>
      ) : (
        <>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.stickers.searchPlaceholder}
            className="mb-2 w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
          />

          {!normalizedQuery ? (
            <div className="mb-2 flex max-h-16 gap-1 overflow-x-auto pb-1">
              {filteredPacks.slice(0, 40).map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => setActivePackId(pack.id)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                    pack.id === activePack?.id
                      ? "bg-accent text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                  title={getPackName(pack, locale)}
                >
                  {getPackName(pack, locale)}
                </button>
              ))}
            </div>
          ) : (
            <p className="mb-2 px-1 text-[10px] font-semibold text-zinc-500">
              {t.stickers.searchResults.replace("{count}", String(searchResults.length))}
            </p>
          )}

          <div className="grid max-h-56 grid-cols-4 gap-1 overflow-y-auto">
            {visibleStickers.map((sticker) => (
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

          {!normalizedQuery && filteredPacks.length > 40 ? (
            <p className="mt-2 px-1 text-[10px] text-zinc-500">{t.stickers.searchHint}</p>
          ) : null}
        </>
      )}
    </div>
  );
}
