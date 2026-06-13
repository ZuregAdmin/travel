import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

// Photos live in S3. Region + bucket come from env; credentials are picked up
// from the standard AWS chain (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY).
const REGION = process.env.AWS_REGION ?? "us-east-2";
const BUCKET = process.env.S3_BUCKET ?? "tripscale-photo-blog";

// One client reused across requests.
let client: S3Client | null = null;
function s3(): S3Client {
  if (!client) client = new S3Client({ region: REGION });
  return client;
}

export async function putPhoto(
  key: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  await s3().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

export interface FetchedPhoto {
  body: ReadableStream;
  contentType: string;
}

export async function getPhoto(key: string): Promise<FetchedPhoto | null> {
  try {
    const res = await s3().send(
      new GetObjectCommand({ Bucket: BUCKET, Key: key })
    );
    if (!res.Body) return null;
    return {
      body: res.Body.transformToWebStream(),
      contentType: res.ContentType ?? "application/octet-stream",
    };
  } catch (err) {
    const name = (err as { name?: string }).name;
    // Missing object is an expected 404; anything else is a real failure.
    if (name === "NoSuchKey" || name === "NotFound") return null;
    console.error(
      JSON.stringify({
        level: "error",
        at: "s3.getPhoto",
        key,
        error: name ?? String(err),
      })
    );
    throw err;
  }
}

export async function deletePhoto(key: string): Promise<void> {
  await s3().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
