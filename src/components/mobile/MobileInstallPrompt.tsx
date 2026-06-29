"use client";

import Image from "next/image";
import { useLocale } from "@/providers/LocaleProvider";
import { usePwaInstall } from "@/hooks/usePwaInstall";

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="inline h-4 w-4 align-[-2px] text-sky-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3v10" strokeLinecap="round" />
      <path d="m8 7 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" strokeLinecap="round" />
    </svg>
  );
}

export function MobileInstallPrompt() {
  const { t } = useLocale();
  const {
    visible,
    dismiss,
    install,
    installing,
    showIosSteps,
    showNativeInstall,
  } = usePwaInstall();

  if (!visible) return null;

  const iosSteps = t.mobileApp.installIosSteps.replace(
    "{share}",
    `<share>${t.mobileApp.installShare}</share>`,
  );
  const [beforeShare, afterShare = ""] = iosSteps.split("<share>");
  const [shareLabel, afterShareRest = ""] = afterShare.split("</share>");

  return (
    <>
      <button
        type="button"
        aria-label={t.mobileApp.installDismiss}
        className="fixed inset-0 z-[55] bg-black/45 backdrop-blur-[1px] md:hidden"
        onClick={dismiss}
      />
      <section
        role="dialog"
        aria-labelledby="mobile-install-title"
        aria-describedby="mobile-install-desc"
        className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-[60] px-3 md:hidden"
      >
        <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-orange-500/25 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] dark:border-orange-500/20 dark:bg-zinc-950">
          <div className="h-1 bg-gradient-to-r from-orange-600 via-red-600 to-amber-500" />
          <div className="flex items-start gap-3 p-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-orange-500/20 bg-black">
              <Image
                src="/icon-180.png"
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id="mobile-install-title"
                className="font-display text-base font-bold text-black dark:text-white"
              >
                {t.mobileApp.installTitle}
              </h2>
              <p
                id="mobile-install-desc"
                className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300"
              >
                {t.mobileApp.installSubtitle}
              </p>
              {showIosSteps ? (
                <p className="mt-3 rounded-xl bg-zinc-100 px-3 py-2 text-xs leading-relaxed text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                  {beforeShare}
                  <span className="mx-1 inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 font-semibold text-sky-600 shadow-sm dark:bg-zinc-800">
                    <ShareIcon />
                    {shareLabel}
                  </span>
                  {afterShareRest}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label={t.mobileApp.installDismiss}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 border-t border-zinc-200/80 px-4 py-3 dark:border-zinc-800">
            <button
              type="button"
              onClick={dismiss}
              className="flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {t.mobileApp.installDismiss}
            </button>
            {showNativeInstall ? (
              <button
                type="button"
                onClick={() => void install()}
                disabled={installing}
                className="flex-1 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-3 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-70"
              >
                {installing ? "..." : t.mobileApp.installAction}
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
