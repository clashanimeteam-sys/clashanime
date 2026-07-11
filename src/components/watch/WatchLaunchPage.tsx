"use client";

import { useEffect } from "react";
import { useLocale } from "@/providers/LocaleProvider";

export function WatchLaunchPage() {
  const { locale } = useLocale();

  useEffect(() => {
    window.open("/api/watch/redirect", "_blank", "noopener,noreferrer");
  }, []);

  const copy =
    locale === "ar"
      ? {
          title: "شاهد الأنمي",
          body: "موقع المشاهدة مستقل على watchclashanime.com. اضغط الزر لفتحه في تبويب جديد.",
          cta: "افتح موقع المشاهدة",
        }
      : locale === "ja"
        ? {
            title: "アニメ視聴",
            body: "視聴サイトは watchclashanime.com で独立運営されています。ボタンで新しいタブを開きます。",
            cta: "視聴サイトを開く",
          }
        : {
            title: "Watch Anime",
            body: "Streaming lives on watchclashanime.com. Open it in a new tab to start watching.",
            cta: "Open watch site",
          };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-3xl">🎬</div>
      <h1 className="text-2xl font-bold text-black dark:text-white">{copy.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{copy.body}</p>
      <a
        href="/api/watch/redirect"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent/30 transition hover:opacity-90"
      >
        {copy.cta}
      </a>
    </div>
  );
}
