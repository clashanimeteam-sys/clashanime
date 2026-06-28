"use client";

import { useLocale } from "@/providers/LocaleProvider";

type AdblockNoticeModalProps = {
  onRecheck: () => void;
  checking: boolean;
};

export function AdblockNoticeModal({ onRecheck, checking }: AdblockNoticeModalProps) {
  const { t } = useLocale();

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="adblock-notice-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{t.adblock.welcome}</p>
        <h2 id="adblock-notice-title" className="mt-3 text-xl font-bold text-accent">
          {t.adblock.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{t.adblock.body}</p>
        <button
          type="button"
          onClick={onRecheck}
          disabled={checking}
          className="mt-6 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checking ? t.adblock.checking : t.adblock.allowAds}
        </button>
        <details className="mt-4 text-start">
          <summary className="cursor-pointer text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            {t.adblock.howTo}
          </summary>
          <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {t.adblock.howToSteps}
          </p>
        </details>
      </div>
    </div>
  );
}
