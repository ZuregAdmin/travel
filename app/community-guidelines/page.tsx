import { LegalDocument } from "@/components/legal-document";
import { legalContactEmail } from "@/lib/legal";

export const metadata = { title: "Community Guidelines" };

export default function CommunityGuidelinesPage() {
  const email = legalContactEmail();

  return (
    <LegalDocument title="Community Guidelines">
      <section>
        <h2>Share honest, useful travel experiences</h2>
        <p>
          Describe your own experience accurately. Clearly disclose free stays,
          discounts, sponsorships, affiliate relationships, or other benefits
          that could affect a recommendation.
        </p>
      </section>

      <section>
        <h2>Protect privacy and safety</h2>
        <ul>
          <li>
            Do not post home addresses, precise real-time locations, booking
            codes, passport details, financial data, or private communications.
          </li>
          <li>
            Get permission from identifiable people shown or discussed. For a
            minor, obtain permission from their parent or legal guardian.
          </li>
          <li>
            Do not post sexualized images of minors, intimate imagery, stalking
            material, or content that creates a credible safety risk.
          </li>
        </ul>
      </section>

      <section>
        <h2>Respect rights and people</h2>
        <ul>
          <li>Submit only content you own or have permission to use.</li>
          <li>
            No harassment, threats, hate, impersonation, defamation, or targeted
            disclosure of private information.
          </li>
          <li>
            No illegal content, instructions facilitating serious wrongdoing,
            malware, scams, or deceptive commercial promotion.
          </li>
        </ul>
      </section>

      <section>
        <h2>Moderation and reports</h2>
        <p>
          We may reject or remove content that violates these rules or creates
          legal, privacy, or safety risk. Report a story or photo to{" "}
          <a href={`mailto:${email}`}>{email}</a> and include the page URL,
          specific concern, and your contact information.
        </p>
      </section>
    </LegalDocument>
  );
}
