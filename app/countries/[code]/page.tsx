import Link from "next/link";
import { notFound } from "next/navigation";
import { TripCard } from "@/components/trip-card";
import { COUNTRY_BY_CODE } from "@/lib/countries";
import { approvedTripsByCountry } from "@/lib/store";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { code } = await params;
  const country = COUNTRY_BY_CODE.get(code.toUpperCase());
  return { title: country ? country.name : "Country" };
}

export default async function CountryPage({ params }: Props) {
  const { code } = await params;
  const country = COUNTRY_BY_CODE.get(code.toUpperCase());
  if (!country) notFound();

  const trips = await approvedTripsByCountry(country.code);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="py-12 sm:py-16">
        <Link
          href="/#countries"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← All countries
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-6xl">{country.flag}</span>
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {country.name}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {country.continent} ·{" "}
              {trips.length === 1 ? "1 trip" : `${trips.length} trips`}
            </p>
          </div>
        </div>
      </div>

      {trips.length > 0 ? (
        <div className="grid gap-5 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <p className="text-3xl">{country.flag}</p>
          <h2 className="mt-3 font-display text-xl font-semibold">
            No trips to {country.name} yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Been here? Be the first to share your story, photos, and what the
            trip really cost.
          </p>
          <Link
            href="/submit"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Share your trip
          </Link>
        </div>
      )}
    </div>
  );
}
