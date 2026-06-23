export default function TrackerLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-6 sm:px-6">
      <div className="mb-8 h-8 w-48 rounded-lg bg-zinc-800" />
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="h-32 rounded-2xl bg-zinc-900" />
        <div className="h-32 rounded-2xl bg-zinc-900" />
      </div>
      <div className="space-y-4">
        <div className="h-28 rounded-2xl bg-zinc-900" />
        <div className="h-28 rounded-2xl bg-zinc-900" />
        <div className="h-28 rounded-2xl bg-zinc-900" />
      </div>
    </div>
  );
}
