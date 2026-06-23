"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

export function UploadPageGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=%2Fupload");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.upload.loading}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
