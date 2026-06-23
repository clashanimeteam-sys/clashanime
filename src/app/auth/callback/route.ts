import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sendWelcomeEmailIfNew } from "@/lib/auth/sendWelcomeEmailIfNew";
import { getKycCountryByCode, getKycCountryLabel } from "@/lib/kycCountries";
import { REFERRAL_COOKIE } from "@/lib/points";
import { SIGNUP_COUNTRY_COOKIE } from "@/lib/signupCountry";
import { createServerClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/types";

const LOCALES = new Set<Locale>(["en", "ar", "ja"]);

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/profile";
  const localeParam = searchParams.get("locale");
  const locale = LOCALES.has(localeParam as Locale) ? (localeParam as Locale) : "en";

  if (!next.startsWith("/") || next.startsWith("//")) {
    next = "/";
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=callback`);
  }

  const supabase = await createServerClient();

  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?error=config`);
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  const cookieStore = await cookies();
  const referrerUsername = cookieStore.get(REFERRAL_COOKIE)?.value;

  if (data.user?.id && referrerUsername) {
    await supabase.rpc("complete_referral_signup", {
      new_user_id: data.user.id,
      referrer_username: referrerUsername,
    });
  }

  if (data.user?.id) {
    const welcomeResult = await sendWelcomeEmailIfNew({
      userId: data.user.id,
      email: data.user.email,
      locale,
      supabaseClient: supabase,
      createdAt: data.user.created_at,
    });

    if (!welcomeResult.sent && welcomeResult.error) {
      console.error("[welcome-email]", welcomeResult.error);
    }

    const signupCountryCode = cookieStore.get(SIGNUP_COUNTRY_COOKIE)?.value;
    if (signupCountryCode) {
      const country = getKycCountryByCode(signupCountryCode);
      if (country) {
        await supabase.rpc("set_profile_country", {
          p_country_code: country.code,
          p_country_name: getKycCountryLabel(country, locale),
        });
      }
    }
  }

  const response = NextResponse.redirect(`${origin}${next}`);

  if (referrerUsername) {
    response.cookies.delete(REFERRAL_COOKIE);
  }

  if (cookieStore.get(SIGNUP_COUNTRY_COOKIE)?.value) {
    response.cookies.delete(SIGNUP_COUNTRY_COOKIE);
  }

  return response;
}
