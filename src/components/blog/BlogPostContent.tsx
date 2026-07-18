"use client";

import Link from "next/link";
import { BlogAds } from "@/components/ads/BlogAds";
import { BlogPageShell } from "@/components/blog/BlogPageShell";
import type { BlogCategory, BlogPostSection } from "@/lib/blog/types";
import { getAllBlogPosts, getBlogPostCopy } from "@/lib/blog/posts";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type BlogPostContentProps = {
  slug: string;
  category: BlogCategory;
  publishedAt: string;
  readingMinutes: number;
};

function SectionBody({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-300">
      {body.split("\n").map((line, lineIndex) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("•")) {
          return (
            <p key={`${heading}-${lineIndex}`} className="ms-1 ps-3">
              {line}
            </p>
          );
        }
        if (!trimmed) return <br key={`${heading}-${lineIndex}`} />;
        return <p key={`${heading}-${lineIndex}`}>{line}</p>;
      })}
    </div>
  );
}

function Roadmap({ steps }: { steps: NonNullable<BlogPostSection["roadmap"]> }) {
  return (
    <ol className="relative mt-5 space-y-0 border-s-2 border-orange-500/35 ms-3 ps-6">
      {steps.map((step, index) => (
        <li key={`${step.label}-${step.title}`} className="relative pb-6 last:pb-0">
          <span
            className="absolute -start-[1.9rem] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-[11px] font-black text-white shadow-md shadow-orange-900/40 ring-2 ring-zinc-950"
            aria-hidden
          >
            {index + 1}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-300/90">
            {step.label}
          </p>
          <p className="mt-1 text-sm font-semibold text-white">{step.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-400">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}

const HERO_TIP_LABEL = {
  ar: "💡 نصيحة البطل",
  en: "💡 Hero tip",
  ja: "💡 ヒーローのヒント",
} as const;

function HeroTip({ tip, label }: { tip: string; label: string }) {
  return (
    <aside className="mt-5 rounded-xl border border-amber-500/35 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-4 shadow-[inset_0_1px_0_rgba(251,191,36,0.12)]">
      <p className="text-[11px] font-bold tracking-wide text-amber-300">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-amber-50/95">{tip}</p>
    </aside>
  );
}

function BlogSection({
  section,
  tipLabel,
}: {
  section: BlogPostSection;
  tipLabel: string;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white sm:text-xl">{section.heading}</h2>
      {section.hype ? (
        <p className="mt-3 rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2 text-sm font-medium leading-relaxed text-orange-100/90">
          {section.hype}
        </p>
      ) : null}
      {section.body ? <SectionBody heading={section.heading} body={section.body} /> : null}
      {section.roadmap?.length ? <Roadmap steps={section.roadmap} /> : null}
      {section.tip ? <HeroTip tip={section.tip} label={tipLabel} /> : null}
    </section>
  );
}

export function BlogPostContent({ slug, category, publishedAt, readingMinutes }: BlogPostContentProps) {
  const { t, locale, formatDateTime } = useLocale();
  const copy = getBlogPostCopy(slug, locale);

  usePageTitle(copy?.title ?? t.blog.hubTitle);

  if (!copy) {
    return (
      <BlogPageShell heroCompact articleTitle={t.blog.notFound}>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-zinc-400">{t.blog.notFound}</div>
      </BlogPageShell>
    );
  }

  const related = getAllBlogPosts()
    .filter((post) => post.slug !== slug && post.category === category)
    .slice(0, 3);

  return (
    <BlogPageShell heroCompact articleTitle={copy.title}>
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-orange-300"
        >
          <span aria-hidden>←</span>
          {t.blog.backToGuide}
        </Link>

        <span className="mt-6 inline-flex rounded-full bg-orange-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-200 ring-1 ring-orange-500/25">
          {t.blog.categories[category]}
        </span>

        <p className="mt-4 text-sm text-zinc-500">
          {t.blog.published}{" "}
          {formatDateTime(publishedAt, { dateStyle: "long" })}
          {" · "}
          {t.blog.minRead.replace("{minutes}", String(readingMinutes))}
        </p>

        <p className="mt-6 rounded-2xl border border-zinc-700/80 bg-zinc-900/90 p-4 text-sm leading-relaxed text-zinc-300">
          {copy.excerpt}
        </p>

        <div className="mt-8 space-y-8">
          {copy.sections.map((section, index) => (
            <div key={`${section.heading}-${index}`}>
              <BlogSection
                section={section}
                tipLabel={HERO_TIP_LABEL[locale] ?? HERO_TIP_LABEL.en}
              />
              {index === 0 ? <BlogAds variant="mid" /> : null}
            </div>
          ))}
        </div>

        {related.length > 0 ? (
          <aside className="mt-12 border-t border-zinc-800 pt-8">
            <h2 className="text-base font-semibold text-white">{t.blog.relatedArticles}</h2>
            <ul className="mt-4 space-y-3">
              {related.map((post) => {
                const relatedCopy = getBlogPostCopy(post.slug, locale);
                if (!relatedCopy) return null;
                return (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-orange-300 transition hover:text-orange-200 hover:underline"
                    >
                      {relatedCopy.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/tracker"
            className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-900/30"
          >
            {t.nav.animeTracker}
          </Link>
          <Link
            href="/upload"
            className="rounded-full border border-zinc-600 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
          >
            {t.upload.title}
          </Link>
        </div>
      </article>
    </BlogPageShell>
  );
}
