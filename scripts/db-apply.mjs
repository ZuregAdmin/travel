// Applies db/schema.sql to DATABASE_URL, then migrates data/trips.json (if any).
// Idempotent. Run with env loaded:
//
//   node --env-file=.env scripts/db-apply.mjs
//
import { readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15_000,
});

try {
  await client.connect();
  const who = await client.query("SELECT current_user, current_database()");
  console.log("CONNECTED:", who.rows[0].current_user, "/", who.rows[0].current_database);

  const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
  await client.query(schema);
  console.log("SCHEMA: applied");

  // Migrate existing file-backed trips, if present.
  let trips = [];
  try {
    trips = JSON.parse(await readFile(path.join(process.cwd(), "data", "trips.json"), "utf8"));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  let inserted = 0;
  for (const t of trips) {
    const res = await client.query(
      `INSERT INTO trips
         (id, status, country, city, author, title, story, goals,
          total_spent, photos, created_at, reviewed_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO NOTHING`,
      [t.id, t.status, t.country, t.city, t.author, t.title, t.story, t.goals,
       t.totalSpent, JSON.stringify(t.photos ?? []), t.createdAt, t.reviewedAt ?? null]
    );
    inserted += res.rowCount;
  }
  console.log(`MIGRATE: ${inserted} new of ${trips.length} file trip(s)`);

  const c = await client.query("SELECT count(*)::int AS n FROM trips");
  console.log("TRIPS rows now:", c.rows[0].n);
} catch (err) {
  console.error("FAILED:", err.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
