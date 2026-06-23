export default function TrackerLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-10 h-48 rounded-3xl bg-zinc-100 dark:bg-zinc-900" />
      <div className="mb-12 grid gap-5 lg:grid-cols-2">
        <div className="h-40 rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-40 rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
      </div>
      <div className="space-y-4">
        <div className="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
      </div>
    </div>
  );
}
