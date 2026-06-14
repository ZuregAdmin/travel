# TripScale Stories

User-submitted travel blogs and photos, organized by country. Built with Next.js 16 + Tailwind v4.

## How it works

- **Home** — country index for every country in the world (searchable, filterable by continent), latest approved trips, and a **Submit your trip** button.
- **`/countries/[code]`** — one page per country showing all approved trips there.
- **`/trips/[id]`** — a trip page: photos (each tagged travel / food / activities / accommodations / scenery), the story, trip goals, and total spent in USD excluding souvenirs.
- **`/submit`** — submission form: country + city, 1–8 photos with categories, story, goals, budget. Submissions land in a pending queue, not on the site.
- **`/admin`** — password-protected review queue. Approve, reject, remove, or permanently delete submissions. Only approved trips are publicly visible.

## Running it

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Set the admin password in `.env.local` (see `.env.example`):

```
ADMIN_PASSWORD=your-real-password
```

If unset, it defaults to `changeme` — fine for local dev, change it before deploying.

## Storage

Trip metadata lives in Supabase Postgres. Uploaded photo bytes live in S3, while
the Supabase `trips.photos` column stores each photo's S3 key and category.

Copy `.env.example` to `.env` and set `DATABASE_URL` to the Supabase transaction
pooler connection string from **Project Settings → Database → Connection
string**. Keep this value server-only.

Apply the schema and migrate any existing `data/trips.json` records:

```bash
pnpm db:apply
```

Check the configured database connection:

```bash
pnpm db:check
```

The schema is in `db/schema.sql`. Both setup commands are idempotent.
