import type { Metadata, Viewport } from "next";
import { Noto_Sans_Devanagari } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { generateLocaleMetadata } from "@/i18n/metadata";
import { messagesMap } from "@/i18n/messages";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { AOSSIE_URL, PLAY_STORE_URL, REPO_URL, SITE_URL } from "@/config/links";
import "./globals.css";

const lexend = localFont({
  src: "../fonts/lexend-latin.woff2",
  variable: "--font-lexend",
  weight: "100 900",
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1f15" },
  ],
  colorScheme: "dark light",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return generateLocaleMetadata(locale);
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params since PageProps and LayoutProps are Promises in Next.js 15/16
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enable static rendering
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  // Schema.org structured data for search engines and AI agents
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: "MoveYourBody",
        description: t("metaDescription"),
        inLanguage: routing.locales,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "AOSSIE",
        url: AOSSIE_URL,
        logo: `${SITE_URL}/brand/icons/aossie_logo.svg`,
      },
      {
        "@type": "MobileApplication",
        "@id": `${SITE_URL}/#application`,
        name: "MoveYourBody",
        description: t("metaDescription"),
        applicationCategory: "HealthApplication",
        operatingSystem: "Android",
        url: `${SITE_URL}/`,
        downloadUrl: PLAY_STORE_URL,
        installUrl: PLAY_STORE_URL,
        image: `${SITE_URL}/brand/og-image.jpg`,
        license: "https://www.gnu.org/licenses/gpl-3.0.html",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        codeRepository: REPO_URL,
        author: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <html
      lang={locale}
      className={`${lexend.variable} ${devanagari.variable} h-full overflow-x-hidden antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* Without JS nothing flips [data-reveal] to "in", so show that content outright */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;translate:none!important}`}</style>
        </noscript>
      </head>
      <body
        className="flex min-h-full flex-col bg-background-primary font-sans text-foreground-primary transition-colors duration-200 ease-in-out"
        suppressHydrationWarning
      >
        <a
          href="#main"
          className="fixed top-3 left-3 z-100 -translate-y-24 rounded-xl bg-button-primary-bg px-4 py-2 text-sm font-semibold text-button-primary-text shadow-dock transition-transform focus-visible:translate-y-0"
        >
          {tCommon("skipToContent")}
        </a>
        <NextIntlClientProvider locale={locale} messages={messagesMap[locale]} timeZone="UTC">
          <ThemeProvider>
            <LenisProvider>{children}</LenisProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
