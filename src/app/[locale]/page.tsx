"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import DockNavbar from "@/components/dock/DockNavbar";
import Hero from "@/components/hero/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Privacy from "@/components/sections/Privacy";
import OpenSource from "@/components/sections/OpenSource";
import DownloadCta from "@/components/sections/DownloadCta";
import SiteFooter from "@/components/sections/SiteFooter";

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <>
      <DockNavbar />
      <main id="main" className="flex-1">
        <Hero />
        <Manifesto />
        <Features />
        <HowItWorks />
        <Privacy />
        <OpenSource />
        <DownloadCta />
      </main>
      <SiteFooter />
    </>
  );
}
