"use client";

type LegalDocumentProps = {
  title: string;
  updated: string;
  sections: Array<{ heading: string; body: string }>;
};

export function LegalDocument({ title, updated, sections }: LegalDocumentProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-black dark:text-white">{title}</h1>
      <p className="mt-2 text-xs text-zinc-500">{updated}</p>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-black dark:text-white">{section.heading}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
