// One-time migration: copy data/trips.json into the RDS `trips` table.
// Idempotent — re-running skips rows that already exist (ON CONFLICT DO NOTHING).
//
//   node scripts/migrate-trips.mjs
//
// Requires the same env as the app (RDS_HOST etc.) and AWS credentials on the
// standard chain for the IAM auth token. Run the schema (db/schema.sql) first.

import { readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { Signer } from "@aws-sdk/rds-signer";

const HOST = process.env.RDS_HOST;
const PORT = Number(process.env.RDS_PORT ?? "5432");
const DATABASE = process.env.RDS_DATABASE ?? "postgres";
const USER = process.env.RDS_USER ?? "postgres";
const REGION = process.env.RDS_REGION ?? process.env.AWS_REGION ?? "us-east-2";

if (!HOST) {
  console.error("RDS_HOST is not set.");
  process.exit(1);
}

const file = path.join(process.cwd(), "data", "trips.json");
let trips;
try {
  trips = JSON.parse(await readFile(file, "utf8"));
} catch (err) {
  if (err.code === "ENOENT") {
    console.log("No data/trips.json — nothing to migrate.");
    process.exit(0);
  }
  throw err;
}

const signer = new Signer({ hostname: HOST, port: PORT, username: USER, region: REGION });
const client = new pg.Client({
  host: HOST,
  port: PORT,
  database: DATABASE,
  user: USER,
  password: await signer.getAuthToken(),
  ssl: { rejectUnauthorized: false },
});

await client.connect();
let inserted = 0;
for (const t of trips) {
  const res = await client.query(
    `INSERT INTO trips
       (id, status, country, city, author, title, story, goals,
        total_spent, photos, created_at, reviewed_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     ON CONFLICT (id) DO NOTHING`,
    [
      t.id, t.status, t.country, t.city, t.author, t.title, t.story, t.goals,
      t.totalSpent, JSON.stringify(t.photos ?? []), t.createdAt, t.reviewedAt ?? null,
    ]
  );
  inserted += res.rowCount;
}
await client.end();
console.log(`Migrated ${inserted} of ${trips.length} trip(s).`);
