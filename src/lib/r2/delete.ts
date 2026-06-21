import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getR2Config } from "@/lib/r2/config";

let cachedClient: S3Client | null = null;

function getR2Client(): S3Client | null {
  const config = getR2Config();
  if (!config) return null;

  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: true,
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
  }

  return cachedClient;
}

export async function deleteR2Objects(keys: string[]): Promise<void> {
  const config = getR2Config();
  const client = getR2Client();
  if (!config || !client || keys.length === 0) return;

  await Promise.all(
    keys.map((key) =>
      client.send(
        new DeleteObjectCommand({
          Bucket: config.bucketName,
          Key: key.replace(/^\//, ""),
        }),
      ),
    ),
  );
}
