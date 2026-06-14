import { LegalDocument } from "@/components/legal-document";
import { legalContactEmail, legalEntityName } from "@/lib/legal";

export const metadata = { title: "Copyright and Takedowns" };

export default function CopyrightPage() {
  const email = legalContactEmail();
  const entity = legalEntityName();

  return (
    <LegalDocument title="Copyright and Takedowns">
      <section>
        <h2>Reporting copyright infringement</h2>
        <p>
          If you believe content on {entity} infringes your copyright, send a
          notice to <a href={`mailto:${email}`}>{email}</a> containing:
        </p>
        <ul>
          <li>Your physical or electronic signature.</li>
          <li>
            Identification of the copyrighted work, or a representative list
            if multiple works are involved.
          </li>
          <li>
            The URL and enough detail to identify the material you want removed.
          </li>
          <li>Your name, mailing address, telephone number, and email address.</li>
          <li>
            A statement that you have a good-faith belief the use is not
            authorized by the owner, its agent, or the law.
          </li>
          <li>
            A statement, under penalty of perjury, that the notice is accurate
            and that you are authorized to act for the copyright owner.
          </li>
        </ul>
      </section>

      <section>
        <h2>Counter-notices</h2>
        <p>
          If your content was removed because of a copyright notice and you
          believe that was a mistake or misidentification, contact the same
          address for counter-notice instructions. Valid counter-notices
          generally require your signature, identification of removed material,
          a statement under penalty of perjury, your contact information, and
          consent to the appropriate federal court jurisdiction.
        </p>
      </section>

      <section>
        <h2>Other privacy or safety requests</h2>
        <p>
          For privacy, impersonation, intimate-image, or safety concerns, use
          the same contact address and clearly identify the nature of the
          request so it can be prioritized appropriately.
        </p>
      </section>
    </LegalDocument>
  );
}
