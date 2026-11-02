import { NextResponse } from "next/server";
import { LEGAL_PAGES } from "@/config/legal";
import { PLAY_STORE_URL, REPO_URL, SITE_URL, WEBSITE_REPO_URL } from "@/config/links";
import { SUPPORT_PAGE_PATH } from "@/config/support";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    name: "MoveYourBody",
    version: "1.0.0",
    description:
      "Privacy-first, open-source fitness app by AOSSIE: personalized 5–7 minute micro-workouts powered by on-device AI and voice control, running fully offline.",
    organization: "AOSSIE",
    license: "GPL-3.0",
    repository: REPO_URL,
    websiteRepository: WEBSITE_REPO_URL,
    features: [
      "Personalized workouts (goals, fitness level, equipment, target body region)",
      "Short 5–7 minute micro-workout sessions",
      "Adaptive recommendations from post-workout feedback",
      "Anti-boredom variety engine",
      "Safety-aware exercise filtering for injuries",
      "Offline, on-device AI (quantized all-MiniLM-L6-v2 via ONNX Runtime)",
      "Voice-controlled workouts",
      "Smart daily reminders",
      "Workout statistics and progress tracking",
      "Custom workout creation, exercise search and body-focus sessions",
    ],
    platforms: ["Android"],
    links: {
      home: `${SITE_URL}/`,
      playStore: PLAY_STORE_URL,
      docs: `${SITE_URL}/api/`,
      openapi: `${SITE_URL}/openapi.json`,
      llms: `${SITE_URL}/llms.txt`,
      privacy: `${SITE_URL}/${routing.defaultLocale}${LEGAL_PAGES.privacy.path}`,
      terms: `${SITE_URL}/${routing.defaultLocale}${LEGAL_PAGES.terms.path}`,
      support: `${SITE_URL}/${routing.defaultLocale}${SUPPORT_PAGE_PATH}`,
    },
  });
}
