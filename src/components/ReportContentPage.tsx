"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PageBackLink } from "@/components/PageBackLink";
import { ReportContentForm } from "@/components/ReportContentForm";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

function ReportContentPageInner() {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  usePageTitle(t.legal.reportTitle);
  const videoParam = searchParams.get("video") ?? "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <PageBackLink href="/" label={t.common.backToHome} className="mb-4" />
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
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
