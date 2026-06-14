import { Pool } from "pg";

// Trip metadata lives in Supabase Postgres. DATABASE_URL must be a server-only
// pooled connection string; never expose it through a NEXT_PUBLIC_ variable.
const DATABASE_URL = process.env.DATABASE_URL;

function createPool(): Pool {
  if (!DATABASE_URL) {
    throw new Error("Supabase is not configured. Set DATABASE_URL.");
  }

  return new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

// Lazily create the Pool on first query — never at import time. This keeps the
// build (which imports these modules to collect page data) from needing a
// database or env vars, and avoids opening a connection during static analysis.
// The instance is reused across requests, and across Next.js dev hot-reloads.
const globalForDb = globalThis as unknown as { __tsPool?: Pool };

export function getPool(): Pool {
  if (globalForDb.__tsPool) return globalForDb.__tsPool;
  const created = createPool();
  if (process.env.NODE_ENV !== "production") globalForDb.__tsPool = created;
  return created;
}
