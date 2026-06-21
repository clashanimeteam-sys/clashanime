import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getR2Config } from "@/lib/r2/config";
import { getR2S3Client } from "@/lib/r2/s3Client";

export async function deleteR2Objects(keys: string[]): Promise<void> {
  const config = getR2Config();
  const client = getR2S3Client();
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
