import Link from "next/link";
import { CountryExplorer } from "@/components/country-explorer";
import { TripCard } from "@/components/trip-card";
import { WorldMap, type MapCountryInfo } from "@/components/world-map";
import { COUNTRIES } from "@/lib/countries";
import { approvedTrips } from "@/lib/store";
import { getWorldPaths, MAP_HEIGHT, MAP_WIDTH } from "@/lib/worldmap";

export const dynamic = "force-dynamic";

export default async function Home() {
  const trips = await approvedTrips();

  const tripsPerCountry = new Map<string, number>();
  for (const trip of trips) {
    tripsPerCountry.set(trip.country, (tripsPerCountry.get(trip.country) ?? 0) + 1);
  }

  const countries = COUNTRIES.map((c) => ({
    ...c,
    trips: tripsPerCountry.get(c.code) ?? 0,
  }));

  const countriesVisited = tripsPerCountry.size;
  const recent = trips.slice(0, 3);

  const mapPaths = getWorldPaths();
  const mapInfo: Record<string, MapCountryInfo> = {};
  for (const c of countries) {
    mapInfo[c.code] = { name: c.name, flag: c.flag, trips: c.trips };
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="py-16 text-center sm:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Real trips · Real budgets
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Travel stories from every corner of the world
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Browse trips by country — the photos, the food, the goals, and what
          it actually cost. Then share your own.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/submit"
            className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Submit your trip
          </Link>
          <Link
            href="#countries"
            className="rounded-full border border-border bg-card px-6 py-3 font-medium transition-colors hover:border-primary"
          >
            Explore countries
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 text-sm text-muted-foreground sm:gap-x-10">
          <p>
            <span className="block font-display text-3xl font-semibold text-foreground">
              {trips.length}
            </span>
            {trips.length === 1 ? "trip shared" : "trips shared"}
          </p>
          <p>
            <span className="block font-display text-3xl font-semibold text-foreground">
              {countriesVisited}
            </span>
            {countriesVisited === 1 ? "country covered" : "countries covered"}
          </p>
          <p>
            <span className="block font-display text-3xl font-semibold text-foreground">
              {COUNTRIES.length}
            </span>
            countries to explore
          </p>
        </div>
      </section>

      {/* Latest trips */}
      {recent.length > 0 && (
        <section className="py-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Latest trips
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      )}

      {/* Country index */}
      <section id="countries" className="scroll-mt-20 py-10">
        <h2 className="mb-2 font-display text-2xl font-semibold sm:text-3xl">
          Every country in the world
        </h2>
        <p className="mb-6 text-muted-foreground">
          Pick a destination to read trips from travelers who’ve been there.
        </p>
        <div className="mb-10 rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
          <WorldMap
            paths={mapPaths}
            info={mapInfo}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
          />
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Coral countries have trips — click any country to open its page.
            Small island nations are easier to find in the list below.
          </p>
        </div>
        <CountryExplorer countries={countries} />
      </section>
    </div>
  );
}
