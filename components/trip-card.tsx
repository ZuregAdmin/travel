import Link from "next/link";
import { COUNTRY_BY_CODE } from "@/lib/countries";
import { formatUSD } from "@/lib/format";
import type { Trip } from "@/lib/types";

export function TripCard({ trip }: { trip: Trip }) {
  const country = COUNTRY_BY_CODE.get(trip.country);
  const cover = trip.photos[0];

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-transform hover:-translate-y-0.5"
    >
      <div className="aspect-[3/2] overflow-hidden bg-muted">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/photos/${cover.file}`}
            alt={trip.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            {country?.flag ?? "🌍"}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-sm text-muted-foreground">
          {country?.flag} {trip.city}, {country?.name ?? trip.country}
        </p>
        <h3 className="font-display text-lg font-semibold leading-snug">
          {trip.title}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="text-muted-foreground">by {trip.author}</span>
          <span className="font-medium text-secondary">
            {formatUSD(trip.totalSpent)}
          </span>
        </div>
      </div>
    </Link>
  );
}
