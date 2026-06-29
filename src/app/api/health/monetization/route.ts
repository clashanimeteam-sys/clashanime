import { NextResponse } from "next/server";
import { getAdSenseClientId, getAdSenseSlotId, isAdSenseEnabled } from "@/lib/adsense";
import { isAdblockGuardEnabled } from "@/lib/adblockGuard";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    adsense: {
      configured: isAdSenseEnabled(),
      clientIdSet: Boolean(getAdSenseClientId()),
      slotSet: Boolean(getAdSenseSlotId()),
    },
    adblockGuard: {
      enabled: isAdblockGuardEnabled(),
      envOverride: process.env.NEXT_PUBLIC_ADBLOCK_GUARD ?? "default",
    },
    relatedHealth: ["/api/health/schema"],
  });
}
