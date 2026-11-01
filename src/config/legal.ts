import type { Locale } from "./languages";

/** Language the repository's legal documents are written in; other locales show a note above them */
export const LEGAL_DOCUMENT_LOCALE: Locale = "en";

/**
 * Site pages that render the repository's legal documents. `path` is the page under each locale,
 * `file` is read from the repository root at build time.
 */
export const LEGAL_PAGES = {
  privacy: { path: "/privacy", file: "PRIVACY.md" },
  terms: { path: "/terms", file: "TERMS.md" },
} as const;

export type LegalPageId = keyof typeof LEGAL_PAGES;
