"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type ReportRow = {
  id: string;
  video_id: string;
  reporter_id: string | null;
  reason: string;
  details: string | null;
  status: "open" | "resolved" | "dismissed";
  admin_notes: string | null;
  created_at: string;
  video_title?: string;
  reporter_username?: string | null;
};

export function AdminReportsPanel() {
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"open" | "resolved" | "dismissed" | "all">(
    "open",
  );

  const loadReports = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    let query = supabase
      .from("content_reports")
      .select("id, video_id, reporter_id, reason, details, status, admin_notes, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const rows = data ?? [];
    const videoIds = [...new Set(rows.map((row) => row.video_id))];
    const reporterIds = [
      ...new Set(rows.map((row) => row.reporter_id).filter(Boolean)),
    ] as string[];

    const [{ data: videos }, { data: reporters }] = await Promise.all([
      videoIds.length
        ? supabase.from("videos").select("id, title").in("id", videoIds)
        : Promise.resolve({ data: [] }),
      reporterIds.length
        ? supabase.from("profiles").select("id, username").in("id", reporterIds)
        : Promise.resolve({ data: [] }),
    ]);

    const videoMap = new Map((videos ?? []).map((video) => [video.id, video.title]));
    const reporterMap = new Map((reporters ?? []).map((profile) => [profile.id, profile.username]));

    setReports(
      rows.map((row) => ({
        ...row,
        video_title: videoMap.get(row.video_id) ?? t.admin.unknownVideo,
        reporter_username: row.reporter_id ? (reporterMap.get(row.reporter_id) ?? null) : null,
      })),
    );
    setLoading(false);
  }, [supabase, statusFilter, t.admin.unknownVideo]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  async function updateReportStatus(
    reportId: string,
    status: ReportRow["status"],
    adminNotes?: string,
  ) {
    if (!supabase) return;

    setMessage(null);
    setError(null);

    const { data: authData } = await supabase.auth.getUser();

    const { error: updateError } = await supabase
      .from("content_reports")
      .update({
        status,
        admin_notes: adminNotes ?? null,
        handled_by: authData.user?.id ?? null,
        handled_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(t.admin.saved);
    await loadReports();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.reportsTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.reportsSubtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["open", "resolved", "dismissed", "all"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === status
                ? "bg-accent text-white"
                : "border border-zinc-700 text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {status === "all" ? t.admin.allStatuses : t.admin.reportStatus[status]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <article key={report.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {report.video_title}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {t.admin.reportReason}: {report.reason}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {t.admin.reportedBy}: @{report.reporter_username ?? t.admin.anonymous} ·{" "}
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                  {report.details ? (
                    <p className="mt-2 text-sm text-zinc-300">{report.details}</p>
                  ) : null}
                </div>
                <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] font-semibold uppercase text-zinc-300">
                  {t.admin.reportStatus[report.status]}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/video/${report.video_id}`}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500"
                >
                  {t.admin.preview}
                </Link>
                <Link
                  href={`/admin/videos?status=review`}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500"
                >
                  {t.admin.openModeration}
                </Link>
                <button
                  type="button"
                  onClick={() => updateReportStatus(report.id, "resolved")}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  {t.admin.resolve}
                </button>
                <button
                  type="button"
                  onClick={() => updateReportStatus(report.id, "dismissed")}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500"
                >
                  {t.admin.dismiss}
                </button>
              </div>
            </article>
          ))}

          {reports.length === 0 && (
            <p className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
              {t.admin.noReports}
            </p>
          )}
        </div>
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
