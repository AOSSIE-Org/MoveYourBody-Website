import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import { LEGAL_PAGES } from '@/config/legal';
import { SITE_URL } from '@/config/links';
import { SUPPORT_PAGE_PATH } from '@/config/support';
import { routing } from '@/i18n/routing';

describe('Sitemap generation', () => {
  it('generates an entry for every page and supported locale', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(routing.locales.length * (2 + Object.keys(LEGAL_PAGES).length));

    for (const locale of routing.locales) {
      const match = entries.find((e) => e.url === `${SITE_URL}/${locale}`);
      expect(match).toBeDefined();
      expect(match?.changeFrequency).toBe('monthly');
      expect(match?.alternates?.languages).toBeDefined();
      expect(match?.alternates?.languages?.[locale]).toBe(`${SITE_URL}/${locale}`);
    }
  });

  it('sets default locale priority higher than secondary locales', () => {
    const entries = sitemap();
    const defaultEntry = entries.find((e) => e.url === `${SITE_URL}/${routing.defaultLocale}`);
    const secondaryEntry = entries.find((e) => e.url !== `${SITE_URL}/${routing.defaultLocale}`);

    expect(defaultEntry?.priority).toBe(1);
    expect(secondaryEntry?.priority).toBe(0.8);
  });

  it.each([...Object.values(LEGAL_PAGES), { path: SUPPORT_PAGE_PATH }])('lists $path under every locale with its translations', ({ path }) => {
    const entries = sitemap();
    for (const locale of routing.locales) {
      const match = entries.find((e) => e.url === `${SITE_URL}/${locale}${path}`);
      expect(match?.changeFrequency).toBe('yearly');
      expect(match?.priority).toBeLessThan(0.8);
      expect(match?.alternates?.languages).toEqual(
        Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      );
    }
  });
});
