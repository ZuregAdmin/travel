export const LEGAL_EFFECTIVE_DATE = "June 14, 2026";
export const TERMS_VERSION = "2026-06-14";

const DEFAULT_LEGAL_EMAIL = "privacy@tripscale.ai";

export function legalContactEmail(): string {
  const configured = process.env.LEGAL_CONTACT_EMAIL?.trim();
  return configured && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configured)
    ? configured
    : DEFAULT_LEGAL_EMAIL;
}

export function legalEntityName(): string {
  return process.env.LEGAL_ENTITY_NAME?.trim() || "TripScale Stories";
}
