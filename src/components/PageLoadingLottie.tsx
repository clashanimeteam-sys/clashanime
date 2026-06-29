"use client";

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
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-accent dark:border-zinc-800" />
    </div>
  );
}
