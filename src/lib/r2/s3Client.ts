import { S3Client } from "@aws-sdk/client-s3";
import { getR2Config } from "@/lib/r2/config";

let cachedClient: S3Client | null = null;

export function getR2S3Endpoint(): string | null {
  const config = getR2Config();
  if (!config) return null;

  const override = process.env.R2_S3_ENDPOINT?.trim().replace(/\/$/, "");
  if (override) return override;

  return `https://${config.accountId}.r2.cloudflarestorage.com`;
}

export function getR2S3Client(): S3Client | null {
  const config = getR2Config();
  const endpoint = getR2S3Endpoint();
  if (!config || !endpoint) return null;

  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      // R2 rejects default AWS SDK checksum headers on presigned browser PUTs.
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
  }

  return cachedClient;
}

export function resetR2S3ClientForTests() {
  cachedClient = null;
}
