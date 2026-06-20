"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type DashboardStats = {
  users: number;
  videos: number;
  reviewVideos: number;
  openReports: number;
  bannedUsers: number;
};

export function AdminDashboard() {
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;

    async function loadStats() {
      if (!supabase) return;

      const client = supabase;
      const [
        { count: users },
        { count: videos },
        { count: reviewVideos },
        { count: openReports },
        { count: bannedUsers },
      ] = await Promise.all([
        client.from("profiles").select("*", { count: "exact", head: true }),
        client.from("videos").select("*", { count: "exact", head: true }),
        client
          .from("videos")
          .select("*", { count: "exact", head: true })
          .in("moderation_status", ["review", "pending"]),
        client
          .from("content_reports")
          .select("*", { count: "exact", head: true })
          .eq("status", "open"),
        client.from("profiles").select("*", { count: "exact", head: true }).eq("is_banned", true),
      ]);

      setStats({
        users: users ?? 0,
        videos: videos ?? 0,
        reviewVideos: reviewVideos ?? 0,
        openReports: openReports ?? 0,
        bannedUsers: bannedUsers ?? 0,
      });
      setLoading(false);
    }

    loadStats();
  }, [supabase]);

  const cards = [
    { label: t.admin.stats.users, value: stats?.users ?? 0, href: "/admin/users" },
    { label: t.admin.stats.videos, value: stats?.videos ?? 0, href: "/admin/videos" },
    { label: t.admin.stats.reviewQueue, value: stats?.reviewVideos ?? 0, href: "/admin/videos?status=review" },
    { label: t.admin.stats.openReports, value: stats?.openReports ?? 0, href: "/admin/reports" },
    { label: t.admin.stats.bannedUsers, value: stats?.bannedUsers ?? 0, href: "/admin/users?filter=banned" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.dashboardTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.dashboardSubtitle}</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition-colors hover:border-accent/40"
            >
              <p className="text-sm text-zinc-400">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{card.value.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <QuickLink
          title={t.admin.quickActions.reviewVideos}
          description={t.admin.quickActions.reviewVideosDesc}
          href="/admin/videos?status=review"
        />
        <QuickLink
          title={t.admin.quickActions.handleReports}
          description={t.admin.quickActions.handleReportsDesc}
          href="/admin/reports"
        />
        <QuickLink
          title={t.admin.quickActions.manageUsers}
          description={t.admin.quickActions.manageUsersDesc}
          href="/admin/users"
        />
        <QuickLink
          title={t.admin.quickActions.siteSettings}
          description={t.admin.quickActions.siteSettingsDesc}
          href="/admin/settings"
        />
      </div>
    </div>
  );
}

function QuickLink({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-zinc-800 bg-black p-5 transition-colors hover:border-zinc-700"
    >
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </Link>
  );
}
