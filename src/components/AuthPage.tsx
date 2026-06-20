"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthProviderButtons } from "@/components/AuthProviderButtons";
import { AuthSettingsBar } from "@/components/AuthSettingsBar";
import { AuthShellHeader } from "@/components/AuthShellHeader";
import { EmailAuthForm } from "@/components/EmailAuthForm";
import { useLocale } from "@/providers/LocaleProvider";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const { t } = useLocale();
  const isLogin = mode === "login";
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      <AuthSettingsBar />
    </div>
  );
}
