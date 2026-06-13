// One-time IAM setup. Connects as the RDS master user with PASSWORD auth, then:
//   1. creates the `tripscale` login role (if missing)
//   2. grants it rds_iam so it can authenticate with IAM tokens
//   3. applies db/schema.sql (creates the trips table)
//   4. grants the role privileges on the schema + trips table
//
// Run with the master password in an env var so it never lands in shell history
// or chat:
//
//   RDS_MASTER_PASSWORD='your-master-password' node scripts/setup-iam-user.mjs
//
import { readFile } from "node:fs/promises";
import pg from "pg";

const HOST = process.env.RDS_HOST ?? "database-1.cluster-c9qggw84y9t2.us-east-2.rds.amazonaws.com";
const PORT = Number(process.env.RDS_PORT ?? "5432");
const DATABASE = process.env.RDS_DATABASE ?? "postgres";
const MASTER_USER = process.env.RDS_MASTER_USER ?? "postgres";
const APP_USER = process.env.RDS_USER ?? "tripscale";
const PASSWORD = process.env.RDS_MASTER_PASSWORD;

if (!PASSWORD) {
  console.error("Set RDS_MASTER_PASSWORD to the master DB password.");
  process.exit(1);
}

const client = new pg.Client({
  host: HOST,
  port: PORT,
  database: DATABASE,
  user: MASTER_USER,
  password: PASSWORD,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10_000,
});

await client.connect();
console.log("Connected as", MASTER_USER);

await client.query(`
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${APP_USER}') THEN
      CREATE ROLE ${APP_USER} WITH LOGIN;
    END IF;
  END $$;
`);
console.log("Role ready:", APP_USER);

await client.query(`GRANT rds_iam TO ${APP_USER}`);
console.log("Granted rds_iam");

const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
await client.query(schema);
console.log("Schema applied");

await client.query(`GRANT USAGE ON SCHEMA public TO ${APP_USER}`);
await client.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${APP_USER}`);
await client.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${APP_USER}`);
console.log("Privileges granted to", APP_USER);

await client.end();
console.log("Done. The app can now authenticate as", APP_USER, "via IAM.");
