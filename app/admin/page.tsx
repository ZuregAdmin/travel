import Link from "next/link";
import { AdminLogin } from "@/components/admin-login";
import { COUNTRY_BY_CODE } from "@/lib/countries";
import { formatDate, formatUSD } from "@/lib/format";
import { isAdmin } from "@/lib/auth";
import { approvedTrips, pendingTrips, rejectedTrips } from "@/lib/store";
import { PHOTO_CATEGORY_LABELS, type Trip } from "@/lib/types";
import { approveTrip, logout, rejectTrip, removeTrip } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

function PendingCard({ trip }: { trip: Trip }) {
  const country = COUNTRY_BY_CODE.get(trip.country);
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold">{trip.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {country?.flag} {trip.city}, {country?.name ?? trip.country} · by{" "}
            {trip.author} · {formatDate(trip.createdAt)} ·{" "}
            <span className="font-medium text-secondary">
              {formatUSD(trip.totalSpent)}
            </span>{" "}
            (excl. souvenirs)
          </p>
        </div>
        <div className="flex gap-2">
          <form action={approveTrip.bind(null, trip.id)}>
            <button className="rounded-full bg-secondary px-5 py-2 text-sm font-medium text-secondary-foreground transition-opacity hover:opacity-90">
              Approve
            </button>
          </form>
          <form action={rejectTrip.bind(null, trip.id)}>
            <button className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary">
              Reject
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {trip.photos.map((photo) => (
          <figure key={photo.file}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/photos/${photo.file}`}
              alt={PHOTO_CATEGORY_LABELS[photo.category]}
              className="aspect-square w-full rounded-lg object-cover"
            />
            <figcaption className="mt-1 text-xs text-muted-foreground">
              {PHOTO_CATEGORY_LABELS[photo.category]}
            </figcaption>
          </figure>
        ))}
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
          Read story &amp; goals
        </summary>
        <div className="mt-3 space-y-4 text-sm leading-relaxed">
          <div>
            <p className="font-semibold">What they did</p>
            <p className="mt-1 whitespace-pre-line text-muted-foreground">
              {trip.story}
            </p>
          </div>
          <div>
            <p className="font-semibold">Goals</p>
            <p className="mt-1 whitespace-pre-line text-muted-foreground">
              {trip.goals}
            </p>
          </div>
        </div>
      </details>
    </div>
  );
}

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin />;
  }

  const [pending, approved, rejected] = await Promise.all([
    pendingTrips(),
    approvedTrips(),
    rejectedTrips(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <div className="flex items-center justify-between py-12">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Review queue
          </h1>
          <p className="mt-1 text-muted-foreground">
            {pending.length} pending · {approved.length} live ·{" "}
            {rejected.length} rejected
          </p>
        </div>
        <form action={logout}>
          <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Log out
          </button>
        </form>
      </div>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">
          Pending approval
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
            Nothing waiting for review. 🎉
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {pending.map((trip) => (
              <PendingCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-semibold">Live on site</h2>
        {approved.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published trips yet.</p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {approved.map((trip) => {
              const country = COUNTRY_BY_CODE.get(trip.country);
              return (
                <li
                  key={trip.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="truncate font-medium hover:text-primary"
                    >
                      {country?.flag} {trip.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {trip.city}, {country?.name} · by {trip.author}
                    </p>
                  </div>
                  <form action={removeTrip.bind(null, trip.id)}>
                    <button className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      Remove
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-12 pb-6">
        <h2 className="mb-4 font-display text-xl font-semibold">Rejected</h2>
        {rejected.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing rejected.</p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {rejected.map((trip) => {
              const country = COUNTRY_BY_CODE.get(trip.country);
              return (
                <li
                  key={trip.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {country?.flag} {trip.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {trip.city}, {country?.name} · by {trip.author}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <form action={approveTrip.bind(null, trip.id)}>
                      <button className="text-sm text-muted-foreground transition-colors hover:text-secondary">
                        Approve
                      </button>
                    </form>
                    <form action={removeTrip.bind(null, trip.id)}>
                      <button className="text-sm text-muted-foreground transition-colors hover:text-primary">
                        Delete forever
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
