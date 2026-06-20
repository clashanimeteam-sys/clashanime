"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AuthProviderButtons } from "@/components/AuthProviderButtons";
import { AuthSettingsBar } from "@/components/AuthSettingsBar";
import { AuthShellHeader } from "@/components/AuthShellHeader";
import { EmailAuthForm } from "@/components/EmailAuthForm";
import { createBrowserClient } from "@/lib/supabase/client";
import { fetchPublicSiteFlags } from "@/lib/siteSettings";
import { useLocale } from "@/providers/LocaleProvider";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const isLogin = mode === "login";
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [signupsAllowed, setSignupsAllowed] = useState(true);

  const nextPath = searchParams.get("next") ?? "/profile";
  const safeNext = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/profile";

  useEffect(() => {
    if (!supabase) return;
    fetchPublicSiteFlags(supabase).then((flags) => setSignupsAllowed(flags.allowSignups));
  }, [supabase]);

  const signupBlocked = !isLogin && !signupsAllowed;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <AuthShellHeader mode={mode} />
      <div className="flex flex-1 items-center justify-center px-4 py-10 pb-24">
        <div className="w-full max-w-sm">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-black dark:text-white">
            {isLogin ? t.auth.loginTitle : t.auth.signupTitle}
          </h1>

          <EmailAuthForm
            mode={mode}
            disabled={signupBlocked}
            redirectNext={safeNext}
            onError={setError}
            onSuccess={(message) => {
              setError(null);
              setSuccess(message);
            }}
          />

          <div className="my-6 border-t border-zinc-200 dark:border-zinc-800" />

          <AuthProviderButtons mode={mode} disabled={signupBlocked} redirectNext={safeNext} onError={setError} />

          {signupBlocked && (
            <p className="mt-4 text-center text-xs text-amber-600 dark:text-amber-400" role="alert">
              {t.auth.signupsDisabled}
            </p>
          )}

          {error && (
            <p className="mt-4 text-center text-xs text-red-500" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-4 text-center text-xs text-emerald-600 dark:text-emerald-400" role="status">
              {success}
            </p>
          )}

          {!isLogin && (
            <p className="mt-6 text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {t.auth.signupLegalBefore}{" "}
              <Link href="/terms" className="font-medium text-black hover:underline dark:text-white">
                {t.footer.terms}
              </Link>
              ,{" "}
              <Link href="/privacy" className="font-medium text-black hover:underline dark:text-white">
                {t.footer.privacy}
              </Link>{" "}
              {t.auth.signupLegalAnd}{" "}
              <Link
                href="/community-guidelines"
                className="font-medium text-black hover:underline dark:text-white"
              >
                {t.footer.communityGuidelines}
              </Link>
              .
            </p>
          )}

          <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
            <Link href={isLogin ? "/signup" : "/login"} className="font-medium text-black hover:underline dark:text-white">
              {isLogin ? t.auth.signUp : t.auth.logIn}
            </Link>
          </p>
        </div>
      </div>
      <AuthSettingsBar />
    </div>
  );
}
