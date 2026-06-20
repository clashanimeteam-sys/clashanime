"use client";

import { DotLottiePlayer } from "@/components/DotLottiePlayer";
import { MAINTENANCE_LOTTIE_SRC } from "@/lib/dotlottie";
import { useLocale } from "@/providers/LocaleProvider";

export function MaintenanceScreen() {
  const { t } = useLocale();

  return (
    <div className="fixed inset-0 z-[300] flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-black">
      <DotLottiePlayer
        src={MAINTENANCE_LOTTIE_SRC}
        className="flex items-center justify-center"
      />
      <p className="mt-8 max-w-lg text-center text-lg font-semibold leading-relaxed text-zinc-800 dark:text-zinc-100 sm:text-xl">
        {t.home.maintenanceMode}
      </p>
    </div>
  );
}
