"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthProviderButtons } from "@/components/AuthProviderButtons";
import { AuthShellHeader } from "@/components/AuthShellHeader";
import { EmailAuthForm } from "@/components/EmailAuthForm";
import { useLocale } from "@/providers/LocaleProvider";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const { t } = useLocale();
  const isLogin = mode === "login";
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <AuthShellHeader mode={mode} />
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-sm">
          <Link
            href="/"
            aria-label={t.auth.close}
            className="absolute -top-2 left-0 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white sm:-left-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
              <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Link>

          <h1 className="text-center text-3xl font-semibold tracking-tight text-black dark:text-white">
            {isLogin ? t.auth.loginTitle : t.auth.signupTitle}
          </h1>

          <EmailAuthForm
            mode={mode}
            onError={setError}
            onSuccess={(message) => {
              setError(null);
              setSuccess(message);
            }}
          />

          <div className="my-6 border-t border-zinc-200 dark:border-zinc-800" />

          <AuthProviderButtons mode={mode} onError={setError} />

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

          <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
            <Link href={isLogin ? "/signup" : "/login"} className="font-medium text-black hover:underline dark:text-white">
              {isLogin ? t.auth.signUp : t.auth.logIn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
