"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { getAboutCopy, type AboutIcon } from "@/lib/aboutCopy";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

function AboutIconBadge({ icon }: { icon: AboutIcon }) {
  const className =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/15 to-orange-500/10 text-brand dark:from-brand/25 dark:to-orange-500/15";

  if (icon === "spark") {
    return (
      <span className={className} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" />
        </svg>
      </span>
    );
  }

  if (icon === "code") {
    return (
      <span className={className} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </span>
    );
  }

  if (icon === "globe") {
    return (
      <span className={className} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </span>
    );
  }

  if (icon === "scale") {
    return (
      <span className={className} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
      </span>
    );
  }

  if (icon === "coins") {
    return (
      <span className={className} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <circle cx="8" cy="8" r="6" />
          <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
          <path d="M7 6h1v4" />
          <path d="m16.71 13.88.7.71-2.82 2.82" />
        </svg>
      </span>
    );
  }

  if (icon === "users") {
    return (
      <span className={className} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </span>
    );
  }

  if (icon === "rocket") {
    return (
      <span className={className} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      </span>
    );
  }

  return (
    <span className={className} aria-hidden>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </span>
  );
}

export function AboutPageContent() {
  const { locale } = useLocale();
  const copy = getAboutCopy(locale);
  usePageTitle(copy.title);

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand/8 via-orange-500/5 to-transparent dark:from-brand/15 dark:via-orange-500/8"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col items-center text-center">
          <BrandLogo className="h-16 w-16" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            ClashAnime
          </p>
        </div>

        <p className="mt-8 text-center text-base leading-[1.85] text-zinc-700 sm:text-lg dark:text-zinc-300">
          {copy.intro}
        </p>

        <section className="mt-14">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black dark:text-white">{copy.storyHeading}</h2>
            <p className="mt-2 text-sm font-medium text-brand">{copy.storyTagline}</p>
          </div>

          <div className="mt-8 space-y-5">
            {copy.chapters.map((chapter) => (
              <article
                key={chapter.heading}
                className="rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/60"
              >
                <div className="flex items-start gap-4">
                  <AboutIconBadge icon={chapter.icon} />
                  <div>
                    <h3 className="text-lg font-semibold text-black dark:text-white">{chapter.heading}</h3>
                    <p className="mt-3 text-[15px] leading-[1.85] text-zinc-700 dark:text-zinc-300">
                      {chapter.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-center text-2xl font-bold text-black dark:text-white">{copy.visionHeading}</h2>
          <p className="mt-4 text-center text-[15px] leading-[1.85] text-zinc-700 dark:text-zinc-300">
            {copy.visionIntro}
          </p>

          <div className="mt-8 space-y-4">
            {copy.pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/40"
              >
                <AboutIconBadge icon={pillar.icon} />
                <div>
                  <h3 className="font-semibold text-black dark:text-white">{pillar.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.85] text-zinc-700 dark:text-zinc-300">
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-8">
          <article className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="flex items-start gap-4">
              <AboutIconBadge icon="users" />
              <div>
                <h2 className="text-xl font-bold text-black dark:text-white">{copy.heroesHeading}</h2>
                <p className="mt-3 text-[15px] leading-[1.85] text-zinc-700 dark:text-zinc-300">
                  {copy.heroesBody}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="flex items-start gap-4">
              <AboutIconBadge icon="rocket" />
              <div>
                <h2 className="text-xl font-bold text-black dark:text-white">{copy.futureHeading}</h2>
                <p className="mt-3 text-[15px] leading-[1.85] text-zinc-700 dark:text-zinc-300">
                  {copy.futureBody}
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-14 rounded-2xl bg-gradient-to-br from-brand via-red-600 to-orange-500 p-8 text-center text-white shadow-lg">
          <h2 className="text-xl font-bold sm:text-2xl">{copy.ctaHeading}</h2>
          <p className="mt-3 text-sm text-white/90 sm:text-base">{copy.ctaBody}</p>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-brand transition-transform hover:scale-[1.02]"
          >
            {copy.ctaButton}
          </Link>
        </section>

        <section className="mt-14 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="flex flex-col items-center text-center">
            <AboutIconBadge icon="heart" />
            <h2 className="mt-4 text-2xl font-bold text-black dark:text-white">{copy.teamHeading}</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.85] text-zinc-700 dark:text-zinc-300">
              {copy.teamIntro}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {copy.teamRoles.map((role) => (
              <div
                key={role.title}
                className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5 text-center dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <h3 className="font-semibold text-black dark:text-white">{role.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {role.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-2 border-t border-zinc-200 pt-6 text-center dark:border-zinc-800">
            <p className="text-sm text-zinc-500">{copy.teamContactLabel}</p>
            <a
              href={`mailto:${copy.teamContactEmail}`}
              className="text-sm font-medium text-brand transition-colors hover:text-orange-500"
            >
              {copy.teamContactEmail}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
