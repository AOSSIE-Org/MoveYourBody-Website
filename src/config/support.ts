import { GSOC_URL, STABILITY_NEXUS_URL } from "@/config/links";

/** The page under each locale that asks visitors to support the project */
export const SUPPORT_PAGE_PATH = "/support";

/** Logos shown on the support page, served from `public/brand/icons/` */
export const SUPPORT_LOGOS = {
  organization: "/brand/icons/aossie_logo.svg",
  project: "/brand/icons/MoveYourBody_logo.svg",
} as const;

/** Networks offered by the footer share button, in display order */
export const SHARE_PLATFORMS = ["whatsapp", "twitter", "linkedin", "telegram", "email"] as const;

/** Organisations that support the project, shown under "Supported by" (proper nouns, not translated) */
export const SUPPORTERS = [
  { name: "Google Summer of Code", link: GSOC_URL },
  { name: "Stability Nexus", link: STABILITY_NEXUS_URL },
];
