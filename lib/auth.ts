import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ts_admin";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "changeme";
}

export function adminToken(): string {
  return createHash("sha256")
    .update("tripscale-blog:" + adminPassword())
    .digest("hex");
}

export function passwordMatches(candidate: string): boolean {
  const a = Buffer.from(candidate);
  const b = Buffer.from(adminPassword());
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const expected = adminToken();
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
