import { promises as fs } from "fs";
import path from "path";
import { UPLOADS_DIR } from "@/lib/store";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ name: string }> }
) {
  const { name } = await ctx.params;
  const safe = path.basename(name);
  const type = MIME[path.extname(safe).toLowerCase()];
  if (!type) return new Response("Not found", { status: 404 });

  try {
    const buf = await fs.readFile(path.join(UPLOADS_DIR, safe));
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
