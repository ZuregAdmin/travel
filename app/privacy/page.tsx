import Link from "next/link";
import { LegalDocument } from "@/components/legal-document";
import { legalContactEmail, legalEntityName } from "@/lib/legal";

export const metadata = { title: "Privacy Notice" };

export default function PrivacyPage() {
  const email = legalContactEmail();
  const entity = legalEntityName();

  return (
    <LegalDocument title="Privacy Notice">
      <section>
        <h2>Who we are</h2>
        <p>
          {entity} operates this travel-story service. This notice explains
          what information we collect, why we use it, and the choices available
          to you.
        </p>
      </section>

      <section>
        <h2>Information we collect</h2>
        <ul>
          <li>
            Submission content: public display name, trip location, title,
            story, goals, budget, and photos.
          </li>
          <li>
            Private submission data: contact email, consent timestamp, policy
            version, and required attestations.
          </li>
          <li>
            Technical data ordinarily produced by hosting, database, and object
            storage providers, such as IP address, request time, and security
            logs.
          </li>
          <li>
            An essential authentication cookie when an administrator signs in.
          </li>
        </ul>
        <p>
          We do not currently use advertising cookies or sell personal
          information. Uploaded images are re-encoded to remove embedded
          metadata such as GPS coordinates, but you should still avoid sharing
          sensitive information visible in an image.
        </p>
      </section>

      <section>
        <h2>How we use information</h2>
        <p>
          We use information to receive and moderate submissions, publish
          approved stories, operate and secure the service, communicate about a
          submission, investigate misuse, comply with law, and process privacy
          or intellectual-property requests.
        </p>
      </section>

      <section>
        <h2>What becomes public</h2>
        <p>
          If approved, your display name, trip details, story, budget, and
          photos are publicly available worldwide and may be indexed, copied,
          or shared by others. Your contact email and consent record are not
          intentionally published.
        </p>
      </section>

      <section>
        <h2>Service providers and transfers</h2>
        <p>
          We use service providers including Supabase for trip records, Amazon
          Web Services for photo storage, and our web-hosting provider. They
          process information on our behalf to provide infrastructure,
          security, and operations. Information may be processed in the United
          States and other locations where those providers operate.
        </p>
      </section>

      <section>
        <h2>Retention</h2>
        <p>
          We retain submissions and consent records while reviewing or
          publishing them and as reasonably needed for security, disputes,
          legal obligations, and backups. We delete or de-identify information
          when it is no longer needed, subject to legal exceptions and normal
          backup expiration.
        </p>
      </section>

      <section>
        <h2>Your choices and requests</h2>
        <p>
          You may request access, correction, or deletion of your submission
          and private contact data. Email{" "}
          <a href={`mailto:${email}`}>{email}</a> with your submission
          reference, the email used to submit, and the request. We may need to
          verify your identity and may retain limited records where legally
          permitted or required. We do not discriminate for exercising privacy
          rights.
        </p>
      </section>

      <section>
        <h2>Age limits</h2>
        <p>
          Submissions are limited to people age 18 or older. The service is not
          directed to children, and we do not knowingly collect submissions
          from children under 13. Contact us if you believe a child provided
          personal information.
        </p>
      </section>

      <section>
        <h2>Security and changes</h2>
        <p>
          We use reasonable safeguards, but no online service can guarantee
          absolute security. We may update this notice as the service changes
          and will revise the effective date when we do.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Privacy questions and requests: <a href={`mailto:${email}`}>{email}</a>.
          Also review our <Link href="/terms">Terms of Use</Link>.
        </p>
      </section>
    </LegalDocument>
  );
}
