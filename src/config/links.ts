/** Production origin, overridable at build time via NEXT_PUBLIC_SITE_URL (no trailing slash) */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://move.aossie.org").replace(/\/$/, "");

/** Android application id, used by the Play Store link, the web manifest and the smart app banner */
export const PLAY_STORE_APP_ID = "org.aossie.move";
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_STORE_APP_ID}`;
export const REPO_URL = "https://github.com/AOSSIE-Org/MoveYourBody";
export const WEBSITE_REPO_URL = "https://github.com/AOSSIE-Org/MoveYourBody-Website";
export const PRIVACY_POLICY_URL = `${REPO_URL}/blob/main/PRIVACY_POLICY.md`;
export const CONTRIBUTING_URL = `${REPO_URL}/blob/main/CONTRIBUTING.md`;
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;
export const AOSSIE_URL = "https://aossie.org";
/** Full GPL-3.0 text, referenced as the license in structured data */
export const GPL_LICENSE_TEXT_URL = "https://www.gnu.org/licenses/gpl-3.0.html";
/** GitHub origin; profile links and avatars are `${GITHUB_URL}/<user>` and `${GITHUB_URL}/<user>.png` */
export const GITHUB_URL = "https://github.com";
/** Contributor avatar wall for the app repository */
export const CONTRIBUTORS_IMAGE_URL = "https://contrib.rocks/image?repo=AOSSIE-Org/MoveYourBody&max=24";
export const STABILITY_NEXUS_URL = "https://stability.nexus";
/** Where people can sponsor AOSSIE, linked from the support page */
export const GITHUB_SPONSORS_URL = "https://github.com/sponsors/AOSSIE-Org";
/** Google Summer of Code, listed as a supporter on the support page */
export const GSOC_URL = "https://summerofcode.withgoogle.com";

export const SOCIAL_LINKS = {
  discord: "https://discord.gg/hjUhu33uAn",
  telegram: "https://t.me/+bMWGzaMTMa8xN2Ex",
  x: "https://x.com/aossie_org",
  linkedin: "https://www.linkedin.com/company/aossie/",
  youtube: "https://www.youtube.com/@AOSSIE-Org",
  github: REPO_URL,
} as const;

export type SocialId = keyof typeof SOCIAL_LINKS;
