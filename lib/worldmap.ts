import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import iso from "i18n-iso-countries";
import worldData from "world-atlas/countries-110m.json";
import { COUNTRY_BY_CODE } from "./countries";

export const MAP_WIDTH = 960;
export const MAP_HEIGHT = 480;

export interface CountryPath {
  code: string;
  d: string;
}

// Territories in the 110m dataset whose numeric id doesn't resolve to a code.
const NAME_TO_CODE: Record<string, string> = {
  Kosovo: "XK",
};

let cached: CountryPath[] | null = null;

export function getWorldPaths(): CountryPath[] {
  if (cached) return cached;

  const topo = worldData as unknown as Topology;
  const countries = feature(
    topo,
    topo.objects.countries
  ) as unknown as FeatureCollection<Geometry, { name?: string }>;

  const projection = geoNaturalEarth1().fitSize(
    [MAP_WIDTH, MAP_HEIGHT],
    { type: "Sphere" } as never
  );
  const path = geoPath(projection);

  cached = countries.features.flatMap((f) => {
    const numeric = String(f.id ?? "").padStart(3, "0");
    const code =
      iso.numericToAlpha2(numeric) ??
      NAME_TO_CODE[f.properties?.name ?? ""];
    if (!code || !COUNTRY_BY_CODE.has(code)) return [];
    const d = path(f);
    return d ? [{ code, d }] : [];
  });

  return cached;
}
