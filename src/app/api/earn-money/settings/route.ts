import { NextResponse } from "next/server";
import { loadEarnMoneySettings } from "@/lib/earnMoney/settings.server";
import { earnMoneyRewardCents } from "@/lib/earnMoney/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await loadEarnMoneySettings();
  return NextResponse.json({
    settings,
    rewardCents: earnMoneyRewardCents(settings),
  });
}
