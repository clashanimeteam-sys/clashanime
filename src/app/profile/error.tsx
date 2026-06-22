"use client";

import { useLocale } from "@/providers/LocaleProvider";

type ProfileErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProfileError({ reset }: ProfileErrorProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="text-lg font-semibold text-black dark:text-white">{t.profile.loadFailed}</p>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.profile.retry}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          {t.profile.retry}
        </button>
        <a
          href="/"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-black dark:border-zinc-700 dark:text-white"
        >
          {t.video.backHome}
        </a>
      </div>
    </div>
  );
}
