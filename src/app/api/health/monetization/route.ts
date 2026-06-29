import { NextResponse } from "next/server";
import { getAdSenseClientId, getAdSenseSlotId, isAdSenseEnabled } from "@/lib/adsense";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    adsense: {
      configured: isAdSenseEnabled(),
      clientIdSet: Boolean(getAdSenseClientId()),
      slotSet: Boolean(getAdSenseSlotId()),
    },
    relatedHealth: ["/api/health/schema"],
  });
}
