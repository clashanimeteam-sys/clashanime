"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ReportContentForm } from "@/components/ReportContentForm";
import { useLocale } from "@/providers/LocaleProvider";

function ReportContentPageInner() {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const videoParam = searchParams.get("video") ?? "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-black dark:text-white">{t.legal.reportTitle}</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t.legal.reportIntro}
      </p>

      <div className="mt-8">
        <ReportContentForm initialVideoId={videoParam} lockVideoId={Boolean(videoParam)} />
      </div>

      <p className="mt-8 text-xs text-zinc-500">{t.legal.reportDmcaHint}</p>
    </div>
  );
}

export function ReportContentPage() {
  const { t } = useLocale();

  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm text-zinc-500">{t.auth.loading}</p>}>
      <ReportContentPageInner />
    </Suspense>
  );
}
