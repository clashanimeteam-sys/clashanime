"use client";

import { FormEvent, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type EmailAuthFormProps = {
  mode: "login" | "signup";
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

export function EmailAuthForm({ mode, onError, onSuccess }: EmailAuthFormProps) {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onError("");
    onSuccess("");

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      onError(t.auth.invalidEmail);
      return;
    }

    const supabase = createBrowserClient();
    if (!supabase) {
      onError(t.auth.configError);
      return;
    }

    setLoading(true);

    const redirectTo = `${window.location.origin}/auth/callback?next=/`;
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: mode === "signup",
      },
    });

    setLoading(false);

    if (error) {
      onError(error.message);
      return;
    }

    onSuccess(t.auth.emailSent);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-3">
      <input
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        placeholder={t.auth.emailPlaceholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={loading}
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-black dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {loading ? t.auth.loading : t.auth.continueEmail}
      </button>
    </form>
  );
}
