import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import LegalPage from "@/components/legal/LegalPage";
import { LEGAL_PAGES } from "@/config/legal";
import { generateLocaleMetadata } from "@/i18n/metadata";
import { defaultMessages, messagesMap } from "@/i18n/messages";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const { title, description } = (messagesMap[locale] ?? defaultMessages).Legal.privacy;
  return generateLocaleMetadata(locale, { path: LEGAL_PAGES.privacy.path, title, description });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return <LegalPage locale={locale} page="privacy" />;
}
