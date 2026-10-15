/** Production origin, overridable at build time via NEXT_PUBLIC_SITE_URL (no trailing slash) */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://move.aossie.org").replace(/\/$/, "");

export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=org.aossie.move";
export const REPO_URL = "https://github.com/AOSSIE-Org/MoveYourBody";
export const WEBSITE_REPO_URL = "https://github.com/AOSSIE-Org/MoveYourBody-Website";
export const PRIVACY_POLICY_URL = `${REPO_URL}/blob/main/PRIVACY_POLICY.md`;
export const CONTRIBUTING_URL = `${REPO_URL}/blob/main/CONTRIBUTING.md`;
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;
export const AOSSIE_URL = "https://aossie.org";
export const STABILITY_NEXUS_URL = "https://stability.nexus";

export const SOCIAL_LINKS = {
  discord: "https://discord.gg/hjUhu33uAn",
  telegram: "https://t.me/+bMWGzaMTMa8xN2Ex",
  x: "https://x.com/aossie_org",
  linkedin: "https://www.linkedin.com/company/aossie/",
  youtube: "https://www.youtube.com/@AOSSIE-Org",
  github: REPO_URL,
} as const;

export type SocialId = keyof typeof SOCIAL_LINKS;
