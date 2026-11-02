"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { container } from "@/components/container";
import SiteShareButton from "@/components/sections/SiteShareButton";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { useSectionHref } from "@/components/ui/useSectionHref";
import { LEGAL_PAGES } from "@/config/legal";
import {
  AOSSIE_URL,
  CONTRIBUTING_URL,
  LICENSE_URL,
  PLAY_STORE_URL,
  REPO_URL,
  SOCIAL_LINKS,
  STABILITY_NEXUS_URL,
  WEBSITE_REPO_URL,
  type SocialId,
} from "@/config/links";
import { SUPPORT_PAGE_PATH } from "@/config/support";
import { Link } from "@/i18n/navigation";

const linkClass =
  "text-sm text-foreground-muted transition-colors duration-200 hover:text-foreground-primary focus-visible:text-foreground-primary";

/** The centred legal/support links in the bottom row: one step smaller than the column links */
const bottomLinkClass = linkClass.replace("text-sm", "text-[0.8125rem]");

/** AOSSIE / Stability Nexus credit: small logo before the name */
const orgLinkClass = `${bottomLinkClass} inline-flex items-center gap-2`;

const socials: SocialId[] = ["discord", "telegram", "x", "linkedin", "youtube", "github"];

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[0.625rem] font-semibold tracking-[0.2em] text-foreground-faint uppercase">{title}</h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {children}
      </a>
    </li>
  );
}

export default function SiteFooter() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navbar");
  const tCommon = useTranslations("Common");
  const sectionHref = useSectionHref();

  return (
    <footer className="relative isolate overflow-hidden border-t border-border-default pt-20 pb-10">
      <div className={`${container} grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]`}>
        <div className="max-w-sm">
          <a href="#top" className="inline-flex items-center gap-3">
            <Image src="/brand/icons/MoveYourBody_logo.svg" alt="" width={36} height={39} className="h-9 w-auto" />
            <span className="text-xl font-semibold text-foreground-primary">
              {tCommon("brandMove")}
              <span className="text-highlight">{tCommon("brandYour")}</span>
              {tCommon("brandBody")}
            </span>
          </a>
          <p className="mt-4 text-sm leading-relaxed font-light text-foreground-muted">{t("tagline")}</p>
        </div>

        <Column title={t("product")}>
          <li><a href={sectionHref("features")} className={linkClass}>{tNav("features")}</a></li>
          <li><a href={sectionHref("how-it-works")} className={linkClass}>{tNav("howItWorks")}</a></li>
          <li><a href={sectionHref("privacy")} className={linkClass}>{tNav("privacy")}</a></li>
          <External href={PLAY_STORE_URL}>{tNav("download")}</External>
        </Column>

        <Column title={t("project")}>
          <External href={REPO_URL}>{t("links.source")}</External>
          <External href={WEBSITE_REPO_URL}>{t("links.website")}</External>
          <External href={CONTRIBUTING_URL}>{t("links.contributing")}</External>
          <External href={LICENSE_URL}>{t("links.license")}</External>
        </Column>

        <Column title={t("community")}>
          {socials.map((id) => (
            <li key={id}>
              <a href={SOCIAL_LINKS[id]} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-2.5`}>
                <BrandIcon name={id} className="size-3.5" />
                {t(`social.${id}`)}
              </a>
            </li>
          ))}
        </Column>
      </div>

      {/* One quiet bottom bar under a divider: orgs, legal/support/share links, copyright.
          From lg the equal side cells keep the links centred on the viewport. */}
      <div className={`${container} mt-16`}>
        <div className="flex flex-col items-center gap-5 border-t border-border-subtle pt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-8">
          <div className="flex items-center gap-5 lg:justify-self-start">
            <a href={AOSSIE_URL} target="_blank" rel="noopener noreferrer" className={orgLinkClass}>
              <Image src="/brand/icons/aossie_logo.svg" alt="" width={24} height={24} className="h-5 w-auto" />
              AOSSIE
            </a>
            <a href={STABILITY_NEXUS_URL} target="_blank" rel="noopener noreferrer" className={orgLinkClass}>
              <Image src="/brand/icons/stability_nexus_logo.svg" alt="" width={24} height={24} className="h-5 w-auto" />
              Stability Nexus
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href={LEGAL_PAGES.privacy.path} className={bottomLinkClass}>{t("links.privacy")}</Link>
            <Link href={LEGAL_PAGES.terms.path} className={bottomLinkClass}>{t("links.terms")}</Link>
            <Link href={SUPPORT_PAGE_PATH} className={`${bottomLinkClass} inline-flex items-center gap-1.5`}>
              <Heart aria-hidden="true" className="size-3.5" />
              {t("links.support")}
            </Link>
            <SiteShareButton className={`${bottomLinkClass} inline-flex cursor-pointer items-center`} />
          </div>
          <p className="text-xs text-foreground-faint lg:justify-self-end">{t("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
