export const DISPLAY_NAME_COOLDOWN_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;
const STORAGE_PREFIX = "clashanime_display_name_changed_at_";

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function getStoredDisplayNameChangedAt(userId: string | undefined) {
  if (!userId || typeof window === "undefined") return null;
  return localStorage.getItem(storageKey(userId));
}

export function rememberDisplayNameChange(userId: string, changedAt = new Date().toISOString()) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), changedAt);
}

export function getEffectiveDisplayNameChangedAt(
  profile: { id: string; display_name_changed_at?: string | null } | null | undefined,
) {
  if (!profile) return null;

  const stored = getStoredDisplayNameChangedAt(profile.id);
  const fromDb = profile.display_name_changed_at ?? null;

  if (fromDb && stored) {
    return new Date(fromDb).getTime() >= new Date(stored).getTime() ? fromDb : stored;
  }

  return fromDb ?? stored;
}

export function canChangeProfileDisplayName(
  changedAt: string | null | undefined,
  now = Date.now(),
) {
  if (!changedAt) return true;
  return now - new Date(changedAt).getTime() >= DISPLAY_NAME_COOLDOWN_DAYS * DAY_MS;
}

export function canChangeProfileDisplayNameForProfile(
  profile: { id: string; display_name_changed_at?: string | null } | null | undefined,
  now = Date.now(),
) {
  return canChangeProfileDisplayName(getEffectiveDisplayNameChangedAt(profile), now);
}

export function getDisplayNameCooldownRemainingDays(
  changedAt: string | null | undefined,
  now = Date.now(),
) {
  if (!changedAt || canChangeProfileDisplayName(changedAt, now)) return 0;
  const nextChangeAt = new Date(changedAt).getTime() + DISPLAY_NAME_COOLDOWN_DAYS * DAY_MS;
  return Math.max(1, Math.ceil((nextChangeAt - now) / DAY_MS));
}

export function getProfileDisplayNameCooldownRemainingDays(
  profile: { id: string; display_name_changed_at?: string | null } | null | undefined,
  now = Date.now(),
) {
  return getDisplayNameCooldownRemainingDays(getEffectiveDisplayNameChangedAt(profile), now);
}

export function isDisplayNameCooldownError(message: string) {
  return message.includes("DISPLAY_NAME_COOLDOWN");
}
