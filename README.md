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

No database. Trips live in `data/trips.json` and uploaded photos in `data/uploads/` (both gitignored). Photos are served through `/api/photos/[name]`. The store layer is isolated in `lib/store.ts`, so swapping in a real database later only touches that file.

The repo ships with no data; sample seed data may exist locally in `data/`. Delete the `data/` directory to start clean.
