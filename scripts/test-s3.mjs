// Health-checks S3 access with the AWS credentials in .env, mirroring lib/s3.ts
// (same region/bucket defaults and the operations photos use: Put/Get/Delete).
//
//   node --env-file=.env scripts/test-s3.mjs
//
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION ?? "us-east-2";
const BUCKET = process.env.S3_BUCKET ?? "tripscale-photo-blog";
const id = process.env.AWS_ACCESS_KEY_ID ?? "";

if (!id || id === "your-access-key-id") {
  console.error("AWS_ACCESS_KEY_ID is still the placeholder — set a real key in .env.");
  process.exit(1);
}
console.log(`key ${id.slice(0, 4)}…${id.slice(-4)} | region ${REGION} | bucket ${BUCKET}`);

const s3 = new S3Client({ region: REGION });
const key = `healthcheck-${Date.now()}.png`;

try {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET, Key: key, Body: Buffer.from("tripscale-s3-healthcheck"), ContentType: "text/plain",
  }));
  console.log("PUT    ✅", key);

  const got = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  console.log(got.Body ? "GET    ✅ fetched" : "GET    ❌ object missing");

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  console.log("DELETE ✅ cleaned up");

  console.log("\nS3 access works — photo upload/serve will work. ✅");
} catch (e) {
  console.error(`\nS3 FAILED: ${e.name ?? ""} — ${e.message ?? e}`);
  if (e.name === "AccessDenied") {
    console.error("→ Credentials are valid but lack S3 permission on the bucket. Attach s3:PutObject/GetObject/DeleteObject for arn:aws:s3:::" + BUCKET + "/*");
  } else if (e.name === "InvalidAccessKeyId" || e.name === "SignatureDoesNotMatch") {
    console.error("→ The access key id/secret is wrong. Re-create the key pair in IAM.");
  }
  process.exit(1);
}
