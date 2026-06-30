"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BlogHeroSlidePositionEditor } from "@/components/admin/BlogHeroSlidePositionEditor";
import {
  DEFAULT_BLOG_HERO_DISPLAY,
  MAX_BLOG_HERO_SLIDES,
  applyPresetToSlide,
  createEmptyHeroSlideSlots,
  type BlogHeroDisplaySettings,
  type BlogHeroSlide,
} from "@/lib/blog/heroSlides";
import { useLocale } from "@/providers/LocaleProvider";

export function AdminBlogHeroSlidesPanel() {
  const { t } = useLocale();
  const [slides, setSlides] = useState<BlogHeroSlide[]>(createEmptyHeroSlideSlots());
  const [display, setDisplay] = useState<BlogHeroDisplaySettings>(DEFAULT_BLOG_HERO_DISPLAY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSlides = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/blog-hero-slides", { cache: "no-store" });
      const payload = (await response.json()) as {
        slides?: BlogHeroSlide[];
        display?: BlogHeroDisplaySettings;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load slides");
      }

      setSlides(payload.slides ?? createEmptyHeroSlideSlots());
      setDisplay(payload.display ?? DEFAULT_BLOG_HERO_DISPLAY);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load slides");
      setSlides(createEmptyHeroSlideSlots());
      setDisplay(DEFAULT_BLOG_HERO_DISPLAY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSlides();
  }, [loadSlides]);

  const updateSlide = (index: number, patch: Partial<BlogHeroSlide>) => {
    setSlides((current) =>
      current.map((slide, slideIndex) => (slideIndex === index ? { ...slide, ...patch } : slide)),
    );
  };

  const updateDisplay = (patch: Partial<BlogHeroDisplaySettings>) => {
    setDisplay((current) => ({ ...current, ...patch }));
  };

  const uploadImage = async (index: number, file: File) => {
    setUploadingIndex(index);
    setMessage(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/blog-hero-slides", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { imageUrl?: string; error?: string };
      if (!response.ok || !payload.imageUrl) {
        throw new Error(payload.error ?? "Upload failed");
      }

      updateSlide(index, {
        imageUrl: payload.imageUrl,
        enabled: true,
        rotation: 0,
        ...applyPresetToSlide("center"),
      });
      setMessage(t.admin.blog.heroSlides.uploaded.replace("{n}", String(index + 1)));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploadingIndex(null);
    }
  };

  const saveSlides = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/blog-hero-slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides, display }),
      });

      const payload = (await response.json()) as {
        slides?: BlogHeroSlide[];
        display?: BlogHeroDisplaySettings;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Save failed");
      }

      setSlides(payload.slides ?? slides);
      setDisplay(payload.display ?? display);
      setMessage(t.admin.blog.heroSlides.saved);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const enabledCount = slides.filter((slide) => slide.enabled && slide.imageUrl).length;

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">{t.admin.blog.heroSlides.title}</h2>
          <p className="mt-1 max-w-3xl text-sm text-zinc-400">{t.admin.blog.heroSlides.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/blog"
            target="_blank"
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-200 hover:border-orange-500/40"
          >
            {t.admin.blog.heroSlides.previewOnSite}
          </Link>
          <button
            type="button"
            onClick={() => void saveSlides()}
            disabled={saving || loading}
            className="rounded-full border border-orange-500/40 bg-orange-950/30 px-4 py-2 text-sm font-bold text-orange-200 disabled:opacity-50"
          >
            {saving ? t.admin.blog.heroSlides.saving : t.admin.blog.heroSlides.save}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h3 className="text-sm font-bold text-white">{t.admin.blog.heroSlides.displayTitle}</h3>
        <p className="mt-1 text-xs text-zinc-500">{t.admin.blog.heroSlides.displaySubtitle}</p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-200">
            <span>{t.admin.blog.heroSlides.carouselEnabled}</span>
            <input
              type="checkbox"
              checked={display.carouselEnabled}
              onChange={(event) => updateDisplay({ carouselEnabled: event.target.checked })}
              className="rounded border-zinc-600"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-200">
            <span>{t.admin.blog.heroSlides.showTextOverlay}</span>
            <input
              type="checkbox"
              checked={display.showTextOverlay}
              onChange={(event) => updateDisplay({ showTextOverlay: event.target.checked })}
              className="rounded border-zinc-600"
            />
          </label>

          <label className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-200">
            <div className="flex items-center justify-between gap-3">
              <span>{t.admin.blog.heroSlides.overlayOpacity}</span>
              <span className="text-xs text-zinc-400">{display.overlayOpacity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={display.overlayOpacity}
              onChange={(event) => updateDisplay({ overlayOpacity: Number(event.target.value) })}
              className="w-full accent-orange-500"
            />
          </label>

          <label className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-200">
            <div className="flex items-center justify-between gap-3">
              <span>{t.admin.blog.heroSlides.autoPlaySeconds}</span>
              <span className="text-xs text-zinc-400">{display.autoPlaySeconds}s</span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              value={display.autoPlaySeconds}
              onChange={(event) => updateDisplay({ autoPlaySeconds: Number(event.target.value) })}
              className="w-full accent-orange-500"
            />
          </label>
        </div>
      </div>

      <p className="text-xs text-zinc-500">
        {t.admin.blog.heroSlides.slotsMeta
          .replace("{max}", String(MAX_BLOG_HERO_SLIDES))
          .replace("{active}", String(enabledCount))}
      </p>

      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.blog.heroSlides.loading}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {slides.map((slide, index) => (
            <div key={slide.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">
                  {t.admin.blog.heroSlides.slotLabel.replace("{n}", String(index + 1))}
                </p>
                <label className="flex items-center gap-2 text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={slide.enabled}
                    disabled={!slide.imageUrl}
                    onChange={(event) => updateSlide(index, { enabled: event.target.checked })}
                    className="rounded border-zinc-600"
                  />
                  {t.admin.blog.heroSlides.enabled}
                </label>
              </div>

              <div className="mb-3 space-y-2">
                <label className="block text-xs text-zinc-400">
                  {t.admin.blog.heroSlides.imageUrlLabel}
                  <input
                    type="url"
                    value={slide.imageUrl}
                    onChange={(event) => {
                      const imageUrl = event.target.value;
                      updateSlide(index, {
                        imageUrl,
                        enabled: imageUrl.trim() ? slide.enabled || true : false,
                      });
                    }}
                    placeholder={t.admin.blog.heroSlides.imageUrlPlaceholder}
                    className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-200"
                  />
                </label>
                <label className="block text-xs text-zinc-400">
                  {t.admin.blog.heroSlides.linkUrlLabel}
                  <input
                    type="url"
                    value={slide.linkUrl ?? ""}
                    onChange={(event) => updateSlide(index, { linkUrl: event.target.value })}
                    placeholder={t.admin.blog.heroSlides.linkUrlPlaceholder}
                    className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-200"
                  />
                </label>
              </div>

              {slide.imageUrl ? (
                <BlogHeroSlidePositionEditor
                  imageUrl={slide.imageUrl}
                  focalX={slide.focalX}
                  focalY={slide.focalY}
                  rotation={slide.rotation ?? 0}
                  onChange={(patch) => updateSlide(index, patch)}
                />
              ) : (
                <div className="mb-3 flex aspect-[5/1] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-center text-xs text-zinc-500">
                  {t.admin.blog.heroSlides.emptySlot}
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="cursor-pointer rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-orange-500/40">
                  {uploadingIndex === index
                    ? t.admin.blog.heroSlides.uploading
                    : t.admin.blog.heroSlides.upload}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={uploadingIndex !== null}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void uploadImage(index, file);
                      }
                      event.currentTarget.value = "";
                    }}
                  />
                </label>

                {slide.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => updateSlide(index, { imageUrl: "", linkUrl: "", enabled: false })}
                    className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-red-500/40 hover:text-red-200"
                  >
                    {t.admin.blog.heroSlides.remove}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
