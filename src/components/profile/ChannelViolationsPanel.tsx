"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  countActiveCopyrightStrikes,
  MAX_COPYRIGHT_STRIKES,
  type ChannelViolation,
} from "@/lib/channelViolations";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

function panelBoxClassName(extra = "") {
  return `rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 ${extra}`.trim();
}

function ViolationTypeIcon({ type }: { type: ChannelViolation["violation_type"] }) {
  const className = "h-5 w-5 shrink-0";
  if (type === "copyright") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${className} text-red-500`} aria-hidden>
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${className} text-amber-500`} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

type ChannelViolationsPanelProps = {
  userId: string;
};

export function ChannelViolationsPanel({ userId }: ChannelViolationsPanelProps) {
  const { t, formatDateTime } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [violations, setViolations] = useState<ChannelViolation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadViolations = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);

    const { data } = await supabase
      .from("channel_violations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setViolations((data ?? []) as ChannelViolation[]);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    void loadViolations();
  }, [loadViolations]);

  const activeCopyrightCount = countActiveCopyrightStrikes(violations);
  const copyrightViolations = violations.filter((entry) => entry.violation_type === "copyright");
  const policyViolations = violations.filter((entry) => entry.violation_type !== "copyright");

  return (
    <section id="violations" className="space-y-5">
      <div className={panelBoxClassName()}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-black dark:text-white">
              {t.violations.dashboardTitle}
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {t.violations.dashboardSubtitle}
            </p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-300">
              {t.violations.copyrightStrikesLabel}
            </p>
            <p className="mt-1 text-2xl font-black text-red-700 dark:text-red-200">
              {t.violations.strikeCounter
                .replace("{current}", String(activeCopyrightCount))
                .replace("{max}", String(MAX_COPYRIGHT_STRIKES))}
            </p>
          </div>
        </div>
      </div>

      <div className={panelBoxClassName()}>
        <div className="flex items-center gap-2">
          <ViolationTypeIcon type="copyright" />
          <h3 className="text-base font-semibold text-black dark:text-white">
            {t.violations.copyrightTitle.replace("{count}", String(activeCopyrightCount))}
          </h3>
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.violations.copyrightDesc}</p>

        {loading ? (
          <p className="mt-4 text-sm text-zinc-500">{t.violations.loading}</p>
        ) : copyrightViolations.length === 0 ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">
            {t.violations.noCopyrightStrikes}
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {copyrightViolations.map((violation) => (
              <article
                key={violation.id}
                className="rounded-xl border border-red-200/80 bg-red-50/60 p-4 dark:border-red-900/40 dark:bg-red-950/15"
              >
                <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                  {t.violations.receivedOn.replace(
                    "{date}",
                    formatDateTime(violation.created_at, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }),
                  )}
                </p>
                <p className="mt-2 text-sm font-medium text-black dark:text-white">
                  {violation.claimant_name
                    ? t.violations.removedByClaimant.replace("{name}", violation.claimant_name)
                    : t.violations.contentRemoved}
                </p>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{violation.reason}</p>
                {violation.content_title ? (
                  <p className="mt-2 text-xs text-zinc-500">
                    {t.violations.contentLabel}: {violation.content_title}
                  </p>
                ) : null}
                {violation.expires_at && violation.status === "active" ? (
                  <p className="mt-2 text-xs text-zinc-500">
                    {t.violations.expiresOn.replace(
                      "{date}",
                      formatDateTime(violation.expires_at, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }),
                    )}
                  </p>
                ) : null}
                {violation.content_type === "video" && violation.content_id ? (
                  <p className="mt-2 text-xs text-zinc-500">{t.violations.videoRemovedNote}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}

        <div className="mt-5 rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900/40 dark:bg-sky-950/20">
          <p className="text-sm font-semibold text-sky-900 dark:text-sky-200">
            {t.violations.actionsTitle}
          </p>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-sky-900/90 dark:text-sky-100/90">
            <li>{t.violations.actionWaitExpiry}</li>
            <li>{t.violations.actionContactSupport}</li>
          </ul>
          <Link
            href="/dmca"
            className="mt-3 inline-flex text-sm font-semibold text-sky-700 underline underline-offset-2 dark:text-sky-300"
          >
            {t.violations.learnMoreCopyright}
          </Link>
        </div>
      </div>

      <div className={panelBoxClassName()}>
        <h3 className="text-base font-semibold text-black dark:text-white">
          {t.violations.policyTitle}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t.violations.policyDesc}</p>

        {loading ? null : policyViolations.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">{t.violations.noPolicyViolations}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {policyViolations.map((violation) => (
              <article
                key={violation.id}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="flex items-start gap-2">
                  <ViolationTypeIcon type={violation.violation_type} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-zinc-500">
                      {violation.violation_type === "community"
                        ? t.violations.communityViolation
                        : t.violations.termsViolation}
                      {" · "}
                      {formatDateTime(violation.created_at, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">{violation.reason}</p>
                    {violation.content_title ? (
                      <p className="mt-1 text-xs text-zinc-500">
                        {t.violations.contentLabel}: {violation.content_title}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
