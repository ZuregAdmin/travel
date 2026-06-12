"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { CountryPath } from "@/lib/worldmap";

export interface MapCountryInfo {
  name: string;
  flag: string;
  trips: number;
}

interface Tooltip {
  x: number;
  y: number;
  code: string;
}

export function WorldMap({
  paths,
  info,
  width,
  height,
}: {
  paths: CountryPath[];
  info: Record<string, MapCountryInfo>;
  width: number;
  height: number;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tooltip | null>(null);

  const move = (e: React.MouseEvent, code: string) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top, code });
  };

  const tipInfo = tip ? info[tip.code] : undefined;

  return (
    <div ref={containerRef} className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="World map — click a country to open its page"
      >
        {paths.map((p) => {
          const trips = info[p.code]?.trips ?? 0;
          return (
            <path
              key={p.code}
              d={p.d}
              onClick={() => router.push(`/countries/${p.code}`)}
              onMouseEnter={(e) => move(e, p.code)}
              onMouseMove={(e) => move(e, p.code)}
              onMouseLeave={() => setTip(null)}
              className={`cursor-pointer stroke-background transition-colors ${
                trips > 0
                  ? "fill-primary hover:fill-secondary"
                  : "fill-border hover:fill-primary/40"
              }`}
              strokeWidth={0.6}
            />
          );
        })}
      </svg>

      {tip && tipInfo && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm shadow-card"
          style={{ left: tip.x, top: tip.y - 44 }}
        >
          <span className="font-medium">
            {tipInfo.flag} {tipInfo.name}
          </span>{" "}
          <span className="text-muted-foreground">
            ·{" "}
            {tipInfo.trips > 0
              ? `${tipInfo.trips} ${tipInfo.trips === 1 ? "trip" : "trips"}`
              : "no trips yet"}
          </span>
        </div>
      )}
    </div>
  );
}
