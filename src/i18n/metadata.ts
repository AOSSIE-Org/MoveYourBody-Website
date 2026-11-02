import type { Metadata } from 'next';
import { AOSSIE_URL, PLAY_STORE_APP_ID, SITE_URL } from '@/config/links';
import { messagesMap, defaultMessages } from './messages';
import { routing } from './routing';

const ogLocales: Record<string, string> = { en: 'en_US', hi: 'hi_IN' };

/** A page other than the home page: its path under each locale (e.g. `/privacy`) and its own title and description */
export interface PageMetadata {
  path: string;
  title: string;
  description: string;
}

/** Metadata for the home page, or for `page` when given; canonical and hreflang URLs carry the page path. */
export function generateLocaleMetadata(locale: string, page?: PageMetadata): Metadata {
  const home = (messagesMap[locale] ?? defaultMessages).Home;
  const metaTitle = page?.title ?? home.metaTitle;
  const metaDescription = page?.description ?? home.metaDescription;
  const pagePath = page?.path ?? '';
  const localeUrl = `${SITE_URL}/${locale}${pagePath}`;
  const ogImage = {
    url: `${SITE_URL}/brand/og-image.jpg`,
    width: 1200,
    height: 630,
    alt: metaTitle,
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: metaTitle,
    description: metaDescription,
    applicationName: 'MoveYourBody',
    keywords: [
      'MoveYourBody',
      'AOSSIE',
      'fitness app',
      'micro-workouts',
      'on-device AI',
      'offline workout app',
      'privacy-first fitness',
      'voice-controlled workouts',
      'open source',
    ],
    authors: [{ name: 'AOSSIE', url: AOSSIE_URL }],
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/brand/icons/MoveYourBody_logo.svg', type: 'image/svg+xml' },
      ],
      apple: '/brand/icons/apple-touch-icon.png',
    },
    alternates: {
      canonical: localeUrl,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${pagePath}`])),
        'x-default': `${SITE_URL}/${routing.defaultLocale}${pagePath}`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: localeUrl,
      siteName: 'MoveYourBody',
      images: [ogImage],
      locale: ogLocales[locale] ?? 'en_US',
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocales[l] ?? l),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@aossie_org',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage.url],
    },
    other: {
      'google-play-app': `app-id=${PLAY_STORE_APP_ID}`,
    },
  };
}
