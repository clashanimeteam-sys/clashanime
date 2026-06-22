import { sendWelcomeEmail } from "@/lib/email/welcomeEmail";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { Locale } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

const WELCOME_LOCALE: Locale = "en";

function isNewSignupUser(createdAt: string | undefined): boolean {
  if (!createdAt) return false;
  const createdMs = new Date(createdAt).getTime();
  if (Number.isNaN(createdMs)) return false;
  return Date.now() - createdMs < 15 * 60 * 1000;
}

async function reserveAndSend(
  supabase: SupabaseClient,
  input: {
    userId: string;
    email: string;
    allowSendWithoutReserve?: boolean;
    createdAt?: string;
  },
): Promise<{ sent: boolean; skipped?: string; error?: string; emailId?: string }> {
  const { data: dispatchId, error: reserveError } = await supabase.rpc(
    "reserve_transactional_email",
    {
      p_user_id: input.userId,
      p_email_to: input.email,
      p_email_type: "welcome",
      p_locale: WELCOME_LOCALE,
    },
  );

  if (reserveError) {
    if (input.allowSendWithoutReserve && isNewSignupUser(input.createdAt)) {
      const result = await sendWelcomeEmail({ to: input.email });
      if (!result.ok) {
        return { sent: false, error: `${reserveError.message}; ${result.error}` };
      }
      return { sent: true, emailId: result.id };
    }
    return { sent: false, error: reserveError.message };
  }

  if (!dispatchId) {
    return { sent: false, skipped: "already_sent" };
  }

  const result = await sendWelcomeEmail({ to: input.email });

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

export async function sendWelcomeEmailIfNew(input: {
  userId: string;
  email: string | null | undefined;
  locale?: string | null;
  supabaseClient?: SupabaseClient | null;
  createdAt?: string;
}): Promise<{ sent: boolean; skipped?: string; error?: string; emailId?: string }> {
  const email = input.email?.trim().toLowerCase();
  if (!email) {
    return { sent: false, skipped: "no_email" };
  }

  const serviceRole = createServiceRoleClient();
  const sessionClient = input.supabaseClient ?? null;

  if (serviceRole) {
    const result = await reserveAndSend(serviceRole, {
      userId: input.userId,
      email,
      createdAt: input.createdAt,
    });
    if (result.sent || result.skipped === "already_sent" || !result.error) {
      return result;
    }
  }

  if (sessionClient) {
    return reserveAndSend(sessionClient, {
      userId: input.userId,
      email,
      allowSendWithoutReserve: true,
      createdAt: input.createdAt,
    });
  }

  if (isNewSignupUser(input.createdAt)) {
    const result = await sendWelcomeEmail({ to: email });
    if (!result.ok) {
      return { sent: false, error: result.error };
    }
    return { sent: true, emailId: result.id };
  }

  return {
    sent: false,
    error: serviceRole
      ? "Could not reserve welcome email dispatch"
      : "Supabase client not available for welcome email",
  };
}
