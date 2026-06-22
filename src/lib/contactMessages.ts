import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/lib/types";

export type ContactMessageStatus = "open" | "replied" | "closed";

export type SubmitContactMessageInput = {
  email: string;
  message: string;
  whatsapp?: string | null;
  locale: Locale;
};

export async function submitContactMessage(
  supabase: SupabaseClient,
  input: SubmitContactMessageInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const { data, error } = await supabase.rpc("submit_contact_message", {
    p_email: input.email.trim(),
    p_message: input.message.trim(),
    p_whatsapp: input.whatsapp?.trim() || null,
    p_locale: input.locale,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, id: String(data) };
}
