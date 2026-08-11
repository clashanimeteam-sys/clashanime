import { SignJWT } from "jose";
import { watchSiteUrl as publicWatchSiteUrl } from "@/lib/watchSiteLinks";

function getSecret() {
  const secret = process.env.WATCH_GATE_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("WATCH_GATE_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export function watchSiteUrl() {
  return publicWatchSiteUrl();
}

export async function createWatchGateToken(userId: string, expiresIn = "24h") {
  return new SignJWT({ src: "clashanime", sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export function buildWatchSiteEntryUrl(token: string, nextPath = "/") {
  const base = watchSiteUrl();
  const safeNext = nextPath.startsWith("/") ? nextPath : "/";
  return `${base}/api/gate/accept?token=${encodeURIComponent(token)}&next=${encodeURIComponent(safeNext)}`;
}
