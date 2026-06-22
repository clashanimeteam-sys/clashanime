"use client";

import Link from "next/link";
import { usePageTitle } from "@/providers/PageTitleProvider";

export default function NotFound() {
  usePageTitle("Page not found");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white px-4 text-center dark:bg-black">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <p className="mt-3 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Back to Clash Anime
      </Link>
    </div>
  );
}
