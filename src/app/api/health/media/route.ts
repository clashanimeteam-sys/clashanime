import { NextResponse } from "next/server";
import { isR2Configured } from "@/lib/r2/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = isR2Configured();

  return NextResponse.json({
    ok: configured,
    r2Configured: configured,
    storageBackend: configured ? "cloudflare-r2" : "supabase-storage-fallback",
    requiredEnv: [
      "R2_ACCOUNT_ID",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET_NAME",
      "R2_PUBLIC_URL",
    ],
    setupGuide: "https://developers.cloudflare.com/r2/",
  });
}
