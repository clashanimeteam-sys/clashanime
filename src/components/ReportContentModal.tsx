"use client";

import { useEffect } from "react";
import { ModalPortal } from "@/components/ModalPortal";
import { ReportContentForm } from "@/components/ReportContentForm";
import { useScrollLock } from "@/lib/useScrollLock";
import { useLocale } from "@/providers/LocaleProvider";

type ReportContentModalProps = {
  open: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle?: string;
};

export function ReportContentModal({
  open,
  onClose,
  videoId,
  videoTitle,
}: ReportContentModalProps) {
  const { t } = useLocale();

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <ModalPortal open={open}>
      <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center">
        <button
          type="button"
          aria-label={t.auth.close}
          className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
          className="relative z-10 m-4 max-h-[min(92dvh,760px)] w-[min(100%,42rem)] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:p-6"
        >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="report-modal-title" className="text-xl font-bold text-black dark:text-white">
              {t.legal.reportTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t.legal.reportIntro}
            </p>
            {videoTitle ? (
              <p className="mt-2 truncate text-xs font-semibold text-zinc-500">{videoTitle}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.auth.close}
            className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ReportContentForm
          initialVideoId={videoId}
          lockVideoId
          onSuccess={() => {
            window.setTimeout(onClose, 1200);
          }}
        />

        <p className="mt-6 text-xs text-zinc-500">{t.legal.reportDmcaHint}</p>
        </div>
      </div>
    </ModalPortal>
  );
}
