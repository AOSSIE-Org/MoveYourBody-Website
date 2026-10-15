import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/config/links';

export const dynamic = 'force-static';

/** One entry per locale, each listing its translations. Domain comes from NEXT_PUBLIC_SITE_URL or move.aossie.org. */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}`]));

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    changeFrequency: 'monthly',
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
