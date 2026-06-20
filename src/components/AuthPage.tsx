"use client";

import Link from "next/link";
import { AuthShellHeader } from "@/components/AuthShellHeader";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { SiteTitle } from "@/components/SiteTitle";
import { useLocale } from "@/providers/LocaleProvider";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const { t } = useLocale();
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <AuthShellHeader mode={mode} />
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <SiteTitle primary={t.home.titlePrimary} secondary={t.home.titleSecondary} />
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black">
          <h1 className="text-center text-2xl font-semibold text-black dark:text-white">
            {isLogin ? t.auth.loginTitle : t.auth.signupTitle}
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {isLogin ? t.auth.loginSubtitle : t.auth.signupSubtitle}
          </p>

          <div className="mt-6">
            <GoogleAuthButton mode={mode} />
          </div>

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
            <Link
              href={isLogin ? "/signup" : "/login"}
              className="font-medium text-accent hover:underline"
            >
              {isLogin ? t.auth.signUp : t.auth.logIn}
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
