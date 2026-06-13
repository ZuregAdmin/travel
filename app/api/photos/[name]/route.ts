import path from "path";
import { getPhoto } from "@/lib/s3";

// Allowed image extensions — also guards against odd keys / path traversal.
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ name: string }> }
) {
  const { name } = await ctx.params;
  const key = path.basename(name); // flatten any path segments
  if (!ALLOWED.has(path.extname(key).toLowerCase())) {
    return new Response("Not found", { status: 404 });
  }

  const photo = await getPhoto(key);
  if (!photo) return new Response("Not found", { status: 404 });

  return new Response(photo.body, {
    headers: {
      "Content-Type": photo.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
