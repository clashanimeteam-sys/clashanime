import type { Profile } from "@/lib/types";

export const USERNAME_COOLDOWN_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

export function canChangeProfileUsername(changedAt: string | null | undefined, now = Date.now()) {
  if (!changedAt) return true;
  return now - new Date(changedAt).getTime() >= USERNAME_COOLDOWN_DAYS * DAY_MS;
}

export function getUsernameCooldownRemainingDays(
  changedAt: string | null | undefined,
  now = Date.now(),
) {
  if (!changedAt || canChangeProfileUsername(changedAt, now)) return 0;
  const nextChangeAt = new Date(changedAt).getTime() + USERNAME_COOLDOWN_DAYS * DAY_MS;
  return Math.max(1, Math.ceil((nextChangeAt - now) / DAY_MS));
}

export function normalizeUsernameInput(raw: string) {
  return raw.trim().replace(/^@+/, "").toLowerCase().replace(/[^a-z0-9_]/g, "");
}

export function isUsernameTakenError(message: string) {
  return message.includes("USERNAME_TAKEN");
}

export function isUsernameCooldownError(message: string) {
  return message.includes("USERNAME_COOLDOWN");
}

export function isUsernameInvalidError(message: string) {
  return message.includes("USERNAME_INVALID");
}

export function canChangeProfileUsernameForProfile(
  profile: Pick<Profile, "username_changed_at"> | null,
  now = Date.now(),
) {
  return canChangeProfileUsername(profile?.username_changed_at, now);
}

export function getProfileUsernameCooldownRemainingDays(
  profile: Pick<Profile, "username_changed_at"> | null,
  now = Date.now(),
) {
  return getUsernameCooldownRemainingDays(profile?.username_changed_at, now);
}
