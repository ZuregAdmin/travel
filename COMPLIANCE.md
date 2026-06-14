# Compliance Operations Checklist

This repository includes a U.S.-focused baseline for privacy and
user-generated content. It is not a certification or a substitute for advice
from qualified counsel familiar with the operator, audience, and jurisdictions.

## Before Launch

- Set `LEGAL_ENTITY_NAME` to the actual person or legal entity operating the
  service.
- Set `LEGAL_CONTACT_EMAIL` to a monitored mailbox and test inbound delivery.
- Apply `db/schema.sql` with `pnpm db:apply`.
- Confirm Supabase backups, access controls, and retention settings.
- Confirm the S3 role can put, get, and delete objects in the configured bucket.
- Have counsel review the Privacy Notice, Terms, Community Guidelines, and
  takedown process for the operator's location and intended audience.
- If seeking DMCA section 512 safe-harbor protection, register and maintain a
  designated agent with the U.S. Copyright Office. A web page alone is not
  sufficient.

## Request Handling

- Log privacy, correction, deletion, copyright, and safety requests.
- Verify a submitter using the private submission email and submission
  reference before disclosing or changing private data.
- Preserve the minimum information needed to document the request and response.
- Remove approved content and associated S3 objects when a valid deletion or
  takedown request is completed, subject to documented legal exceptions.
- Escalate threats, intimate imagery, child-safety concerns, and court or law
  enforcement requests promptly.

## Ongoing Reviews

- Review pending submissions before publication.
- Do not publish private email addresses or consent records.
- Revisit the Privacy Notice whenever vendors, analytics, advertising,
  retention, or data uses change.
- Change `TERMS_VERSION` and the effective date when submission terms change
  materially.
- Periodically test data export/deletion, S3 cleanup, database restore, and
  access revocation.
- Maintain an incident-response process for unauthorized access or disclosure.

## Primary References

- FTC privacy and security guidance:
  https://www.ftc.gov/business-guidance/privacy-security
- FTC COPPA guidance:
  https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- U.S. Copyright Office DMCA agent FAQ:
  https://www.copyright.gov/dmca-directory/faq.html
- California Attorney General CCPA guidance:
  https://oag.ca.gov/privacy/ccpa
