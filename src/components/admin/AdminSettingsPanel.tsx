"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { canAccessAdminSettings } from "@/lib/admin";
import { createBrowserClient } from "@/lib/supabase/client";
import { fetchSiteSettings, saveSiteSettings } from "@/lib/siteSettings";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

export function AdminSettingsPanel() {
  const { user, profile } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [siteName, setSiteName] = useState("ClashAnime");
  const [siteTagline, setSiteTagline] = useState("Duel System");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowUploads, setAllowUploads] = useState(true);
  const [allowSignups, setAllowSignups] = useState(true);
  const [autoApproveEnabled, setAutoApproveEnabled] = useState(true);
  const [reviewNewCreators, setReviewNewCreators] = useState(true);
  const [rejectSuspiciousUploads, setRejectSuspiciousUploads] = useState(true);

  const canManage = canAccessAdminSettings(profile);

  useEffect(() => {
    if (!supabase || !canManage) {
      setLoading(false);
      return;
    }

    fetchSiteSettings(supabase).then((settings) => {
      setSiteName(settings.general.site_name);
      setSiteTagline(settings.general.site_tagline);
      setMaintenanceMode(settings.general.maintenance_mode);
      setAllowUploads(settings.general.allow_uploads);
      setAllowSignups(settings.general.allow_signups);
      setAutoApproveEnabled(settings.moderation.auto_approve_enabled);
      setReviewNewCreators(settings.moderation.review_new_creators);
      setRejectSuspiciousUploads(settings.moderation.reject_suspicious_uploads);
      setLoading(false);
    });
  }, [supabase, canManage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !user || !canManage) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    const ok = await saveSiteSettings(
      supabase,
      user.id,
      {
        site_name: siteName.trim() || "ClashAnime",
        site_tagline: siteTagline.trim(),
        maintenance_mode: maintenanceMode,
        allow_uploads: allowUploads,
        allow_signups: allowSignups,
      },
      {
        auto_approve_enabled: autoApproveEnabled,
        review_new_creators: reviewNewCreators,
        reject_suspicious_uploads: rejectSuspiciousUploads,
      },
    );

    setSaving(false);

    if (!ok) {
      setError(t.admin.saveFailed);
      return;
    }

    setMessage(t.admin.saved);
  }

  if (!canManage) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-sm text-zinc-400">
        {t.admin.adminOnly}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.settingsTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.settingsSubtitle}</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="text-lg font-semibold text-white">{t.admin.generalSettings}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm text-zinc-300">{t.admin.siteName}</span>
                <input
                  value={siteName}
                  onChange={(event) => setSiteName(event.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm text-zinc-300">{t.admin.siteTagline}</span>
                <input
                  value={siteTagline}
                  onChange={(event) => setSiteTagline(event.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
                />
              </label>
              <Toggle
                label={t.admin.maintenanceMode}
                description={t.admin.maintenanceModeDesc}
                checked={maintenanceMode}
                onChange={setMaintenanceMode}
              />
              <Toggle
                label={t.admin.allowUploads}
                description={t.admin.allowUploadsDesc}
                checked={allowUploads}
                onChange={setAllowUploads}
              />
              <Toggle
                label={t.admin.allowSignups}
                description={t.admin.allowSignupsDesc}
                checked={allowSignups}
                onChange={setAllowSignups}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="text-lg font-semibold text-white">{t.admin.moderationSettings}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Toggle
                label={t.admin.autoApproveEnabled}
                description={t.admin.autoApproveEnabledDesc}
                checked={autoApproveEnabled}
                onChange={setAutoApproveEnabled}
              />
              <Toggle
                label={t.admin.reviewNewCreators}
                description={t.admin.reviewNewCreatorsDesc}
                checked={reviewNewCreators}
                onChange={setReviewNewCreators}
              />
              <Toggle
                label={t.admin.rejectSuspiciousUploads}
                description={t.admin.rejectSuspiciousUploadsDesc}
                checked={rejectSuspiciousUploads}
                onChange={setRejectSuspiciousUploads}
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? t.admin.saving : t.admin.saveSettings}
          </button>
        </form>
      )}

      {message && <p className="text-sm text-emerald-400">{message}</p>}
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-black p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-accent"
      />
      <span>
        <span className="block text-sm font-medium text-white">{label}</span>
        <span className="mt-1 block text-xs text-zinc-400">{description}</span>
      </span>
    </label>
  );
}
