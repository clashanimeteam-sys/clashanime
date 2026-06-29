"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/providers/LocaleProvider";

type MonetizationHealth = {
  adsense: { configured: boolean; clientIdSet: boolean; slotSet: boolean };
  adblockGuard: { enabled: boolean; requiresAdsense: boolean; envOverride: string };
};

export function AdminMonetizationHealth() {
  const { t } = useLocale();
  const [health, setHealth] = useState<MonetizationHealth | null>(null);
  const [schemaOk, setSchemaOk] = useState<boolean | null>(null);

  useEffect(() => {
    void fetch("/api/health/monetization")
      .then((response) => response.json())
      .then((data) => setHealth(data))
      .catch(() => setHealth(null));

    void fetch("/api/health/schema")
      .then((response) => response.json())
      .then((data) => setSchemaOk(Boolean(data.ok)))
      .catch(() => setSchemaOk(null));
  }, []);

  if (!health) return null;

  const rows = [
    {
      label: t.admin.platformHealth.adsense,
      ok: health.adsense.configured,
      detail: health.adsense.configured
        ? t.admin.platformHealth.configured
        : t.admin.platformHealth.missingEnv,
    },
    {
      label: t.admin.platformHealth.adblockGuard,
      ok: !health.adblockGuard.enabled || health.adsense.configured,
      detail: health.adblockGuard.enabled
        ? t.admin.platformHealth.active
        : health.adsense.configured
          ? t.admin.platformHealth.inactive
          : t.admin.platformHealth.offUntilAdsense,
    },
    {
      label: t.admin.platformHealth.databaseSchema,
      ok: schemaOk === true,
      detail:
        schemaOk === null
          ? t.admin.platformHealth.checking
          : schemaOk
            ? t.admin.platformHealth.healthy
            : t.admin.platformHealth.needsMigration,
    },
  ];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{t.admin.platformHealth.title}</h2>
          <p className="mt-1 text-sm text-zinc-400">{t.admin.platformHealth.subtitle}</p>
        </div>
        <div className="flex gap-2 text-xs">
          <Link href="/api/health/monetization" className="text-accent hover:underline" target="_blank">
            {t.admin.platformHealth.monetizationApi}
          </Link>
          <Link href="/api/health/schema" className="text-accent hover:underline" target="_blank">
            {t.admin.platformHealth.schemaApi}
          </Link>
        </div>
      </div>
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-white">{row.label}</p>
              <p className="text-xs text-zinc-500">{row.detail}</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                row.ok ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
              }`}
            >
              {row.ok ? t.admin.platformHealth.ok : t.admin.platformHealth.actionNeeded}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
