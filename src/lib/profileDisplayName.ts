export const DISPLAY_NAME_COOLDOWN_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;

export function canChangeProfileDisplayName(
  changedAt: string | null | undefined,
  now = Date.now(),
) {
  if (!changedAt) return true;
  return now - new Date(changedAt).getTime() >= DISPLAY_NAME_COOLDOWN_DAYS * DAY_MS;
}

export function getDisplayNameCooldownRemainingDays(
  changedAt: string | null | undefined,
  now = Date.now(),
) {
  if (!changedAt || canChangeProfileDisplayName(changedAt, now)) return 0;
  const nextChangeAt = new Date(changedAt).getTime() + DISPLAY_NAME_COOLDOWN_DAYS * DAY_MS;
  return Math.max(1, Math.ceil((nextChangeAt - now) / DAY_MS));
}

export function isDisplayNameCooldownError(message: string) {
  return message.includes("DISPLAY_NAME_COOLDOWN");
}
