"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileContent } from "@/components/ProfileContent";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.profile.loading}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <ProfileContent />;
}
