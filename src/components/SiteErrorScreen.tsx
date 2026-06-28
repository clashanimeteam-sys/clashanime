"use client";

import type { ReactNode } from "react";
import { ErrorPageLottie } from "@/components/ErrorPageLottie";

type SiteErrorScreenProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function SiteErrorScreen({ title, description, actions }: SiteErrorScreenProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white px-4 py-12 text-center dark:bg-black">
      <ErrorPageLottie />
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-accent">{title}</p>
      <p className="mt-3 max-w-md text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      {actions ? <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{actions}</div> : null}
    </div>
  );
}
