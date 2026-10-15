"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { container } from "@/components/container";
import { BrandIcon } from "@/components/ui/BrandIcons";
import {
  AOSSIE_URL,
  CONTRIBUTING_URL,
  LICENSE_URL,
  PLAY_STORE_URL,
  PRIVACY_POLICY_URL,
  REPO_URL,
  SOCIAL_LINKS,
  STABILITY_NEXUS_URL,
  WEBSITE_REPO_URL,
  type SocialId,
} from "@/config/links";

const linkClass =
  "text-sm text-foreground-muted transition-colors duration-200 hover:text-foreground-primary focus-visible:text-foreground-primary";

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
          <li><a href="#features" className={linkClass}>{tNav("features")}</a></li>
          <li><a href="#how-it-works" className={linkClass}>{tNav("howItWorks")}</a></li>
          <li><a href="#privacy" className={linkClass}>{tNav("privacy")}</a></li>
          <External href={PLAY_STORE_URL}>{tNav("download")}</External>
        </Column>

        <Column title={t("project")}>
          <External href={REPO_URL}>{t("links.source")}</External>
          <External href={WEBSITE_REPO_URL}>{t("links.website")}</External>
          <External href={CONTRIBUTING_URL}>{t("links.contributing")}</External>
          <External href={PRIVACY_POLICY_URL}>{t("links.policy")}</External>
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

      {/* Credits and copyright share one line, above the closing divider */}
      <div className={`${container} mt-16`}>
        <div className="flex flex-col gap-6 border-b border-border-subtle pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.625rem] font-semibold tracking-[0.2em] text-foreground-faint uppercase">{t("projectBy")}</p>
            <div className="mt-3 flex items-center gap-5">
              <a href={AOSSIE_URL} target="_blank" rel="noopener noreferrer" className="opacity-80 transition-opacity hover:opacity-100">
                <Image src="/brand/icons/aossie_logo.svg" alt="AOSSIE" width={40} height={40} className="h-10 w-auto" />
              </a>
              <a href={STABILITY_NEXUS_URL} target="_blank" rel="noopener noreferrer" className="opacity-80 transition-opacity hover:opacity-100">
                <Image src="/brand/icons/stability_nexus_logo.svg" alt="Stability Nexus" width={40} height={40} className="h-9 w-auto" />
              </a>
            </div>
          </div>
          <p className="text-xs text-foreground-faint sm:text-right">{t("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
