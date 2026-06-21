import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getR2Config, isR2Configured } from "@/lib/r2/config";
import { getR2S3Client, getR2S3Endpoint } from "@/lib/r2/s3Client";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = isR2Configured();
  let r2Connection: { ok: boolean; error?: string } | null = null;

  if (configured) {
    const client = getR2S3Client();
    const config = getR2Config();
    if (client && config) {
      try {
        await client.send(
          new ListObjectsV2Command({
            Bucket: config.bucketName,
            MaxKeys: 1,
          }),
        );
        r2Connection = { ok: true };
      } catch (error) {
        r2Connection = {
          ok: false,
          error: error instanceof Error ? error.message : "connection failed",
        };
      }
    }
  }

  return NextResponse.json({
    ok: configured,
    r2Configured: configured,
    r2Connection,
    r2Endpoint: configured ? getR2S3Endpoint() : null,
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
