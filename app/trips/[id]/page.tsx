import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRY_BY_CODE } from "@/lib/countries";
import { formatDate, formatUSD } from "@/lib/format";
import { getTrip } from "@/lib/store";
import { PHOTO_CATEGORY_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const trip = await getTrip(id);
  return { title: trip?.status === "approved" ? trip.title : "Trip" };
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n+/)
        .filter((p) => p.trim())
        .map((p, i) => (
          <p key={i} className="mt-4 leading-relaxed first:mt-0">
            {p}
          </p>
        ))}
    </>
  );
}

export default async function TripPage({ params }: Props) {
  const { id } = await params;
  const trip = await getTrip(id);
  if (!trip || trip.status !== "approved") notFound();

  const country = COUNTRY_BY_CODE.get(trip.country);

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6">
      <div className="py-12 sm:py-16">
        <Link
          href={`/countries/${trip.country}`}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← {country?.flag} {country?.name ?? trip.country}
        </Link>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {trip.title}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {trip.city}, {country?.name ?? trip.country} · by {trip.author} ·{" "}
          {formatDate(trip.createdAt)}
        </p>
      </div>

      {/* Photos */}
      <div className="grid gap-4 sm:grid-cols-2">
        {trip.photos.map((photo) => (
          <figure
            key={photo.file}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-card"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/photos/${photo.file}`}
              alt={PHOTO_CATEGORY_LABELS[photo.category]}
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="px-4 py-2.5 text-sm font-medium text-muted-foreground">
              {PHOTO_CATEGORY_LABELS[photo.category]}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Budget callout */}
      <div className="mt-8 flex items-center justify-between rounded-xl bg-secondary px-6 py-5 text-secondary-foreground">
        <div>
          <p className="text-sm uppercase tracking-wide opacity-80">
            Total spent
          </p>
          <p className="text-xs opacity-60">excluding souvenirs</p>
        </div>
        <p className="font-display text-3xl font-semibold">
          {formatUSD(trip.totalSpent)}
        </p>
      </div>

      {/* Story */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">What we did</h2>
        <div className="mt-4 text-[1.05rem]">
          <Paragraphs text={trip.story} />
        </div>
      </section>

      <section className="mt-10 pb-6">
        <h2 className="font-display text-2xl font-semibold">
          Goals of the trip
        </h2>
        <div className="mt-4 text-[1.05rem]">
          <Paragraphs text={trip.goals} />
        </div>
      </section>
    </article>
  );
}
