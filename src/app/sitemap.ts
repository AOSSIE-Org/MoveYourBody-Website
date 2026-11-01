import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { LEGAL_PAGES } from '@/config/legal';
import { SITE_URL } from '@/config/links';
import { SUPPORT_PAGE_PATH } from '@/config/support';

export const dynamic = 'force-static';

/** Pages under each locale: the landing page, the legal documents, then the support page */
const pages: { path: string; changeFrequency: 'monthly' | 'yearly' }[] = [
  { path: '', changeFrequency: 'monthly' },
  ...Object.values(LEGAL_PAGES).map(({ path }) => ({ path, changeFrequency: 'yearly' as const })),
  { path: SUPPORT_PAGE_PATH, changeFrequency: 'yearly' },
];

/** One entry per page and locale, each listing its translations. Domain comes from NEXT_PUBLIC_SITE_URL or move.aossie.org. */
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap(({ path, changeFrequency }) => {
    const languages = Object.fromEntries(routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]));

    return routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency,
      // The landing page leads; legal and support pages rank below every landing page
      priority: path ? 0.3 : locale === routing.defaultLocale ? 1 : 0.8,
      alternates: { languages },
    }));
  });
}
