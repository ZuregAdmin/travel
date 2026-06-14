import { SubmitForm } from "@/components/submit-form";
import { COUNTRIES } from "@/lib/countries";
import { legalContactEmail } from "@/lib/legal";

export const metadata = { title: "Share your trip" };

export default function SubmitPage() {
  const contactEmail = legalContactEmail();
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
        <div className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Notice at collection</p>
          <p className="mt-1">
            We collect your private email, public display name, story, trip
            details, photos, and consent record to review and publish your
            submission, prevent misuse, and handle rights requests. Public
            fields become visible worldwide if approved. Request access,
            correction, or deletion at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-primary hover:underline"
            >
              {contactEmail}
            </a>
            . See the Privacy Notice for retention and service-provider details.
          </p>
        </div>
      </div>
      <div className="pb-10">
        <SubmitForm countries={countries} />
      </div>
    </div>
  );
}
