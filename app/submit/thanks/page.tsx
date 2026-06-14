import Link from "next/link";

export const metadata = { title: "Submitted" };

interface Props {
  searchParams: Promise<{ reference?: string }>;
}

export default async function ThanksPage({ searchParams }: Props) {
  const { reference } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-5xl">🧳</p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Thanks — your trip is in the queue!
      </h1>
      <p className="mt-4 text-muted-foreground">
        We review every submission before it goes live. Once approved, your
        story and photos will appear on the country page for everyone to
        explore.
      </p>
      {reference && (
        <p className="mt-4 rounded-lg border border-border bg-card px-4 py-3 text-sm">
          Submission reference:{" "}
          <strong className="break-all font-mono">{reference}</strong>
        </p>
      )}
      <p className="mt-3 text-sm text-muted-foreground">
        Keep the reference above if you may need to request a correction or
        deletion later.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
        <Link
          href="/submit"
          className="rounded-full border border-border bg-card px-6 py-3 font-medium transition-colors hover:border-primary"
        >
          Submit another
        </Link>
      </div>
    </div>
  );
}
