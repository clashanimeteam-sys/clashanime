export const SIGNUP_COUNTRY_COOKIE = "signup_country";

export function setSignupCountryCookie(countryCode: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${SIGNUP_COUNTRY_COOKIE}=${encodeURIComponent(countryCode)}; path=/; max-age=3600; SameSite=Lax`;
}

export function clearSignupCountryCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SIGNUP_COUNTRY_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
