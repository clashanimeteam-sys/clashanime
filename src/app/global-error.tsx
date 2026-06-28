"use client";

import { ErrorPageLottie } from "@/components/ErrorPageLottie";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black antialiased dark:bg-black dark:text-white">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
          <ErrorPageLottie />
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#e85d4c]">
            Error
          </p>
          <p className="mt-3 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
            Something went wrong. Please try again or return to the home page.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-black dark:border-zinc-700 dark:text-white"
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
