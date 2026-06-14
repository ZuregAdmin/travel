import Link from "next/link";
import { LegalDocument } from "@/components/legal-document";
import { legalContactEmail, legalEntityName } from "@/lib/legal";

export const metadata = { title: "Terms of Use" };

export default function TermsPage() {
  const email = legalContactEmail();
  const entity = legalEntityName();

  return (
    <LegalDocument title="Terms of Use">
      <section>
        <h2>Agreement and eligibility</h2>
        <p>
          By using the service or submitting content, you agree to these Terms
          and the <Link href="/privacy">Privacy Notice</Link>. You must be at
          least 18 years old to submit content and must have authority to accept
          these Terms.
        </p>
      </section>

      <section>
        <h2>Your content and license</h2>
        <p>
          You retain ownership of content you submit. You grant {entity} a
          non-exclusive, worldwide, royalty-free license to host, store,
          reproduce, format, display, distribute, and promote that content for
          operating and publicizing the service. This license includes making
          technical changes such as resizing or re-encoding images.
        </p>
        <p>
          You represent that you created the content or have all permissions
          needed to submit it, and that publishing it does not violate
          copyright, privacy, publicity, confidentiality, or other rights.
          Identifiable people shown in photos must have consented, with parent
          or guardian permission for any minor.
        </p>
      </section>

      <section>
        <h2>Content rules and moderation</h2>
        <p>
          You must follow the{" "}
          <Link href="/community-guidelines">Community Guidelines</Link>. We
          may review, edit for formatting, reject, restrict, or remove content
          at any time, but we are not obligated to publish or monitor every
          submission. Do not rely on the service as permanent storage.
        </p>
      </section>

      <section>
        <h2>Removal</h2>
        <p>
          You may request removal by emailing{" "}
          <a href={`mailto:${email}`}>{email}</a>. Removal from the live service
          may not immediately remove search-engine caches, third-party copies,
          legal records, or routine backups. The content license ends after
          removal except as reasonably necessary for those limited purposes and
          prior authorized uses.
        </p>
      </section>

      <section>
        <h2>Travel information and third parties</h2>
        <p>
          Stories reflect individual experiences and may be incomplete,
          outdated, or inaccurate. The service does not provide travel, legal,
          medical, safety, or financial advice. Verify prices, entry rules,
          safety conditions, and provider terms independently.
        </p>
      </section>

      <section>
        <h2>Service availability and disclaimers</h2>
        <p>
          The service is provided on an "as is" and "as available" basis to the
          extent permitted by law. We do not promise uninterrupted operation,
          publication, accuracy, or preservation of content. To the extent
          permitted by law, {entity} is not liable for indirect, incidental,
          special, consequential, or punitive damages arising from use of the
          service or user content.
        </p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          We may update these Terms for future use of the service. Material
          changes will be reflected by a new effective date and consent version
          for new submissions. Questions may be sent to{" "}
          <a href={`mailto:${email}`}>{email}</a>.
        </p>
      </section>
    </LegalDocument>
  );
}
