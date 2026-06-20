"use client";

import { DotLottiePlayer } from "@/components/DotLottiePlayer";
import { LOADING_LOTTIE_SRC } from "@/lib/dotlottie";

type PageLoadingLottieProps = {
  show?: boolean;
};

export function PageLoadingLottie({ show = true }: PageLoadingLottieProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-black/90"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <DotLottiePlayer src={LOADING_LOTTIE_SRC} className="flex items-center justify-center" />
    </div>
  );
}
