import { sendWelcomeEmail } from "@/lib/email/welcomeEmail";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { Locale } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

const SIGNUP_RETRY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function normalizeLocale(locale?: string | null): Locale {
  if (locale === "ar" || locale === "ja") return locale;
  return "en";
}

function isRecentSignup(createdAt: string | undefined): boolean {
  if (!createdAt) return true;
  const createdMs = new Date(createdAt).getTime();
  if (Number.isNaN(createdMs)) return true;
  return Date.now() - createdMs < SIGNUP_RETRY_WINDOW_MS;
}

async function dispatchWelcomeEmail(
  supabase: SupabaseClient,
  input: {
    userId: string;
    email: string;
    locale: Locale;
  },
): Promise<{ sent: boolean; skipped?: string; error?: string; emailId?: string }> {
  const { data: dispatchId, error: reserveError } = await supabase.rpc("reserve_transactional_email", {
    p_user_id: input.userId,
    p_email_to: input.email,
    p_email_type: "welcome",
    p_locale: input.locale,
  });

  if (reserveError) {
    return { sent: false, error: reserveError.message };
  }

  if (!dispatchId) {
    return { sent: false, skipped: "already_sent" };
  }

  const result = await sendWelcomeEmail({ to: input.email, locale: input.locale });

  const { error: completeError } = await supabase.rpc("complete_transactional_email", {
    p_id: dispatchId,
    p_status: result.ok ? "sent" : "failed",
    p_resend_id: result.ok ? result.id : null,
    p_error_message: result.ok ? null : result.error,
    p_subject: result.ok ? result.subject : null,
  });

  if (!result.ok) {
    return {
      sent: false,
      error: completeError ? `${result.error}; ${completeError.message}` : result.error,
    };
  }

  if (completeError) {
    return { sent: true, emailId: result.id, error: completeError.message };
  }

  return { sent: true, emailId: result.id };
}

export async function sendWelcomeEmailIfNew(input: {
  userId: string;
  email: string | null | undefined;
  locale?: string | null;
  supabaseClient?: SupabaseClient | null;
  createdAt?: string;
  force?: boolean;
}): Promise<{ sent: boolean; skipped?: string; error?: string; emailId?: string }> {
  const email = input.email?.trim().toLowerCase();
  if (!email) {
    return { sent: false, skipped: "no_email" };
  }

  const locale = normalizeLocale(input.locale);
  const serviceRole = createServiceRoleClient();
  const sessionClient = input.supabaseClient ?? null;
  const supabase = serviceRole ?? sessionClient;

  if (!supabase) {
    if (isRecentSignup(input.createdAt) || input.force) {
      const result = await sendWelcomeEmail({ to: email, locale });
      if (!result.ok) {
        return { sent: false, error: result.error };
      }
      return { sent: true, emailId: result.id };
    }
    return { sent: false, error: "Supabase client not available for welcome email" };
  }

  if (!input.force && !isRecentSignup(input.createdAt)) {
    const { data: existing } = await supabase
      .from("transactional_emails")
      .select("status")
      .eq("user_id", input.userId)
      .eq("email_type", "welcome")
      .maybeSingle();

    if (existing?.status === "sent") {
      return { sent: false, skipped: "already_sent" };
    }

    if (existing?.status !== "failed" && existing?.status !== "pending") {
      return { sent: false, skipped: "not_new_signup" };
    }
  }

  return dispatchWelcomeEmail(supabase, {
    userId: input.userId,
    email,
    locale,
  });
}

export async function retryTransactionalEmail(input: {
  dispatchId: string;
  email: string;
  emailType: string;
  locale?: string | null;
}): Promise<{ sent: boolean; error?: string; emailId?: string }> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { sent: false, error: "Service role not configured" };
  }

  const locale = normalizeLocale(input.locale);
  const email = input.email.trim().toLowerCase();

  if (input.emailType === "welcome") {
    const { error: pendingError } = await supabase
      .from("transactional_emails")
      .update({
        status: "pending",
        error_message: null,
        resend_id: null,
        subject: null,
        sent_at: null,
      })
      .eq("id", input.dispatchId)
      .neq("status", "sent");

    if (pendingError) {
      return { sent: false, error: pendingError.message };
    }

    const result = await sendWelcomeEmail({ to: email, locale });

    const { error: completeError } = await supabase.rpc("complete_transactional_email", {
      p_id: input.dispatchId,
      p_status: result.ok ? "sent" : "failed",
      p_resend_id: result.ok ? result.id : null,
      p_error_message: result.ok ? null : result.error,
      p_subject: result.ok ? result.subject : null,
    });

    if (!result.ok) {
      return { sent: false, error: completeError ? `${result.error}; ${completeError.message}` : result.error };
    }

    return { sent: true, emailId: result.id };
  }

  return { sent: false, error: `Unsupported email type: ${input.emailType}` };
}
