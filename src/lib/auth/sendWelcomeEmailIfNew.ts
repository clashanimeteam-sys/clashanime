import { sendWelcomeEmail } from "@/lib/email/welcomeEmail";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { Locale } from "@/lib/types";

const LOCALES = new Set<Locale>(["en", "ar", "ja"]);

function normalizeLocale(value: string | null | undefined): Locale {
  return LOCALES.has(value as Locale) ? (value as Locale) : "en";
}

export async function sendWelcomeEmailIfNew(input: {
  userId: string;
  email: string | null | undefined;
  locale?: string | null;
}): Promise<{ sent: boolean; skipped?: string; error?: string; emailId?: string }> {
  const email = input.email?.trim().toLowerCase();
  if (!email) {
    return { sent: false, skipped: "no_email" };
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { sent: false, error: "Service role not configured" };
  }

  const locale = normalizeLocale(input.locale);

  const { data: dispatchId, error: reserveError } = await supabase.rpc(
    "reserve_transactional_email",
    {
      p_user_id: input.userId,
      p_email_to: email,
      p_email_type: "welcome",
      p_locale: locale,
    },
  );

  if (reserveError) {
    return { sent: false, error: reserveError.message };
  }

  if (!dispatchId) {
    return { sent: false, skipped: "already_sent" };
  }

  const result = await sendWelcomeEmail({ to: email, locale });

  const { error: completeError } = await supabase.rpc("complete_transactional_email", {
    p_id: dispatchId,
    p_status: result.ok ? "sent" : "failed",
    p_resend_id: result.ok ? result.id : null,
    p_error_message: result.ok ? null : result.error,
    p_subject: result.ok ? result.subject : null,
  });

  if (completeError) {
    return {
      sent: result.ok,
      emailId: result.ok ? result.id : undefined,
      error: completeError.message,
    };
  }

  if (!result.ok) {
    return { sent: false, error: result.error };
  }

  return { sent: true, emailId: result.id };
}
