"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { PageBackLink } from "@/components/PageBackLink";
import { BrandLogo } from "@/components/BrandLogo";
import { getAboutCopy } from "@/lib/aboutCopy";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

function FieldLabel({
  label,
  required,
  requiredText,
  optionalText,
}: {
  label: string;
  required?: boolean;
  requiredText: string;
  optionalText: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{label}</label>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
        {required ? requiredText : optionalText}
      </span>
    </div>
  );
}

function HelpIcon({ type }: { type: "globe" | "coins" | "shield" }) {
  const className =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand dark:bg-brand/20";

  if (type === "globe") {
    return (
      <span className={className} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </span>
    );
  }

  if (type === "coins") {
    return (
      <span className={className} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <circle cx="8" cy="8" r="6" />
          <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
        </svg>
      </span>
    );
  }

  return (
    <span className={className} aria-hidden>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    </span>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactPageContent() {
  const { t, locale } = useLocale();
  usePageTitle(t.contact.pageTitle);
  const { user } = useAuth();
  const teamCopy = getAboutCopy(locale);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccess(null);
    setError(null);

    if (!EMAIL_RE.test(email.trim())) {
      setError(t.contact.emailInvalid);
      return;
    }

    if (message.trim().length < 10) {
      setError(t.contact.messageTooShort);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          message: message.trim(),
          whatsapp: whatsapp.trim() || null,
          locale,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error || t.contact.failed);
        return;
      }

      setSuccess(t.contact.success);
      setMessage("");
      if (!user?.email) {
        setEmail("");
      }
      setWhatsapp("");
    } catch {
      setError(t.contact.failed);
    } finally {
      setSubmitting(false);
    }
  }

  const helpItems = [
    { icon: "globe" as const, text: t.contact.helpGlobal },
    { icon: "coins" as const, text: t.contact.helpWallet },
    { icon: "shield" as const, text: t.contact.helpAccount },
  ];

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand/8 via-orange-500/5 to-transparent dark:from-brand/15"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <PageBackLink href="/" label={t.common.backToHome} className="mb-6" />
        <div className="max-w-2xl">
          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t.contact.pageSubtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-950/80">
            <h2 className="text-xl font-semibold text-black dark:text-white">{t.contact.formTitle}</h2>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <FieldLabel
                  label={t.contact.emailLabel}
                  required
                  requiredText={t.contact.required}
                  optionalText={t.contact.optional}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t.contact.emailPlaceholder}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-brand dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <FieldLabel
                  label={t.contact.messageLabel}
                  required
                  requiredText={t.contact.required}
                  optionalText={t.contact.optional}
                />
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-black outline-none transition-colors focus:border-brand dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <FieldLabel
                  label={t.contact.whatsappLabel}
                  requiredText={t.contact.required}
                  optionalText={t.contact.optional}
                />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                  placeholder={t.contact.whatsappPlaceholder}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-brand dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand via-red-600 to-orange-500 px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60 sm:w-auto"
              >
                {submitting ? t.contact.submitting : t.contact.submit}
              </button>

              {success ? <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p> : null}
              {error ? (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {error}
                </p>
              ) : null}
            </form>

            <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-black dark:text-white">{t.contact.helpTitle}</h3>
              <ul className="mt-4 space-y-3">
                {helpItems.map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    <HelpIcon type={item.icon} />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
            <div className="bg-gradient-to-br from-brand via-red-600 to-orange-500 px-6 py-10 text-center text-white">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/10">
                <BrandLogo className="h-12 w-12" />
              </div>
              <div className="mx-auto mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <div className="px-6 py-6 text-center">
              <h3 className="text-lg font-bold text-black dark:text-white">{t.contact.supportCardTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.contact.supportCardDesc}
              </p>
              <p className="mt-4 text-sm font-medium text-brand">support@clashanime.com</p>
              <p className="mt-3 text-xs text-zinc-500">{t.contact.responseTime}</p>
            </div>
          </aside>
        </div>

        <section className="mt-14 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-black dark:text-white">{teamCopy.teamHeading}</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.85] text-zinc-700 dark:text-zinc-300">
              {teamCopy.teamIntro}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {teamCopy.teamRoles.map((role) => (
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
            <p className="text-sm text-zinc-500">{teamCopy.teamContactLabel}</p>
            <a
              href={`mailto:${teamCopy.teamContactEmail}`}
              className="text-sm font-medium text-brand transition-colors hover:text-orange-500"
            >
              {teamCopy.teamContactEmail}
            </a>
            <Link href="/about" className="mt-2 text-xs text-zinc-500 underline-offset-2 hover:underline">
              {t.footer.about}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
