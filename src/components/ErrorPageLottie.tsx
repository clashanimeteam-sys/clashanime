"use client";

import { DotLottiePlayer } from "@/components/DotLottiePlayer";
import { ERROR_LOTTIE_SIZE, ERROR_LOTTIE_SRC } from "@/lib/dotlottie";

export function ErrorPageLottie() {
  return (
    <DotLottiePlayer
      src={ERROR_LOTTIE_SRC}
      size={ERROR_LOTTIE_SIZE}
      className="flex items-center justify-center"
    />
  );
}
