"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CONTINENTS, type Continent } from "@/lib/countries";

export interface CountryEntry {
  code: string;
  name: string;
  continent: Continent;
  flag: string;
  trips: number;
}

export function CountryExplorer({ countries }: { countries: CountryEntry[] }) {
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState<Continent | "All">("All");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return countries
      .filter((c) => continent === "All" || c.continent === continent)
      .filter((c) => !q || c.name.toLowerCase().includes(q))
      .sort((a, b) => b.trips - a.trips || a.name.localeCompare(b.name));
  }, [countries, query, continent]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries…"
          className="w-full rounded-full border border-border bg-card px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...CONTINENTS] as const).map((c) => (
            <button
              key={c}
              onClick={() => setContinent(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                continent === c
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((c) => (
          <Link
            key={c.code}
            href={`/countries/${c.code}`}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
              c.trips > 0
                ? "border-border bg-card shadow-card hover:border-primary"
                : "border-transparent bg-card/50 hover:bg-card hover:shadow-card"
            }`}
          >
            <span className="text-2xl">{c.flag}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {c.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {c.trips > 0
                  ? `${c.trips} ${c.trips === 1 ? "trip" : "trips"}`
                  : "No trips yet"}
              </span>
            </span>
            {c.trips > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {c.trips}
              </span>
            )}
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No countries match “{query}”.
        </p>
      )}
    </div>
  );
}
