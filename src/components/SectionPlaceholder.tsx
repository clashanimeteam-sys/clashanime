"use client";

type SectionPlaceholderProps = {
  title: string;
  subtitle: string;
  body: string;
};

export function SectionPlaceholder({ title, subtitle, body }: SectionPlaceholderProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-black dark:text-white">{title}</h1>
      <p className="mt-3 text-sm text-zinc-600 sm:text-base dark:text-zinc-400">{subtitle}</p>
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-8 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        {body}
      </div>
    </div>
  );
}
