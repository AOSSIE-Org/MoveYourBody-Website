import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import DockNavbar from "@/components/dock/DockNavbar";
import SiteFooter from "@/components/sections/SiteFooter";
import SupportContent from "@/components/support/SupportContent";
import { container } from "@/components/container";
import { SUPPORT_PAGE_PATH } from "@/config/support";
import { generateLocaleMetadata } from "@/i18n/metadata";
import { defaultMessages, messagesMap } from "@/i18n/messages";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const { title, description } = (messagesMap[locale] ?? defaultMessages).Support;
  return generateLocaleMetadata(locale, { path: SUPPORT_PAGE_PATH, title, description });
}

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <DockNavbar />
      <main id="main" className="flex-1 pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className={container}>
          <SupportContent />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
