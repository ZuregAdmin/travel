import { readFileSync } from "fs";
import { Pool, type PoolConfig } from "pg";
import { Signer } from "@aws-sdk/rds-signer";

// Trip metadata lives in Postgres. Two connection modes are supported:
//
//   1. DATABASE_URL set  -> connect with that connection string (e.g. Supabase).
//   2. otherwise         -> Amazon RDS (Aurora) with IAM database auth, where a
//                           short-lived token is minted per connection from the
//                           AWS credential chain (no stored password).
//
// This lets us switch providers by changing env alone.

const DATABASE_URL = process.env.DATABASE_URL;

const HOST = process.env.RDS_HOST ?? "";
const PORT = Number(process.env.RDS_PORT ?? "5432");
const DATABASE = process.env.RDS_DATABASE ?? "postgres";
const USER = process.env.RDS_USER ?? "postgres";
const REGION = process.env.RDS_REGION ?? process.env.AWS_REGION ?? "us-east-2";
// Optional path to a CA bundle for full certificate verification. When unset we
// still require TLS but skip chain verification.
const CA_PATH = process.env.RDS_CA_PATH;

function ssl(): PoolConfig["ssl"] {
  if (CA_PATH) {
    return { ca: readFileSync(CA_PATH, "utf8"), rejectUnauthorized: true };
  }
  return { rejectUnauthorized: false };
}

function createPool(): Pool {
  if (DATABASE_URL) {
    return new Pool({ connectionString: DATABASE_URL, ssl: ssl(), max: 5 });
  }
  if (!HOST) {
    throw new Error(
      "No database configured — set DATABASE_URL or RDS_HOST."
    );
  }
  const signer = new Signer({
    hostname: HOST,
    port: PORT,
    username: USER,
    region: REGION,
  });
  return new Pool({
    host: HOST,
    port: PORT,
    database: DATABASE,
    user: USER,
    // pg calls this for every new connection, giving us a fresh IAM token.
    password: () => signer.getAuthToken(),
    ssl: ssl(),
    max: 5,
    idleTimeoutMillis: 30_000,
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
