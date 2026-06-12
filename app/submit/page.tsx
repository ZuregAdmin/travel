import { SubmitForm } from "@/components/submit-form";
import { COUNTRIES } from "@/lib/countries";

export const metadata = { title: "Share your trip" };

export default function SubmitPage() {
  const countries = COUNTRIES.map(({ code, name, flag }) => ({
    code,
    name,
    flag,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <div className="py-12 sm:py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Share your trip
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Tell other travelers where you went, what you did, and what it really
          cost. Your submission goes to our review queue and appears on the
          site once approved.
        </p>
      </div>
      <div className="pb-10">
        <SubmitForm countries={countries} />
      </div>
    </div>
  );
}
