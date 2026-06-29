export function AppBootSkeleton() {
  return (
    <div
      className="flex min-h-screen flex-col bg-white dark:bg-black"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="h-14 border-b border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-black" />
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-16 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
      <div className="h-[4.5rem] border-t border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-black" />
    </div>
  );
}
