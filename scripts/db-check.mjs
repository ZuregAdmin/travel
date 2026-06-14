import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10_000,
});

try {
  const started = Date.now();
  await client.connect();
  const { rows } = await client.query(`
    SELECT
      current_database() AS database,
      current_user AS db_user,
      (SELECT count(*)::int FROM trips) AS trip_count
  `);
  console.log("Supabase connected:", {
    ...rows[0],
    latency_ms: Date.now() - started,
  });
} catch (error) {
  console.error("Supabase connection failed:", error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
