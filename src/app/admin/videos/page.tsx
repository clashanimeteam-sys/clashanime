"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminVideosPanel } from "@/components/admin/AdminVideosPanel";
import { useLocale } from "@/providers/LocaleProvider";

function AdminVideosPageContent() {
  const searchParams = useSearchParams();
  return <AdminVideosPanel initialStatus={searchParams.get("status") ?? "all"} />;
}

export default function AdminVideosPage() {
  const { t } = useLocale();

  return (
    <Suspense fallback={<p className="text-sm text-zinc-400">{t.admin.loading}</p>}>
      <AdminVideosPageContent />
    </Suspense>
  );
}
