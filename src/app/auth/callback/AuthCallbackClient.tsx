"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;

    const client = supabase;
    const next = searchParams.get("next") ?? "/";
    const code = searchParams.get("code");

    async function finishAuth() {
      if (code) {
        const { error: exchangeError } =
          await client.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          setPending(false);
          return;
        }
      } else {
        const { data, error: sessionError } = await client.auth.getSession();
        if (sessionError || !data.session) {
          setError(t.auth.callbackError);
          setPending(false);
          return;
        }
      }

      router.replace(next);
    }

    finishAuth();
  }, [router, searchParams, supabase, t.auth.callbackError]);

  if (!supabase) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white px-4 dark:bg-black">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {t.auth.configError}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white px-4 dark:bg-black">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {error ?? (pending ? t.auth.signingIn : t.auth.callbackError)}
      </p>
    </div>
  );
}
