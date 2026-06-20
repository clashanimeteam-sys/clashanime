"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { isAdmin } from "@/lib/admin";
import { createBrowserClient } from "@/lib/supabase/client";
import { getSupabaseConfig } from "@/lib/supabase/config";
import {
  fetchStickerCatalog,
  uploadAnimeStickerFile,
  type AnimeSticker,
  type StickerPackWithStickers,
} from "@/lib/stickers";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { useStickers } from "@/providers/StickersProvider";

const MAX_STICKER_BYTES = 2 * 1024 * 1024;

export function AdminStickersPanel() {
  const { profile } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const config = useMemo(() => getSupabaseConfig(), []);
  const { refreshStickers } = useStickers();

  const [packs, setPacks] = useState<StickerPackWithStickers[]>([]);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [packSlug, setPackSlug] = useState("");
  const [packNameEn, setPackNameEn] = useState("");
  const [packNameAr, setPackNameAr] = useState("");
  const [packNameJa, setPackNameJa] = useState("");

  const [stickerSlug, setStickerSlug] = useState("");
  const [stickerLabel, setStickerLabel] = useState("");
  const [stickerFile, setStickerFile] = useState<File | null>(null);

  const canManage = isAdmin(profile);

  const loadPacks = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    try {
      const { catalog } = await fetchStickerCatalog(supabase, { includeInactive: true });
      setPacks(catalog);
      setSelectedPackId((current) => current ?? catalog[0]?.id ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t.admin.saveFailed);
    } finally {
      setLoading(false);
    }
  }, [supabase, t.admin.saveFailed]);

  useEffect(() => {
    if (canManage) {
      void loadPacks();
    } else {
      setLoading(false);
    }
  }, [canManage, loadPacks]);

  const selectedPack = packs.find((pack) => pack.id === selectedPackId) ?? null;

  async function handleCreatePack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !canManage) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("anime_sticker_packs")
      .insert({
        slug: packSlug.trim().toLowerCase(),
        name_en: packNameEn.trim(),
        name_ar: packNameAr.trim(),
        name_ja: packNameJa.trim(),
      })
      .select("id")
      .single();

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setPackSlug("");
    setPackNameEn("");
    setPackNameAr("");
    setPackNameJa("");
    setSelectedPackId(data.id);
    setMessage(t.admin.packCreated);
    await loadPacks();
    await refreshStickers();
  }

  async function handleUploadSticker(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !config || !canManage || !selectedPack || !stickerFile) return;

    if (stickerFile.size > MAX_STICKER_BYTES) {
      setError(t.admin.stickerTooLarge);
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    const slug = stickerSlug.trim().toLowerCase();
    const uploaded = await uploadAnimeStickerFile(
      supabase,
      config.url,
      stickerFile,
      selectedPack.slug,
      slug,
    );

    if (!uploaded) {
      setSaving(false);
      setError(t.admin.saveFailed);
      return;
    }

    const { error: insertError } = await supabase.from("anime_stickers").insert({
      pack_id: selectedPack.id,
      slug,
      label: stickerLabel.trim() || slug,
      image_url: uploaded.imageUrl,
      media_type: uploaded.mediaType,
    });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setStickerSlug("");
    setStickerLabel("");
    setStickerFile(null);
    setMessage(t.admin.stickerCreated);
    await loadPacks();
    await refreshStickers();
  }

  async function toggleStickerActive(sticker: AnimeSticker) {
    if (!supabase || !canManage) return;

    const { error: updateError } = await supabase
      .from("anime_stickers")
      .update({ active: !sticker.active })
      .eq("id", sticker.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadPacks();
    await refreshStickers();
  }

  async function deleteSticker(sticker: AnimeSticker) {
    if (!supabase || !canManage) return;
    if (!window.confirm(t.admin.confirmDeleteSticker)) return;

    const { error: deleteError } = await supabase.from("anime_stickers").delete().eq("id", sticker.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setMessage(t.admin.deleted);
    await loadPacks();
    await refreshStickers();
  }

  if (!canManage) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-sm text-zinc-400">
        {t.admin.adminOnly}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.stickersTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.stickersSubtitle}</p>
      </div>

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <>
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="text-lg font-semibold text-white">{t.admin.createPack}</h2>
            <form onSubmit={handleCreatePack} className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm text-zinc-300">{t.admin.stickerPackSlug}</span>
                <input
                  value={packSlug}
                  onChange={(event) => setPackSlug(event.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-zinc-300">{t.admin.stickerPackNameEn}</span>
                <input
                  value={packNameEn}
                  onChange={(event) => setPackNameEn(event.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-zinc-300">{t.admin.stickerPackNameAr}</span>
                <input
                  value={packNameAr}
                  onChange={(event) => setPackNameAr(event.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-zinc-300">{t.admin.stickerPackNameJa}</span>
                <input
                  value={packNameJa}
                  onChange={(event) => setPackNameJa(event.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {t.admin.createPack}
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">{t.admin.uploadSticker}</h2>
              <select
                value={selectedPackId ?? ""}
                onChange={(event) => setSelectedPackId(event.target.value || null)}
                className="rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
              >
                {packs.map((pack) => (
                  <option key={pack.id} value={pack.id}>
                    {pack.name_en} ({pack.stickers.length})
                  </option>
                ))}
              </select>
            </div>

            <p className="mt-2 text-xs text-zinc-500">{t.admin.uploadStickerHint}</p>

            <form onSubmit={handleUploadSticker} className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm text-zinc-300">{t.admin.stickerSlug}</span>
                <input
                  value={stickerSlug}
                  onChange={(event) => setStickerSlug(event.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-zinc-300">{t.admin.stickerLabel}</span>
                <input
                  value={stickerLabel}
                  onChange={(event) => setStickerLabel(event.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm text-zinc-300">{t.admin.stickerFile}</span>
                <input
                  type="file"
                  accept="image/gif,image/webp,image/png"
                  required
                  onChange={(event) => setStickerFile(event.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving || !selectedPack || !stickerFile}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {t.admin.uploadSticker}
                </button>
              </div>
            </form>
          </section>

          <section className="space-y-4">
            {packs.length === 0 ? (
              <p className="text-sm text-zinc-400">{t.admin.noStickerPacks}</p>
            ) : (
              packs.map((pack) => (
                <div key={pack.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-white">
                      {pack.name_en} · {pack.slug}
                    </h3>
                    <span className="text-xs text-zinc-500">
                      {pack.stickers.length} {t.admin.stickerCountLabel}
                    </span>
                  </div>

                  {pack.stickers.length === 0 ? (
                    <p className="mt-3 text-sm text-zinc-500">{t.admin.noStickers}</p>
                  ) : (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                      {pack.stickers.map((sticker) => (
                        <div
                          key={sticker.id}
                          className="rounded-xl border border-zinc-800 bg-black/40 p-2"
                        >
                          <div className="relative mx-auto h-20 w-20">
                            <Image
                              src={sticker.image_url}
                              alt={sticker.label || sticker.slug}
                              fill
                              unoptimized
                              className="object-contain"
                            />
                          </div>
                          <p className="mt-2 truncate text-xs text-zinc-300">
                            {sticker.label || sticker.slug}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => toggleStickerActive(sticker)}
                              className="text-[11px] font-semibold text-zinc-400 hover:text-white"
                            >
                              {sticker.active ? t.admin.active : "Off"}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSticker(sticker)}
                              className="text-[11px] font-semibold text-red-400 hover:text-red-300"
                            >
                              {t.admin.delete}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
}
