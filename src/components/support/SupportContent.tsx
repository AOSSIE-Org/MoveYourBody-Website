"use client";

import { useTranslations } from "next-intl";
import SupportUsButton from "@aossie-org/support-us-button";
import { AOSSIE_URL, GITHUB_SPONSORS_URL } from "@/config/links";
import { SUPPORT_LOGOS, SUPPORTERS } from "@/config/support";
// Scoped to the widget's `.sub-root`, so it leaves the rest of the page alone
import "@aossie-org/support-us-button/style.css";

/** The support widget, in the site's font and colours, with the reader's language */
export default function SupportContent() {
  const t = useTranslations("Support");
  const tFooter = useTranslations("Footer");

  return (
    <SupportUsButton
      Theme="auto"
      heading={t("title")}
      labels={{ madeBy: t("madeBy"), supportedBy: t("supportedBy") }}
      organizationInformation={{
        name: "AOSSIE",
        desc: t("aossieDescription"),
        image: SUPPORT_LOGOS.organization,
        link: AOSSIE_URL,
      }}
      projectInformation={{
        name: "MoveYourBody",
        description: tFooter("tagline"),
        image: SUPPORT_LOGOS.project,
      }}
      sponsors={SUPPORTERS}
      ctaSection={{ sponsorLink: [{ name: "GitHub Sponsors", url: GITHUB_SPONSORS_URL }] }}
    />
  );
}
